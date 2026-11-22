<script setup>
import { reactive } from 'vue'
import { CircleAlert } from 'lucide-vue-next'
import AdminDialog from './AdminDialog.vue'
import DialogFooter from './DialogFooter.vue'
import { deleteRow, nextSortOrder, saveRow } from '../menu-admin-api'
import { useDialogForm } from '../use-dialog-form'

const props = defineProps({
  // The section to edit, or null to add one to `groupId`.
  category: { type: Object, default: null },
  groupId: { type: String, required: true },
  groups: { type: Array, required: true },
  categories: { type: Array, required: true },
  // How many items sit in this section: one that has any can't be deleted.
  itemCount: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'saved', 'deleted'])
const { error, isBusy, run } = useDialogForm()

const form = reactive({
  name_en: props.category?.name_en ?? '',
  name_id: props.category?.name_id ?? '',
  group_id: props.category?.group_id ?? props.groupId,
  keywords: (props.category?.keywords ?? []).join(', '),
  is_visible: props.category?.is_visible ?? true,
})

const toKeywords = (text) => [
  ...new Set(
    text
      .split(',')
      .map((word) => word.trim().toLowerCase())
      .filter(Boolean),
  ),
]

const save = () =>
  run(async () => {
    if (!form.name_en.trim() || !form.name_id.trim()) {
      throw new Error('Give the section a name in both languages.')
    }
    const values = {
      name_en: form.name_en.trim(),
      name_id: form.name_id.trim(),
      group_id: form.group_id,
      keywords: toKeywords(form.keywords),
      is_visible: form.is_visible,
    }
    // A new section, or one moved under another heading, goes to the end there.
    if (!props.category || form.group_id !== props.category.group_id) {
      const others = props.categories.filter(
        (other) => other.group_id === form.group_id && other.id !== props.category?.id,
      )
      values.sort_order = nextSortOrder(others)
    }
    emit('saved', await saveRow('category', { id: props.category?.id, ...values }))
  })

const remove = () =>
  run(async () => {
    await deleteRow('category', props.category.id)
    emit('deleted', props.category.id)
  })
</script>

<template>
  <AdminDialog
    :title="category ? 'Edit Section' : 'New Section'"
    caption="A tab on the menu, and the list of items under it."
    @close="emit('close')"
  >
    <form
      id="category-form"
      class="admin-dialog__section admin-form"
      novalidate
      @submit.prevent="save"
    >
      <p v-if="error" class="admin-error" role="alert">
        <CircleAlert :size="16" aria-hidden="true" />
        <span>{{ error }}</span>
      </p>

      <div class="admin-grid">
        <div class="admin-field">
          <label for="category-name-en" class="admin-label">Name (English)</label>
          <input
            id="category-name-en"
            v-model="form.name_en"
            class="admin-input"
            maxlength="60"
            placeholder="Rice"
            autofocus
          />
        </div>
        <div class="admin-field">
          <label for="category-name-id" class="admin-label">Name (Indonesia)</label>
          <input
            id="category-name-id"
            v-model="form.name_id"
            class="admin-input"
            maxlength="60"
            placeholder="Nasi"
          />
        </div>
      </div>

      <div class="admin-field">
        <label for="category-group" class="admin-label">Heading</label>
        <select id="category-group" v-model="form.group_id" class="admin-input">
          <option v-for="group in groups" :key="group.id" :value="group.id">
            {{ group.name_en }}
          </option>
        </select>
      </div>

      <div class="admin-field">
        <label for="category-keywords" class="admin-label">Search words</label>
        <input
          id="category-keywords"
          v-model="form.keywords"
          class="admin-input"
          placeholder="beer, bir"
        />
        <span class="admin-hint">
          Comma-separated. Typing any of these lists every item here, for sections whose item names
          don’t say what they are.
        </span>
      </div>

      <label class="admin-check">
        <input v-model="form.is_visible" type="checkbox" />
        Shown on the menu
      </label>
    </form>

    <template #footer>
      <DialogFooter
        form="category-form"
        :is-busy="isBusy"
        :delete-noun="category ? 'section' : ''"
        :delete-blocked-reason="
          itemCount ? `Move or delete its ${itemCount} items before deleting it.` : ''
        "
        @cancel="emit('close')"
        @delete="remove"
      />
    </template>
  </AdminDialog>
</template>
