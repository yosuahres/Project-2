<script setup>
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, CircleAlert, Pencil, Plus, Search } from 'lucide-vue-next'
import AdminTopbar from '../components/AdminTopbar.vue'
import ItemDialog from '../components/ItemDialog.vue'
import { formatPrice } from '@/data/menu'
import { normalize } from '@/data/menu-search'
import { describeError, moveRow } from '../menu-admin-api'
import { showToast } from '../toast'
import { useMenuRows } from '../use-menu-rows'

const { rows, status, loadError, reload, upsert, remove, groups, categories, itemsIn } =
  useMenuRows()

const ALL = ''
const query = ref('')
const sectionFilter = ref(ALL)
const statusFilter = ref(ALL)

const categoryById = computed(() => new Map(rows.categories.map((row) => [row.id, row])))

// Items in menu order: section by section, then their own order.
const orderedItems = computed(() => categories.value.flatMap((category) => itemsIn(category.id)))

const matchesStatus = (item) =>
  statusFilter.value === ALL ||
  (statusFilter.value === 'shown' && item.is_available) ||
  (statusFilter.value === 'hidden' && !item.is_available) ||
  (statusFilter.value === 'popular' && item.popular_rank != null)

const visibleItems = computed(() => {
  const words = normalize(query.value).split(' ').filter(Boolean)
  return orderedItems.value.filter((item) => {
    if (sectionFilter.value !== ALL && item.category_id !== sectionFilter.value) return false
    if (!matchesStatus(item)) return false
    const name = normalize(item.name)
    return words.every((word) => name.includes(word))
  })
})

// Moving up and down only makes sense when the list is exactly one section, in full.
const canReorder = computed(
  () => sectionFilter.value !== ALL && statusFilter.value === ALL && !query.value.trim(),
)

const sectionName = (item) => categoryById.value.get(item.category_id)?.name_en ?? '—'
const isSectionHidden = (item) => categoryById.value.get(item.category_id)?.is_visible === false

// The dialog: an item to edit, `null` for a new one, or `undefined` while closed.
const editing = ref(undefined)
const newItemCategoryId = computed(() =>
  sectionFilter.value !== ALL ? sectionFilter.value : categories.value[0]?.id,
)

const onSaved = (item) => {
  const isNew = editing.value === null
  upsert('item', item)
  editing.value = undefined
  showToast(isNew ? `Added “${item.name}”.` : `Saved “${item.name}”.`)
}

const onDeleted = (id) => {
  const name = rows.items.find((item) => item.id === id)?.name
  remove('item', id)
  editing.value = undefined
  showToast(`Deleted “${name}”.`)
}

const isMoving = ref(false)

const move = async (index, direction) => {
  isMoving.value = true
  try {
    upsert('item', ...(await moveRow('item', itemsIn(sectionFilter.value), index, direction)))
  } catch (cause) {
    showToast(describeError(cause), 'error')
  } finally {
    isMoving.value = false
  }
}
</script>

