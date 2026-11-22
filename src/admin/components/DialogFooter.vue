<script setup>
import { ref } from 'vue'
import { Trash2 } from 'lucide-vue-next'

// The buttons along a dialog's foot, as the finance app's panel lays them out: Delete at the
// left (asking once more, in place), Cancel and Save at the right.
defineProps({
  // The id of the <form> the Save button submits.
  form: { type: String, required: true },
  isBusy: { type: Boolean, default: false },
  // Names the thing in "Delete this item?". Omit to offer no Delete.
  deleteNoun: { type: String, default: '' },
  // Why Delete is unavailable, e.g. "Move its items out first". Shown instead of the button.
  deleteBlockedReason: { type: String, default: '' },
})

const emit = defineEmits(['cancel', 'delete'])
const isConfirming = ref(false)
</script>

<template>
  <template v-if="isConfirming">
    <span class="confirm">Delete this {{ deleteNoun }}?</span>
    <button type="button" class="admin-button admin-button--ghost" @click="isConfirming = false">
      Keep
    </button>
    <button
      type="button"
      class="admin-button admin-button--danger"
      :disabled="isBusy"
      @click="emit('delete')"
    >
      {{ isBusy ? 'Deleting…' : 'Delete' }}
    </button>
  </template>

  <template v-else>
    <span v-if="deleteNoun && deleteBlockedReason" class="blocked">{{ deleteBlockedReason }}</span>
    <button
      v-else-if="deleteNoun"
      type="button"
      class="admin-button admin-button--danger-ghost lead"
      :disabled="isBusy"
      @click="isConfirming = true"
    >
      <Trash2 :size="16" :stroke-width="1.75" />
      Delete
    </button>
    <button type="button" class="admin-button" :disabled="isBusy" @click="emit('cancel')">
      Cancel
    </button>
    <button
      type="submit"
      :form="form"
      class="admin-button admin-button--primary"
      :disabled="isBusy"
    >
      {{ isBusy ? 'Saving…' : 'Save' }}
    </button>
  </template>
</template>

<style scoped>
.confirm,
.blocked {
  margin-right: auto;
  color: var(--n-700);
  font-size: 14px;
}

.blocked {
  color: var(--n-500);
  font-size: 12px;
}

.lead {
  margin-right: auto;
}
</style>
