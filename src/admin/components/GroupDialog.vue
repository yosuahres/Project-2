<script setup>
import { reactive } from 'vue'
import { CircleAlert } from 'lucide-vue-next'
import AdminDialog from './AdminDialog.vue'
import DialogFooter from './DialogFooter.vue'
import { deleteRow, nextSortOrder, saveRow } from '../menu-admin-api'
import { useDialogForm } from '../use-dialog-form'

const props = defineProps({
  // The heading to edit, or null to add one.
  group: { type: Object, default: null },
  groups: { type: Array, required: true },
  // How many sections sit under this heading: one that has any can't be deleted.
  categoryCount: { type: Number, default: 0 },
})

const emit = defineEmits(['close', 'saved', 'deleted'])
const { error, isBusy, run } = useDialogForm()

const form = reactive({
  name_en: props.group?.name_en ?? '',
  name_id: props.group?.name_id ?? '',
})

const save = () =>
  run(async () => {
    if (!form.name_en.trim() || !form.name_id.trim()) {
      throw new Error('Give the heading a name in both languages.')
    }
    const values = { name_en: form.name_en.trim(), name_id: form.name_id.trim() }
    if (!props.group) values.sort_order = nextSortOrder(props.groups)
    emit('saved', await saveRow('group', { id: props.group?.id, ...values }))
  })

const remove = () =>
  run(async () => {
    await deleteRow('group', props.group.id)
    emit('deleted', props.group.id)
  })
</script>

<template>
  <AdminDialog
    :title="group ? 'Edit Heading' : 'New Heading'"
    caption="A big heading on the menu, such as Food or Drinks."
    @close="emit('close')"
  >
    <form
      id="group-form"
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
          <label for="group-name-en" class="admin-label">Name (English)</label>
          <input
            id="group-name-en"
            v-model="form.name_en"
            class="admin-input"
            maxlength="60"
            placeholder="Food"
            autofocus
          />
        </div>
        <div class="admin-field">
          <label for="group-name-id" class="admin-label">Name (Indonesia)</label>
          <input
            id="group-name-id"
            v-model="form.name_id"
            class="admin-input"
            maxlength="60"
            placeholder="Makanan"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <DialogFooter
        form="group-form"
        :is-busy="isBusy"
        :delete-noun="group ? 'heading' : ''"
        :delete-blocked-reason="
          categoryCount ? `Move or delete its ${categoryCount} sections before deleting it.` : ''
        "
        @cancel="emit('close')"
        @delete="remove"
      />
    </template>
  </AdminDialog>
</template>