<template>
  <AdminTopbar title="Menu Items">
    <button
      type="button"
      class="admin-button admin-button--primary"
      :disabled="status !== 'ready' || !categories.length"
      @click="editing = null"
    >
      <Plus :size="16" :stroke-width="2" />
      <span class="wide-only">New Item</span>
    </button>
  </AdminTopbar>

  <main class="page">
    <section class="admin-section">
      <div class="admin-section__inner admin-section__inner--wide">
        <p v-if="status === 'loading'" class="admin-empty">Loading the menu…</p>

        <div v-else-if="status === 'error'" class="admin-form">
          <p class="admin-error" role="alert">
            <CircleAlert :size="16" aria-hidden="true" />
            <span>{{ loadError }}</span>
          </p>
          <button type="button" class="admin-button retry" @click="reload">Try again</button>
        </div>

        <template v-else>
          <div class="admin-toolbar">
            <label class="admin-search">
              <Search :size="16" :stroke-width="1.75" />
              <span class="visually-hidden">Search items</span>
              <input
                v-model="query"
                class="admin-toolbar-input"
                type="search"
                placeholder="Search items"
              />
            </label>
            <label>
              <span class="visually-hidden">Section</span>
              <select v-model="sectionFilter" class="admin-toolbar-input">
                <option :value="ALL">All sections</option>
                <optgroup v-for="group in groups" :key="group.id" :label="group.name_en">
                  <option
                    v-for="category in categories.filter((row) => row.group_id === group.id)"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name_en }}
                  </option>
                </optgroup>
              </select>
            </label>
            <label>
              <span class="visually-hidden">Status</span>
              <select v-model="statusFilter" class="admin-toolbar-input">
                <option :value="ALL">Any status</option>
                <option value="shown">Shown</option>
                <option value="hidden">Hidden</option>
                <option value="popular">Most ordered</option>
              </select>
            </label>
            <span class="admin-muted count">
              {{ visibleItems.length }} of {{ rows.items.length }} items
            </span>
          </div>

          <p v-if="!canReorder" class="admin-hint hint">
            Pick one section to change the order items are listed in.
          </p>

          <div class="admin-table-frame">
            <table class="admin-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Section</th>
                  <th scope="col" class="is-number">Price</th>
                  <th scope="col">Status</th>
                  <th scope="col" class="is-actions">
                    <span class="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in visibleItems" :key="item.id">
                  <td class="is-strong">
                    <button type="button" class="name-button" @click="editing = item">
                      {{ item.name }}
                    </button>
                  </td>
                  <td>{{ sectionName(item) }}</td>
                  <td class="is-number is-strong">{{ formatPrice(item.price) }}</td>
                  <td>
                    <span class="badges">
                      <span v-if="!item.is_available" class="admin-badge">Hidden</span>
                      <span v-else-if="isSectionHidden(item)" class="admin-badge">
                        Section hidden
                      </span>
                      <span v-else class="shown">Shown</span>
                      <span
                        v-if="item.popular_rank != null"
                        class="admin-badge admin-badge--accent"
                      >
                        Most ordered #{{ item.popular_rank }}
                      </span>
                    </span>
                  </td>
                  <td class="is-actions">
                    <template v-if="canReorder">
                      <button
                        type="button"
                        class="admin-icon-button"
                        :aria-label="`Move ${item.name} up`"
                        :disabled="isMoving || index === 0"
                        @click="move(index, -1)"
                      >
                        <ArrowUp :size="16" :stroke-width="1.75" />
                      </button>
                      <button
                        type="button"
                        class="admin-icon-button"
                        :aria-label="`Move ${item.name} down`"
                        :disabled="isMoving || index === visibleItems.length - 1"
                        @click="move(index, 1)"
                      >
                        <ArrowDown :size="16" :stroke-width="1.75" />
                      </button>
                    </template>
                    <button
                      type="button"
                      class="admin-icon-button"
                      :aria-label="`Edit ${item.name}`"
                      @click="editing = item"
                    >
                      <Pencil :size="16" :stroke-width="1.75" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-if="!visibleItems.length" class="admin-empty">No items match.</p>
          </div>
        </template>
      </div>
    </section>
  </main>

  <ItemDialog
    v-if="editing !== undefined"
    :item="editing"
    :category-id="editing?.category_id ?? newItemCategoryId"
    :groups="groups"
    :categories="categories"
    :items="rows.items"
    @close="editing = undefined"
    @saved="onSaved"
    @deleted="onDeleted"
  />
</template>

<style scoped>
.page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.count {
  margin-left: auto;
  font-size: 13px;
}

.hint {
  margin: 12px 0 8px;
}

.admin-toolbar + .admin-table-frame {
  margin-top: 16px;
}

.retry {
  align-self: flex-start;
}

.name-button {
  color: var(--n-900);
  font-weight: 500;
  text-align: left;
}

.name-button:hover {
  text-decoration: underline;
  text-underline-offset: 4px;
}

.badges {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
}

.shown {
  color: var(--n-500);
  font-size: 13px;
}

.wide-only {
  display: none;
}

@media (min-width: 640px) {
  .wide-only {
    display: inline;
  }
}
</style>
