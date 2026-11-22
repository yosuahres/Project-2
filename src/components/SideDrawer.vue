<script setup>
import { computed } from 'vue'
import BaseOverlay from './BaseOverlay.vue'
import AppIcon from './AppIcon.vue'
import logo from '@/assets/icons/ip-logo.png'
import { useI18n } from '@/i18n'

defineProps({
  open: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'open-language'])
const { lang, t } = useI18n()

const links = computed(() => [
  { name: 'menu', icon: 'utensils', label: t('nav.menu') },
  { name: 'fields', icon: 'flag', label: t('nav.fields') },
  { name: 'about', icon: 'info', label: t('nav.about') },
])
</script>

<template>
  <BaseOverlay :open="open" placement="right" :label="t('common.openMenu')" @close="emit('close')">
    <div class="drawer">
      <div class="drawer__top">
        <button
          type="button"
          class="drawer__close"
          :aria-label="t('common.close')"
          @click="emit('close')"
        >
          <AppIcon name="close" />
        </button>
      </div>
      <img :src="logo" alt="Indah Puri" class="drawer__logo" width="343" height="153" />

      <nav class="drawer__nav">
        <RouterLink
          v-for="link in links"
          :key="link.name"
          :to="{ name: link.name, params: { lang } }"
          class="drawer__item"
          @click="emit('close')"
        >
          <AppIcon :name="link.icon" />
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="drawer__divider" />

      <button type="button" class="drawer__item" @click="emit('open-language')">
        <AppIcon name="globe" />
        {{ t('nav.language') }}
        <span class="drawer__meta">{{ t('languageName') }}</span>
      </button>
    </div>
  </BaseOverlay>
</template>

<style scoped>
.drawer {
  display: flex;
  flex-direction: column;
  padding: 0 12px 16px;
}

.drawer__top {
  display: flex;
  justify-content: flex-end;
  padding-top: 6px;
}

.drawer__close {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--color-muted);
}

.drawer__logo {
  width: 160px;
  height: auto;
  margin: 0 auto 24px;
}

.drawer__nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 0 12px;
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 500;
  text-align: left;
}

.drawer__item:active {
  background: var(--color-bg);
}

.drawer__item.router-link-active {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.drawer__meta {
  margin-left: auto;
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 400;
}

.drawer__divider {
  height: 1px;
  margin: 12px 0;
  background: var(--color-border);
}
</style>
