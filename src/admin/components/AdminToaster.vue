<script setup>
import { CircleCheck, CircleX, X } from 'lucide-vue-next'
import { dismissToast, toasts } from '../toast'
</script>

<template>
  <div class="toaster">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="toast"
      :class="`toast--${toast.kind}`"
      :role="toast.kind === 'error' ? 'alert' : 'status'"
    >
      <component
        :is="toast.kind === 'success' ? CircleCheck : CircleX"
        :size="20"
        :stroke-width="2"
        class="toast__icon"
      />
      <p class="toast__message">{{ toast.message }}</p>
      <button
        type="button"
        class="admin-icon-button"
        aria-label="Dismiss"
        @click="dismissToast(toast.id)"
      >
        <X :size="16" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.toaster {
  position: fixed;
  top: 12px;
  right: 0;
  left: 0;
  z-index: 60;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  max-width: 384px;
  margin-left: auto;
  padding: 0 12px;
  pointer-events: none;
}

.toast {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 8px 12px 16px;
  border: 1px solid;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  color: var(--n-800);
  font-size: 14px;
  pointer-events: auto;
}

.toast--success {
  border-color: #d1fae5;
  background: var(--emerald-50);
}

.toast--error {
  border-color: #ffe4e6;
  background: var(--rose-50);
}

.toast__icon {
  color: #ffffff;
}

.toast--success .toast__icon {
  fill: #10b981;
}

.toast--error .toast__icon {
  fill: var(--rose-500);
}

.toast__message {
  flex: 1;
  min-width: 0;
}

@media (min-width: 640px) {
  .toaster {
    top: 16px;
    right: 16px;
    padding: 0;
  }
}
</style>
