<script setup>
import { ref } from 'vue'
import logo from '@/assets/icons/ip-logo.png'
import { MENU_IMAGE_BASE, formatPrice } from '@/data/menu'

defineProps({
  item: { type: Object, required: true },
})

const hasImageError = ref(false)
</script>

<template>
  <article class="item">
    <div class="item__media">
      <img
        v-if="!hasImageError"
        :src="MENU_IMAGE_BASE + item.image"
        :alt="item.name"
        class="item__image"
        loading="lazy"
        decoding="async"
        width="300"
        height="300"
        @error="hasImageError = true"
      />
      <img v-else :src="logo" alt="" class="item__placeholder" />
    </div>
    <div class="item__body">
      <h4 class="item__name">{{ item.name }}</h4>
      <p class="item__price">{{ formatPrice(item.price) }}</p>
    </div>
  </article>
</template>

<style scoped>
.item {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.item__media {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: var(--color-bg);
}

/* Absolutely positioned so a photo's own proportions can never change the card height
   (which would shift the page while lazy images load). */
.item__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item__placeholder {
  width: 60%;
  height: auto;
  opacity: 0.25;
}

.item__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 12px 12px;
}

.item__name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.item__price {
  font-size: 14px;
  font-weight: 700;
  color: var(--color-accent);
  font-variant-numeric: tabular-nums;
}
</style>
