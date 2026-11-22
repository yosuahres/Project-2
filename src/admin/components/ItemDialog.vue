<script setup>
import { computed, reactive } from 'vue'
import { CircleAlert } from 'lucide-vue-next'
import AdminDialog from './AdminDialog.vue'
import DialogFooter from './DialogFooter.vue'
import { formatPrice } from '@/data/menu'
import { deleteRow, nextSortOrder, saveRow } from '../menu-admin-api'
import { useDialogForm } from '../use-dialog-form'

const props = defineProps({
  // The item to edit, or null to add one to `categoryId`.
  item: { type: Object, default: null },
  categoryId: { type: String, required: true },
  // Every group and category, for the Section picker.
  groups: { type: Array, required: true },
  categories: { type: Array, required: true },
  // Every item, so a new or moved item can be put at the end of its section.
  items: { type: Array, required: true },
})

const emit = defineEmits(['close', 'saved', 'deleted'])
const { error, isBusy, run } = useDialogForm()

const form = reactive({
  name: props.item?.name ?? '',
  price: props.item ? String(props.item.price) : '',
  category_id: props.item?.category_id ?? props.categoryId,
  is_available: props.item?.is_available ?? true,
  popular_rank: props.item?.popular_rank != null ? String(props.item.popular_rank) : '',
})

const sectionOptions = computed(() =>
  props.groups.map((group) => ({
    group,
    categories: props.categories.filter((category) => category.group_id === group.id),
  })),
)

// Accepts "80000", "80.000" or "Rp 80.000": only the digits count.
const priceValue = computed(() => {
  const digits = form.price.replace(/\D/g, '')
  return digits === '' ? null : Number(digits)
})

const pricePreview = computed(() =>
  priceValue.value === null ? 'Whole rupiah, no decimals.' : formatPrice(priceValue.value),
)

const save = () =>
  run(async () => {
    if (!form.name.trim()) throw new Error('Give the item a name.')
    if (priceValue.value === null) throw new Error('Enter a price in rupiah, e.g. 80000.')

    const values = {
      name: form.name.trim(),
      price: priceValue.value,
      category_id: form.category_id,
      is_available: form.is_available,
      popular_rank: form.popular_rank === '' ? null : Number(form.popular_rank),
    }
    // A new item, or one moved to another section, goes to the end of that section.
    if (!props.item || form.category_id !== props.item.category_id) {
      const others = props.items.filter(
        (other) => other.category_id === form.category_id && other.id !== props.item?.id,
      )
      values.sort_order = nextSortOrder(others)
    }

    emit('saved', await saveRow('item', { id: props.item?.id, ...values }))
  })

const remove = () =>
  run(async () => {
    await deleteRow('item', props.item.id)
    emit('deleted', props.item.id)
  })
</script>

<template>
  <AdminDialog
    :title="item ? 'Edit Item' : 'New Item'"
    :caption="item ? item.name : ''"
    @close="emit('close')"
  >
    <form id="item-form" class="admin-dialog__section admin-form" novalidate @submit.prevent="save">
      <p v-if="error" class="admin-error" role="alert">
        <CircleAlert :size="16" aria-hidden="true" />
        <span>{{ error }}</span>
      </p>

      <div class="admin-field">
        <label for="item-name" class="admin-label">Name</label>
        <input
          id="item-name"
          v-model="form.name"
          class="admin-input"
          maxlength="120"
          placeholder="Nasi Goreng Indah"
          autofocus
        />
      </div>

      <div class="admin-grid">
        <div class="admin-field">
          <label for="item-price" class="admin-label">Price (Rp)</label>
          <input
            id="item-price"
            v-model="form.price"
            class="admin-input"
            inputmode="numeric"
            placeholder="80000"
          />
          <span class="admin-hint">{{ pricePreview }}</span>
        </div>

        <div class="admin-field">
          <label for="item-section" class="admin-label">Section</label>
          <select id="item-section" v-model="form.category_id" class="admin-input">
            <optgroup
              v-for="option in sectionOptions"
              :key="option.group.id"
              :label="option.group.name_en"
            >
              <option v-for="category in option.categories" :key="category.id" :value="category.id">
                {{ category.name_en }}
              </option>
            </optgroup>
          </select>
        </div>
      </div>
    </form>

    <div class="admin-dialog__section admin-form">
      <label class="admin-check">
        <input v-model="form.is_available" type="checkbox" form="item-form" />
        Shown on the menu
      </label>

      <div class="admin-field">
        <label for="item-rank" class="admin-label">“Most ordered” position</label>
        <input
          id="item-rank"
          v-model="form.popular_rank"
          form="item-form"
          class="admin-input"
          type="number"
          min="1"
          max="999"
          placeholder="Leave empty to keep it out"
        />
        <span class="admin-hint">1 is listed first. Use real sales figures, not guesses.</span>
      </div>
    </div>

    <template #footer>
      <DialogFooter
        form="item-form"
        :is-busy="isBusy"
        :delete-noun="item ? 'item' : ''"
        @cancel="emit('close')"
        @delete="remove"
      />
    </template>
  </AdminDialog>
</template>
