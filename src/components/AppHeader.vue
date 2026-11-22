<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/i18n'
import { useWindowScrolled } from '@/composables/useWindowScrolled'

const emit = defineEmits(['open-nav'])

const route = useRoute()
const router = useRouter()
const { lang, t } = useI18n()
const isScrolled = useWindowScrolled(24)

const showBack = computed(() => Boolean(route.meta.showBack))
const isSolid = computed(() => isScrolled.value || showBack.value)

const goBack = () => {
  // Visitors often land straight on a page from a QR code, so there may be no history to go back to.
  if (window.history.state?.back) router.back()
  else router.push({ name: 'menu', params: { lang: lang.value } })
}
</script>

<template>
  <header class="app-header" :class="{ 'is-solid': isSolid }">
    <button
      v-if="showBack"
      type="button"
      class="icon-button"
      :aria-label="t('common.back')"
      @click="goBack"
    >
      <AppIcon name="back" :size="22" />
    </button>

    <Transition name="fade">
      <span v-if="isSolid" class="app-header__title">Indah Puri</span>
    </Transition>

    <button
      type="button"
      class="icon-button app-header__menu"
      :aria-label="t('common.openMenu')"
      @click="emit('open-nav')"
    >
      <AppIcon name="menu" :size="22" />
    </button>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 4px;
  height: calc(var(--header-height) + var(--safe-top));
  padding: var(--safe-top) 6px 0;
  background: transparent;
  transition:
    background-color 0.2s ease,
    box-shadow 0.2s ease;
}

.app-header.is-solid {
  background: var(--color-surface);
  box-shadow: 0 1px 0 var(--color-border);
}

.app-header__title {
  padding-left: 10px;
  font-size: 17px;
  font-weight: 700;
}

.icon-button + .app-header__title {
  padding-left: 0;
}

.app-header__menu {
  margin-left: auto;
}

.icon-button {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.icon-button:active {
  background: rgba(0, 0, 0, 0.06);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
