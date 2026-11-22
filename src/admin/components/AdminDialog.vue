<script setup>
import { onMounted, ref } from 'vue'
import { X } from 'lucide-vue-next'

// A modal panel, drawn as the finance app's transaction panel: a sticky header, the body, and a
// sticky footer for the buttons. The native <dialog> traps focus, closes on Escape and gives focus
// back afterwards. Mount it with v-if when it should open; it emits `close` when dismissed.
defineProps({
  title: { type: String, required: true },
  // Shown under the title, e.g. which section an item sits in.
  caption: { type: String, default: '' },
})

const emit = defineEmits(['close'])
const dialog = ref(null)

onMounted(() => dialog.value.showModal())

// A click on the backdrop lands on the <dialog> itself, not on anything inside it.
const onClick = (event) => {
  if (event.target === dialog.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="admin admin-dialog"
    :aria-label="title"
    @cancel.prevent="emit('close')"
    @click="onClick"
  >
    <header class="admin-dialog__header">
      <div class="admin-dialog__heading">
        <h2>{{ title }}</h2>
        <p v-if="caption">{{ caption }}</p>
      </div>
      <button type="button" class="admin-icon-button" aria-label="Close" @click="emit('close')">
        <X :size="16" :stroke-width="2" />
      </button>
    </header>
    <slot />
    <footer v-if="$slots.footer" class="admin-dialog__footer">
      <slot name="footer" />
    </footer>
  </dialog>
</template>

<style scoped>
.admin-dialog {
  width: 32rem;
  max-width: calc(100vw - 2rem);
  max-height: calc(100dvh - 2rem);
  margin: auto;
  padding: 0;
  overflow-x: hidden;
  overflow-y: auto;
  border: 1px solid var(--line-10);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: var(--shadow-xl);
}

.admin-dialog::backdrop {
  background: rgba(0, 0, 0, 0.4);
}

.admin-dialog__header {
  position: sticky;
  top: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 16px;
  border-bottom: 1px solid var(--line-8);
  background: #ffffff;
}

.admin-dialog__heading {
  flex: 1;
  min-width: 0;
}

.admin-dialog__heading h2 {
  color: var(--n-900);
  font-size: 14px;
  font-weight: 600;
}

.admin-dialog__heading p {
  color: var(--n-500);
  font-size: 12px;
}

.admin-dialog__footer {
  position: sticky;
  bottom: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--line-8);
  background: #ffffff;
}

/* A block of the dialog's body. Global so the forms that fill the slot can use it. */
:slotted(.admin-dialog__section) {
  padding: 24px 16px;
}

:slotted(.admin-dialog__section + .admin-dialog__section) {
  border-top: 1px solid var(--line-8);
}

@media (min-width: 640px) {
  .admin-dialog__header,
  .admin-dialog__footer {
    padding-right: 20px;
    padding-left: 20px;
  }

  :slotted(.admin-dialog__section) {
    padding-right: 24px;
    padding-left: 24px;
  }
}
</style>
