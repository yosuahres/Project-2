<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronDown,
  ChevronRight,
  ExternalLink,
  LogOut,
  Settings2,
  UtensilsCrossed,
  X,
} from 'lucide-vue-next'
import { adminUser, signOut } from '../auth'

// The finance app's sidebar body: the app's name at the top, pinned links, a collapsible Setup
// group, and who is signed in at the foot.
defineProps({
  // In the drawer, a close button sits beside the title.
  canClose: { type: Boolean, default: false },
})
const emit = defineEmits(['close'])

const LINKS = [{ label: 'Menu Items', to: { name: 'admin-menu' }, icon: UtensilsCrossed }]
const SETUP = [
  { label: 'Sections', to: { name: 'admin-sections' } },
  { label: 'Outlet & Hours', to: { name: 'admin-outlet' } },
]

const isSetupOpen = ref(true)

const email = computed(() => adminUser.value?.email ?? '')
const initials = computed(() => email.value.slice(0, 2).toUpperCase())

const isUserMenuOpen = ref(false)
const userMenu = ref(null)

const closeOnOutsidePointer = (event) => {
  if (!userMenu.value?.contains(event.target)) isUserMenuOpen.value = false
}
watch(isUserMenuOpen, (open) => {
  if (open) document.addEventListener('pointerdown', closeOnOutsidePointer)
  else document.removeEventListener('pointerdown', closeOnOutsidePointer)
})
onBeforeUnmount(() => document.removeEventListener('pointerdown', closeOnOutsidePointer))

const router = useRouter()
const isSigningOut = ref(false)

const logout = async () => {
  isSigningOut.value = true
  try {
    await signOut()
  } finally {
    router.replace({ name: 'admin-login' })
  }
}
</script>

<template>
  <div class="sidebar__head">
    <div class="sidebar__app">
      <span class="sidebar__tile" aria-hidden="true">IP</span>
      <span class="sidebar__app-text">
        <span class="sidebar__app-name">Indah Puri</span>
        <span class="sidebar__app-module">Restaurant Menu</span>
      </span>
    </div>
    <button
      v-if="canClose"
      type="button"
      class="sidebar__close"
      aria-label="Close menu"
      @click="emit('close')"
    >
      <X :size="20" :stroke-width="1.75" />
    </button>
  </div>

  <nav class="sidebar__nav" aria-label="Menu admin">
    <ul class="sidebar__links">
      <li v-for="link in LINKS" :key="link.label">
        <RouterLink :to="link.to" class="sidebar__link">
          <component :is="link.icon" :size="14" :stroke-width="1.75" class="sidebar__icon" />
          <span>{{ link.label }}</span>
        </RouterLink>
      </li>
    </ul>

    <button
      type="button"
      class="sidebar__group"
      :aria-expanded="isSetupOpen"
      @click="isSetupOpen = !isSetupOpen"
    >
      <Settings2 :size="14" :stroke-width="1.75" class="sidebar__icon" />
      <span>Setup</span>
      <component
        :is="isSetupOpen ? ChevronDown : ChevronRight"
        :size="14"
        :stroke-width="2"
        class="sidebar__chevron"
      />
    </button>
    <ul v-if="isSetupOpen" class="sidebar__links">
      <li v-for="item in SETUP" :key="item.label">
        <RouterLink :to="item.to" class="sidebar__link sidebar__link--sub">
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>
  </nav>

  <div ref="userMenu" class="sidebar__foot">
    <div v-if="isUserMenuOpen" class="user-menu" role="menu">
      <div class="user-menu__who">
        <span class="user-menu__tile">{{ initials }}</span>
        <span class="user-menu__text">
          <span class="user-menu__role">Menu admin</span>
          <span class="user-menu__email">{{ email }}</span>
        </span>
      </div>
      <div class="user-menu__actions">
        <a href="/" target="_blank" rel="noopener" role="menuitem" class="user-menu__row">
          <ExternalLink :size="16" :stroke-width="1.75" />
          View guest menu
        </a>
        <div class="user-menu__rule" />
        <button
          type="button"
          role="menuitem"
          class="user-menu__row"
          :disabled="isSigningOut"
          @click="logout"
        >
          <LogOut :size="16" :stroke-width="1.75" />
          Logout
        </button>
      </div>
    </div>

    <button
      type="button"
      class="sidebar__user"
      :class="{ 'is-open': isUserMenuOpen }"
      aria-haspopup="menu"
      :aria-expanded="isUserMenuOpen"
      @click="isUserMenuOpen = !isUserMenuOpen"
    >
      <span class="sidebar__initials">{{ initials }}</span>
      <span class="sidebar__email">{{ email }}</span>
    </button>
  </div>
