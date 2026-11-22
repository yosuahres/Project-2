<script setup>
import AppIcon from './AppIcon.vue'

defineProps({
  // [{ value, label }]
  options: { type: Array, required: true },
  selected: { type: String, default: undefined },
})

const emit = defineEmits(['select'])
</script>

<template>
  <ul class="options">
    <li v-for="option in options" :key="option.value">
      <button
        type="button"
        class="option"
        :class="{ 'is-selected': option.value === selected }"
        :aria-pressed="option.value === selected"
        @click="emit('select', option.value)"
      >
        <span>{{ option.label }}</span>
        <span v-if="option.value === selected" class="option__check">
          <AppIcon name="check" :size="14" />
        </span>
      </button>
    </li>
  </ul>
</template>

<style scoped>
.options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 52px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  text-align: left;
  transition:
    background-color 0.15s ease,
    border-color 0.15s ease;
}

.option:active {
  background: var(--color-bg);
}

.option.is-selected {
  border-color: var(--color-accent-strong);
  background: var(--color-accent-strong);
  color: #fff;
}

.option__check {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  color: var(--color-accent-strong);
}
</style>
