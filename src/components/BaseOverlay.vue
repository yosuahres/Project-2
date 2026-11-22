<script setup>
import { onBeforeUnmount, onMounted, toRef } from 'vue'
import { useScrollLock } from '@/composables/useScrollLock'

const props = defineProps({
  open: { type: Boolean, default: false },
  // bottom = sheet, right = drawer, center = lightbox
  placement: { type: String, default: 'bottom' },
  label: { type: String, default: undefined },
})

const emit = defineEmits(['close'])

useScrollLock(toRef(props, 'open'))

const onKeydown = (event) => {
  if (props.open && event.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay" :duration="280">
      <div
        v-if="open"
        class="overlay"
        :class="`overlay--${placement}`"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
      >
        <div class="overlay__backdrop" @click="emit('close')" />
        <!-- The frame keeps panels inside the same 480px column as the app. -->
        <div class="overlay__frame">
          <div class="overlay__panel">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
}

.overlay__backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
}

.overlay--center .overlay__backdrop {
  background: rgba(0, 0, 0, 0.88);
}

.overlay__frame {
  position: relative;
  height: 100%;
  max-width: var(--shell-width);
  margin: 0 auto;
  pointer-events: none;
}

.overlay__panel {
  position: absolute;
  pointer-events: auto;
  background: var(--color-surface);
  overflow-y: auto;
  overscroll-behavior: contain;
}

.overlay--bottom .overlay__panel {
  left: 0;
  right: 0;
  bottom: 0;
  max-height: 85dvh;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding-bottom: var(--safe-bottom);
}

.overlay--right .overlay__panel {
  top: 0;
  right: 0;
  bottom: 0;
  width: min(300px, 82%);
  padding-top: var(--safe-top);
  padding-bottom: var(--safe-bottom);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.12);
}

.overlay--center .overlay__panel {
  inset: 0;
  display: grid;
  place-items: center;
  padding: 16px;
  background: transparent;
}

/* Transitions */
.overlay-enter-active .overlay__backdrop,
.overlay-leave-active .overlay__backdrop {
  transition: opacity 0.28s ease;
}

.overlay-enter-active .overlay__panel,
.overlay-leave-active .overlay__panel {
  transition:
    transform 0.28s cubic-bezier(0.32, 0.72, 0, 1),
    opacity 0.28s ease;
}

.overlay-enter-from .overlay__backdrop,
.overlay-leave-to .overlay__backdrop {
  opacity: 0;
}

.overlay-enter-from.overlay--bottom .overlay__panel,
.overlay-leave-to.overlay--bottom .overlay__panel {
  transform: translateY(100%);
}

.overlay-enter-from.overlay--right .overlay__panel,
.overlay-leave-to.overlay--right .overlay__panel {
  transform: translateX(100%);
}

.overlay-enter-from.overlay--center .overlay__panel,
.overlay-leave-to.overlay--center .overlay__panel {
  opacity: 0;
  transform: scale(0.96);
}
</style>