</template>

<style scoped>
.sidebar__head {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px;
}

.sidebar__app {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 6px;
}

.sidebar__tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: var(--blue-600);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
}

.sidebar__app-text {
  min-width: 0;
}

.sidebar__app-name,
.sidebar__app-module {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar__app-name {
  color: var(--n-900);
  font-size: 13px;
  font-weight: 600;
}

.sidebar__app-module {
  color: var(--n-500);
  font-size: 11px;
}

.sidebar__close {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  color: var(--n-500);
}

.sidebar__close:hover {
  background: var(--n-200);
  color: var(--n-900);
}

.sidebar__nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 0 10px 16px;
}

.sidebar__links {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 8px;
}

.sidebar__link,
.sidebar__group {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  color: var(--n-700);
  font-size: 13px;
  text-align: left;
}

.sidebar__link:hover,
.sidebar__group:hover {
  background: var(--n-100);
  color: var(--n-900);
}

.sidebar__link--sub {
  padding-left: 30px;
  color: var(--n-600);
}

.sidebar__link.router-link-active {
  background: #ffffff;
  box-shadow:
    var(--shadow-sm),
    0 0 0 1px var(--line-5);
  color: var(--n-900);
  font-weight: 500;
}

.sidebar__group {
  margin-bottom: 2px;
}

.sidebar__group span {
  flex: 1;
}

.sidebar__icon {
  color: var(--n-500);
}

.sidebar__chevron {
  color: var(--n-400);
}

.sidebar__foot {
  position: relative;
  padding: 10px;
  border-top: 1px solid var(--line-8);
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px;
  border-radius: 8px;
  text-align: left;
}

.sidebar__user:hover,
.sidebar__user.is-open {
  background: var(--n-100);
}

.sidebar__initials,
.user-menu__tile {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  border-radius: 6px;
  background: var(--n-900);
  color: #ffffff;
  font-weight: 600;
}

.sidebar__initials {
  width: 28px;
  height: 28px;
  font-size: 11px;
}

.sidebar__email {
  min-width: 0;
  overflow: hidden;
  color: var(--n-900);
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu {
  position: absolute;
  bottom: 100%;
  left: 10px;
  z-index: 50;
  width: 256px;
  max-width: calc(100vw - 2rem);
  margin-bottom: 8px;
  overflow: hidden;
  border: 1px solid var(--line-10);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: var(--shadow-lg);
}

.user-menu__who {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid var(--line-8);
}

.user-menu__tile {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  font-size: 14px;
}

.user-menu__text {
  min-width: 0;
}

.user-menu__role {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 6px;
  background: var(--n-100);
  color: var(--n-500);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.user-menu__email {
  display: block;
  overflow: hidden;
  color: var(--n-500);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-menu__actions {
  padding: 4px;
}

.user-menu__row {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  color: var(--n-800);
  font-size: 14px;
  text-align: left;
}

.user-menu__row svg {
  color: var(--n-700);
}

.user-menu__row:hover:not(:disabled) {
  background: var(--n-100);
}

.user-menu__row:disabled {
  opacity: 0.4;
}

.user-menu__rule {
  margin: 4px;
  border-top: 1px solid var(--line-8);
}

@media (min-width: 640px) {
  .sidebar__link,
  .sidebar__group {
    padding-top: 4px;
    padding-bottom: 4px;
  }
}
</style>
