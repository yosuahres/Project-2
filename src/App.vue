<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import SideDrawer from '@/components/SideDrawer.vue'
import LanguageSheet from '@/components/LanguageSheet.vue'

// Admin pages bring their own frame, without the guest header and drawer.
const route = useRoute()
const isAdminPage = computed(() => Boolean(route.meta.admin))

const isNavOpen = ref(false)
const isLanguageOpen = ref(false)

const openLanguage = () => {
  isNavOpen.value = false
  isLanguageOpen.value = true
}
</script>

<template>
  <RouterView v-if="isAdminPage" />

  <template v-else>
    <div class="app-shell">
      <AppHeader @open-nav="isNavOpen = true" />
      <main class="app-main">
        <RouterView />
      </main>
    </div>

    <SideDrawer :open="isNavOpen" @close="isNavOpen = false" @open-language="openLanguage" />
    <LanguageSheet :open="isLanguageOpen" @close="isLanguageOpen = false" />
  </template>
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
