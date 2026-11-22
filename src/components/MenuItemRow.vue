<script setup>
import { formatPrice } from '@/data/menu'

defineProps({
  item: { type: Object, required: true },
})
</script>

<template>
  <article class="item">
    <h4 class="item__name">{{ item.name }}</h4>
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
</style>
