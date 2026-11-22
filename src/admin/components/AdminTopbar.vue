<script setup>
import { inject } from 'vue'
import { House, Menu } from 'lucide-vue-next'

// The bar across the top of each admin page, as the finance app's Topbar draws it: the drawer
// button below 1024px, a breadcrumb, and the page's own controls at the right.
defineProps({
  title: { type: String, required: true },
  // The crumb between Home and the title, e.g. "Setup". Omit to leave it out.
  section: { type: String, default: null },
})

const openDrawer = inject('admin:openDrawer')
</script>

<template>
  <header class="topbar">
    <button type="button" class="topbar__trigger" aria-label="Open menu" @click="openDrawer">
      <Menu :size="20" :stroke-width="1.75" />
    </button>

    <nav aria-label="Breadcrumb" class="topbar__crumbs">
      <RouterLink :to="{ name: 'admin-menu' }" aria-label="Home" class="topbar__home">
        <House :size="16" :stroke-width="1.75" />
      </RouterLink>
      <span aria-hidden="true" class="topbar__slash topbar__wide">/</span>
      <template v-if="section">
        <span class="topbar__section">{{ section }}</span>
        <span aria-hidden="true" class="topbar__slash topbar__section">/</span>
      </template>
      <span aria-current="page" class="topbar__title">{{ title }}</span>
      <slot name="status" />
    </nav>

    <div class="topbar__actions">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.topbar {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  height: 56px;
  padding: 0 12px;
  border-bottom: 1px solid var(--line-8);
  background: #ffffff;
}

.topbar__trigger {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-left: -4px;
  border-radius: 6px;
  color: var(--n-600);
}

.topbar__trigger:hover {
  background: var(--n-100);
}

.topbar__crumbs {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.topbar__home {
  display: none;
  color: var(--n-500);
}

.topbar__home:hover {
  color: var(--n-900);
}

.topbar__slash {
  color: var(--n-300);
}

.topbar__wide,
.topbar__section {
  display: none;
}

.topbar__section:not(.topbar__slash) {
  color: var(--n-500);
  font-size: 14px;
}

.topbar__title {
  overflow: hidden;
  color: var(--n-900);
  font-size: 14px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.topbar__actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}

@media (min-width: 640px) {
  .topbar {
    gap: 12px;
    padding: 0 20px;
  }

  .topbar__home,
  .topbar__wide {
    display: block;
  }
}

@media (min-width: 768px) {
  .topbar__section {
    display: inline;
  }
}

@media (min-width: 1024px) {
  .topbar__trigger {
    display: none;
  }
}
</style>
