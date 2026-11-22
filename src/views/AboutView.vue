<script setup>
import { computed } from 'vue'
import AppIcon from '@/components/AppIcon.vue'
import LoadStatus from '@/components/LoadStatus.vue'
import { useI18n } from '@/i18n'
import { formatHours } from '@/data/menu'
import { useMenu } from '@/data/menu-store'

// Monday-first, using Date#getDay() indexes (0 = Sunday).
const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]

const { t } = useI18n()
const { status, outlet, retry } = useMenu()
const todayIndex = new Date().getDay()

const days = computed(() => {
  if (!outlet.value) return []
  const names = t('about.days')
  return WEEK_ORDER.map((index) => ({
    index,
    name: names[index],
    hours: formatHours(outlet.value.hours[index], ' – ') ?? t('about.closed'),
    isToday: index === todayIndex,
  }))
})
</script>

<template>
  <LoadStatus v-if="status !== 'ready'" :status="status" @retry="retry" />

  <div v-else class="about">
    <section class="about__card">
      <h1 class="about__name">{{ outlet.name }}</h1>
      <p class="about__address">
        <AppIcon name="pin" :size="18" />
        <span>{{ outlet.address }}</span>
      </p>
      <div class="about__actions">
        <a :href="`tel:${outlet.phone}`" class="about__action">
          <AppIcon name="phone" :size="16" />
          {{ t('about.contactUs') }}
        </a>
        <a :href="outlet.mapsUrl" target="_blank" rel="noopener noreferrer" class="about__action">
          <AppIcon name="map" :size="16" />
          {{ t('about.googleMaps') }}
        </a>
      </div>
    </section>

    <section class="about__card">
      <h2 class="about__heading">{{ t('about.hours') }}</h2>
      <ul class="hours">
        <li
          v-for="day in days"
          :key="day.index"
          class="hours__row"
          :class="{ 'is-today': day.isToday }"
        >
          <span class="hours__day">
            {{ day.name }}
            <small v-if="day.isToday" class="hours__badge">{{ t('about.today') }}</small>
          </span>
          <span class="hours__time">{{ day.hours }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.about {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 16px 0;
}

.about__card {
  padding: 20px 16px;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.about__name {
  margin-bottom: 10px;
  font-size: 20px;
  font-weight: 700;
}

.about__address {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: var(--color-muted);
}

.about__address .icon {
  margin-top: 1px;
  color: var(--color-accent-strong);
}

.about__actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 18px;
}

.about__action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 600;
}

.about__action:active {
  background: var(--color-accent-soft);
  border-color: var(--color-accent);
}

.about__heading {
  margin-bottom: 8px;
  font-size: 17px;
  font-weight: 700;
}

.hours__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 48px;
  border-bottom: 1px solid var(--color-border);
  font-size: 13px;
}

.hours__row:last-child {
  border-bottom: none;
}

.hours__row.is-today {
  font-weight: 700;
}

.hours__day {
  display: flex;
  align-items: center;
  gap: 8px;
}

.hours__badge {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--color-accent-soft);
  color: var(--color-accent-strong);
  font-size: 11px;
  font-weight: 600;
}

.hours__time {
  font-variant-numeric: tabular-nums;
}
</style>
