<script setup>
import { useI18n } from '@/i18n'

defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['loading', 'error'].includes(value),
  },
})

const emit = defineEmits(['retry'])
const { t } = useI18n()
</script>

<template>
  <div class="load-status" role="status">
    <template v-if="status === 'loading'">
      <span class="load-status__spinner" aria-hidden="true" />
      <p>{{ t('menu.loading') }}</p>
    </template>
    <template v-else>
      <p>{{ t('menu.loadError') }}</p>
      <button type="button" class="load-status__retry" @click="emit('retry')">
        {{ t('menu.retry') }}
      </button>
    </template>
  </div>
</template>

<style scoped>
.load-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 16px 12px 0;
  padding: 32px 20px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  color: var(--color-muted);
  font-size: 15px;
  text-align: center;
}

.load-status__spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent-strong);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.load-status__retry {
  min-height: 44px;
  padding: 0 20px;
  border-radius: 999px;
  background: var(--color-text);
  color: var(--color-surface);
  font-size: 15px;
  font-weight: 600;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
