<script setup>
import { ref } from 'vue'
import AppHeader from '@/components/AppHeader.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import LanguageSheet from '@/components/LanguageSheet.vue'

const isNavOpen = ref(false)
const isLanguageOpen = ref(false)

const openLanguage = () => {
  isNavOpen.value = false
  isLanguageOpen.value = true
}
</script>

<template>
  <div class="app-shell">
    <AppHeader @open-nav="isNavOpen = true" />
    <main class="app-main">
      <RouterView />
    </main>
  </div>

  <SideDrawer :open="isNavOpen" @close="isNavOpen = false" @open-language="openLanguage" />
  <LanguageSheet :open="isLanguageOpen" @close="isLanguageOpen = false" />
</template>

<style scoped>
/* Mobile-first: one phone-width column, centred on larger screens. */
.app-shell {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  max-width: var(--shell-width);
  margin: 0 auto;
  background: var(--color-bg);
}

.app-main {
  padding-bottom: calc(24px + var(--safe-bottom));
}

@media (min-width: 481px) {
  .app-shell {
    box-shadow: 0 0 32px rgba(0, 0, 0, 0.08);
  }
}
</style>
