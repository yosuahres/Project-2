<script setup>
import BottomSheet from './BottomSheet.vue'
import { useI18n } from '@/i18n'
import { useMenu } from '@/data/menu-store'

defineProps({
  open: { type: Boolean, default: false },
  activeCategoryId: { type: String, default: undefined },
})

const emit = defineEmits(['close', 'select'])
const { t, localize } = useI18n()
const { menuGroups } = useMenu()
</script>

<template>
  <BottomSheet :open="open" :title="t('menu.allCategories')" @close="emit('close')">
    <nav :aria-label="t('menu.allCategories')">
      <section v-for="group in menuGroups" :key="group.id" class="group">
        <h3 v-if="!group.hideHeading" class="group__title">{{ localize(group.name) }}</h3>
        <ul>
          <li v-for="category in group.categories" :key="category.id">
            <button
              type="button"
              class="category"
              :class="{ 'is-active': category.id === activeCategoryId }"
              :aria-current="category.id === activeCategoryId ? 'true' : undefined"
              @click="emit('select', category.id)"
            >
              <span>{{ localize(category.name) }}</span>
              <span class="category__count">
                {{ t('menu.itemCount', { count: category.items.length }) }}
              </span>
            </button>
          </li>
        </ul>
      </section>
    </nav>
  </BottomSheet>
</template>

<style scoped>
.group + .group {
  margin-top: 16px;
}

.group__title {
  margin: 0 4px 4px;
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 600;
}

.category {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 48px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  font-size: 1rem;
  text-align: left;
}

.category:active {
  background: var(--color-bg);
}

.category.is-active {
  background: var(--color-accent-soft);
  font-weight: 600;
}

.category__count {
  flex-shrink: 0;
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}
</style>
