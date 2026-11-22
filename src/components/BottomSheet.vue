<script setup>
import BaseOverlay from './BaseOverlay.vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/i18n'

defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, required: true },
})

const emit = defineEmits(['close'])
const { t } = useI18n()
</script>

<template>
  <BaseOverlay :open="open" placement="bottom" :label="title" @close="emit('close')">
    <div class="sheet">
      <div class="sheet__handle" aria-hidden="true" />
      <header class="sheet__header">
        <h2 class="sheet__title">{{ title }}</h2>
        <button
          class="sheet__close"
          type="button"
          :aria-label="t('common.close')"
          @click="emit('close')"
        >
          <AppIcon name="close" />
        </button>
      </header>
      <div class="sheet__body">
        <slot />
      </div>
    </div>
  </BaseOverlay>
</template>

<style scoped>
.sheet {
  padding: 8px 16px 16px;
}

.sheet__handle {
  width: 40px;
  height: 4px;
  margin: 0 auto 8px;
  border-radius: 2px;
  background: var(--color-border);
}

.sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  margin-bottom: 8px;
}

.sheet__title {
  font-size: 17px;
  font-weight: 700;
}

.sheet__close {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-right: -10px;
  color: var(--color-muted);
}
</style>
