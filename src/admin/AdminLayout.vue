<script setup>
import { provide, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import './admin.css'
import AdminSidebar from './components/AdminSidebar.vue'
import AdminToaster from './components/AdminToaster.vue'

// The frame the admin pages sit in, as the finance app's ModuleShell draws it: a fixed rail on
// wide screens, a drawer below 1024px that the top bar's menu button opens.
const isDrawerOpen = ref(false)
provide('admin:openDrawer', () => (isDrawerOpen.value = true))

const route = useRoute()
watch(
  () => route.fullPath,
  () => (isDrawerOpen.value = false),
)

const onKeydown = (event) => {
  if (event.key === 'Escape') isDrawerOpen.value = false
}
</script>

<template>
  <div class="admin admin-shell" @keydown="onKeydown">
    <aside class="admin-shell__rail">
      <AdminSidebar />
    </aside>

    <div class="admin-shell__drawer" :class="{ 'is-open': isDrawerOpen }" :inert="!isDrawerOpen">
      <div class="admin-shell__scrim" aria-hidden="true" @click="isDrawerOpen = false" />
      <div
        class="admin-shell__panel"
        role="dialog"
        :aria-modal="isDrawerOpen"
        aria-label="Navigation"
      >
        <AdminSidebar can-close @close="isDrawerOpen = false" />
      </div>
    </div>

    <div class="admin-shell__page">
      <RouterView />
    </div>

    <AdminToaster />
  </div>
</template>

<style scoped>
.admin-shell {
  /* Positioned, so the visually hidden labels inside (position: absolute) are clipped here
     rather than stretching the whole document and letting the window scroll past the frame. */
  position: relative;
  display: flex;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
}

.admin-shell__rail {
  display: none;
  flex-direction: column;
  flex-shrink: 0;
  width: 184px;
  border-right: 1px solid var(--line-8);
  background: var(--n-50);
}

.admin-shell__drawer {
  position: fixed;
  inset: 0;
  z-index: 40;
  pointer-events: none;
}

.admin-shell__drawer.is-open {
  pointer-events: auto;
}

.admin-shell__scrim {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.admin-shell__panel {
  position: absolute;
  inset: 0 auto 0 0;
  display: flex;
  flex-direction: column;
  width: 256px;
  max-width: 85vw;
  border-right: 1px solid var(--line-8);
  background: var(--n-50);
  box-shadow: var(--shadow-xl);
  transform: translateX(-100%);
  transition: transform 0.2s ease;
}

.admin-shell__drawer.is-open .admin-shell__scrim {
  opacity: 1;
}

.admin-shell__drawer.is-open .admin-shell__panel {
  transform: translateX(0);
}

.admin-shell__page {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

@media (min-width: 1024px) {
  .admin-shell__rail {
    display: flex;
  }

  .admin-shell__drawer {
    display: none;
  }
}
</style>
