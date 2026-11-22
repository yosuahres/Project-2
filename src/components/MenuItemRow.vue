<script setup>
import { formatPrice } from '@/data/menu'
import { useI18n } from '@/i18n'

defineProps({
  item: { type: Object, required: true },
})

const { t } = useI18n()
</script>

<template>
  <article class="item" :class="{ 'is-sold-out': item.isSoldOut }">
    <h4 class="item__name">
      {{ item.name }}
      <span v-if="item.isSoldOut" class="item__sold-out">{{ t('menu.soldOut') }}</span>
    </h4>
    <p class="item__price">{{ formatPrice(item.price) }}</p>
  </article>
</template>

<style scoped>
/* One line per item: name on the left where the eye scans, price on the same baseline at the right.
   Long names wrap; the price never does. */
.item {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  min-height: 52px;
  padding: 14px 0;
}

.item__name {
  min-width: 0;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.item__price {
  flex-shrink: 0;
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.4;
  white-space: nowrap;
  font-variant-numeric: tabular-nums lining-nums;
}

/* Still listed so guests know it exists, but clearly not orderable today. */
.is-sold-out .item__name,
.is-sold-out .item__price {
  color: var(--color-muted);
}

.is-sold-out .item__price {
  text-decoration: line-through;
}

.item__sold-out {
  display: inline-block;
  margin-left: 6px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 13px;
  font-weight: 600;
  vertical-align: 1px;
  white-space: nowrap;
}
</style>
