<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'
import { useI18n } from '@/i18n'

const query = defineModel({ type: String, required: true })

const { t } = useI18n()
const field = ref(null)
const input = ref(null)

const clear = () => {
  query.value = ''
  input.value.focus()
}

// Bring the field into view below the sticky header and put the cursor in it.
const focus = () => {
  field.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  input.value.focus({ preventScroll: true })
}

defineExpose({ focus })
</script>

<template>
  <div ref="field" class="search" role="search">
    <AppIcon name="search" :size="20" class="search__icon" />
    <input
      ref="input"
      v-model="query"
      type="search"
      class="search__input"
      :aria-label="t('menu.search.label')"
      :placeholder="t('menu.search.placeholder')"
      enterkeyhint="search"
      autocomplete="off"
      autocapitalize="off"
      spellcheck="false"
      @keydown.esc="query = ''"
    />
    <button
      v-if="query"
      type="button"
      class="search__clear"
      :aria-label="t('menu.search.clear')"
      @click="clear"
    >
      <AppIcon name="close" :size="18" />
    </button>
  </div>
</template>

<style scoped>
.search {
  position: relative;
  display: flex;
  align-items: center;
  height: 48px;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  /* Land just below the sticky app header when scrolled to. */
  scroll-margin-top: calc(var(--header-height) + var(--safe-top) + 12px);
}

.search:focus-within {
  border-color: var(--color-text);
  box-shadow: 0 0 0 1px var(--color-text);
}

.search__icon {
  position: absolute;
  left: 14px;
  color: var(--color-muted);
  pointer-events: none;
}

.search__input {
  width: 100%;
  height: 100%;
  padding: 0 48px 0 44px;
  border: none;
  border-radius: inherit;
  background: transparent;
  color: var(--color-text);
  /* 16px or more, otherwise iOS Safari zooms the page when the field is focused. */
  font: inherit;
  font-size: max(16px, 1rem);
  outline: none;
  appearance: none;
}

.search__input::placeholder {
  color: var(--color-muted);
}

.search__input::-webkit-search-cancel-button {
  appearance: none;
}

.search__clear {
  position: absolute;
  right: 2px;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  color: var(--color-muted);
}
</style>
