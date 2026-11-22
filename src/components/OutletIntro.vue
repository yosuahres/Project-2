<script setup>
import { computed } from 'vue'
import AppIcon from './AppIcon.vue'
import logo from '@/assets/icons/ip-logo.png'
import { useI18n } from '@/i18n'
import { formatHours, getTodayHours } from '@/data/menu'
import { useMenu } from '@/data/menu-store'

const props = defineProps({
  // Which page the "Discover More" button leads to.
  discover: {
    type: String,
    required: true,
    validator: (value) => ['menu', 'fields'].includes(value),
  },
})

const { lang, t } = useI18n()
const { outlet } = useMenu()

const todayHours = computed(() => {
  if (!outlet.value) return ''
  const hours = formatHours(getTodayHours(outlet.value))
  return hours ? t('intro.openToday', { hours }) : t('intro.closedToday')
})
const discoverIcon = computed(() => (props.discover === 'menu' ? 'utensils' : 'flag'))
</script>

<template>
  <section class="intro">
    <img :src="logo" alt="Indah Puri" class="intro__logo" width="343" height="153" />

    <RouterLink
      v-if="outlet"
      :to="{ name: 'about', params: { lang } }"
      class="intro__card intro__outlet"
    >
      <div>
        <h1 class="intro__name">{{ outlet.name }}</h1>
        <p class="intro__hours">{{ todayHours }}</p>
      </div>
      <AppIcon name="chevronRight" :size="22" />
    </RouterLink>

    <div class="intro__card intro__discover">
      <h2 class="intro__discover-title">{{ t('intro.discoverMore') }}</h2>
      <RouterLink :to="{ name: discover, params: { lang } }" class="intro__pill">
        <AppIcon :name="discoverIcon" :size="16" />
        {{ t(`nav.${discover}`) }}
      </RouterLink>
    </div>
  </section>
</template>

<style scoped>
.intro {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 16px 16px;
}

.intro__logo {
  width: min(260px, 70%);
  height: auto;
  margin: 0 auto 8px;
}

.intro__card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.intro__outlet:active {
  background: var(--color-bg);
}

.intro__name {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.3;
}

.intro__hours {
  margin-top: 2px;
  color: var(--color-muted);
  font-size: 13px;
}

.intro__discover-title {
  font-size: 15px;
  font-weight: 600;
}

.intro__pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 36px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition: background-color 0.15s ease;
}

.intro__pill:active {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}
</style>
