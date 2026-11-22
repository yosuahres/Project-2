<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { CircleAlert } from 'lucide-vue-next'
import AdminTopbar from '../components/AdminTopbar.vue'
import { describeError, fetchOutletRows, saveOutlet } from '../menu-admin-api'
import { showToast } from '../toast'

// Monday first, as the guest About page lists them. Numbers match Date#getDay(): 0 = Sunday.
const DAYS = [
  { day: 1, name: 'Monday' },
  { day: 2, name: 'Tuesday' },
  { day: 3, name: 'Wednesday' },
  { day: 4, name: 'Thursday' },
  { day: 5, name: 'Friday' },
  { day: 6, name: 'Saturday' },
  { day: 0, name: 'Sunday' },
]

const status = ref('loading')
const error = ref('')
const isSaving = ref(false)

const outlet = reactive({ name: '', address: '', phone: '', maps_url: '' })
const hours = reactive(
  Object.fromEntries(
    DAYS.map(({ day }) => [day, { opens_at: '06:00', closes_at: '19:00', is_closed: false }]),
  ),
)

// What was last loaded or saved, to tell whether anything has changed since.
const savedSnapshot = ref('')
const snapshot = () => JSON.stringify({ outlet, hours })
const isDirty = computed(() => status.value === 'ready' && snapshot() !== savedSnapshot.value)

const load = async () => {
  status.value = 'loading'
  try {
    const rows = await fetchOutletRows()
    Object.assign(outlet, rows.outlet)
    for (const row of rows.hours) {
      hours[row.day] = {
        opens_at: row.opens_at.slice(0, 5),
        closes_at: row.closes_at.slice(0, 5),
        is_closed: row.is_closed,
      }
    }
    savedSnapshot.value = snapshot()
    status.value = 'ready'
  } catch (cause) {
    error.value = describeError(cause)
    status.value = 'error'
  }
}

onMounted(load)

const save = async () => {
  error.value = ''
  if (!outlet.name.trim()) {
    error.value = 'Give the outlet a name.'
    return
  }
  const openDays = DAYS.filter(({ day }) => !hours[day].is_closed)
  if (openDays.some(({ day }) => !hours[day].opens_at || !hours[day].closes_at)) {
    error.value = 'Every open day needs an opening and a closing time.'
    return
  }

  isSaving.value = true
  try {
    await saveOutlet(
      {
        name: outlet.name.trim(),
        address: outlet.address.trim(),
        phone: outlet.phone.trim(),
        maps_url: outlet.maps_url.trim(),
      },
      DAYS.map(({ day }) => ({ day, ...hours[day] })),
    )
    savedSnapshot.value = snapshot()
    showToast('Saved the outlet and its hours.')
  } catch (cause) {
    error.value = describeError(cause)
  } finally {
    isSaving.value = false
  }
}

// Copies Monday's hours to every other day, the common case.
const copyMondayToAll = () => {
  for (const { day } of DAYS) hours[day] = { ...hours[1] }
}
</script>

<template>
  <AdminTopbar title="Outlet & Hours" section="Setup">
    <template #status>
      <span v-if="isDirty" class="not-saved">Not Saved</span>
    </template>
    <button
      type="submit"
      form="outlet-form"
      class="admin-button admin-button--primary"
      :disabled="status !== 'ready' || isSaving"
    >
      {{ isSaving ? 'Saving…' : 'Save' }}
    </button>
  </AdminTopbar>

  <main class="page">
    <section v-if="status !== 'ready'" class="admin-section">
      <div class="admin-section__inner">
        <p v-if="status === 'loading'" class="admin-empty">Loading…</p>
        <div v-else class="admin-form">
          <p class="admin-error" role="alert">
            <CircleAlert :size="16" aria-hidden="true" />
            <span>{{ error }}</span>
          </p>
          <button type="button" class="admin-button retry" @click="load">Try again</button>
        </div>
      </div>
    </section>

    <form v-else id="outlet-form" novalidate @submit.prevent="save">
      <section v-if="error" class="admin-section admin-section--tight">
        <div class="admin-section__inner">
          <p class="admin-error" role="alert">
            <CircleAlert :size="16" aria-hidden="true" />
            <span>{{ error }}</span>
          </p>
        </div>
      </section>

      <section class="admin-section">
        <div class="admin-section__inner">
          <h2 class="admin-section__title">Outlet</h2>
          <div class="admin-grid">
            <div class="admin-field">
              <label for="outlet-name" class="admin-label">Name</label>
              <input id="outlet-name" v-model="outlet.name" class="admin-input" maxlength="80" />
            </div>
            <div class="admin-field">
              <label for="outlet-phone" class="admin-label">Phone</label>
              <input
                id="outlet-phone"
                v-model="outlet.phone"
                class="admin-input"
                type="tel"
                maxlength="30"
                placeholder="+62…"
              />
              <span class="admin-hint">The “Contact us” button on the About page calls this.</span>
            </div>
            <div class="admin-field admin-span-2">
              <label for="outlet-address" class="admin-label">Address</label>
              <textarea
                id="outlet-address"
                v-model="outlet.address"
                class="admin-input"
                maxlength="300"
              />
            </div>
            <div class="admin-field admin-span-2">
              <label for="outlet-maps" class="admin-label">Google Maps link</label>
              <input
                id="outlet-maps"
                v-model="outlet.maps_url"
                class="admin-input"
                type="url"
                maxlength="300"
                placeholder="https://maps.app.goo.gl/…"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="admin-section">
        <div class="admin-section__inner">
          <div class="hours-head">
            <h2 class="admin-section__title">Opening Hours</h2>
            <button type="button" class="admin-button admin-button--ghost" @click="copyMondayToAll">
              Copy Monday to every day
            </button>
          </div>

          <div class="admin-table-frame">
            <table class="admin-table">
              <thead>
                <tr>
                  <th scope="col">Day</th>
                  <th scope="col">Opens</th>
                  <th scope="col">Closes</th>
                  <th scope="col">Closed all day</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="{ day, name } in DAYS" :key="day">
                  <td class="is-strong">{{ name }}</td>
                  <td>
                    <input
                      v-model="hours[day].opens_at"
                      class="admin-input time"
                      type="time"
                      :aria-label="`${name} opens`"
                      :disabled="hours[day].is_closed"
                    />
                  </td>
                  <td>
                    <input
                      v-model="hours[day].closes_at"
                      class="admin-input time"
                      type="time"
                      :aria-label="`${name} closes`"
                      :disabled="hours[day].is_closed"
                    />
                  </td>
                  <td>
                    <label class="admin-check">
                      <input v-model="hours[day].is_closed" type="checkbox" />
                      Closed
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </form>
  </main>
</template>

<style scoped>
.page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.retry {
  align-self: flex-start;
}

.admin-section--tight {
  padding-bottom: 0;
  border-bottom: none;
}

.not-saved {
  display: none;
  margin-left: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--orange-100);
  color: var(--orange-700);
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.hours-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.time {
  width: 130px;
  height: 36px;
}

@media (min-width: 640px) {
  .not-saved {
    display: inline;
  }
}
</style>
