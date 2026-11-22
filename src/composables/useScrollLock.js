import { onBeforeUnmount, watch } from 'vue'

let lockCount = 0

const lock = () => {
  lockCount += 1
  document.body.classList.add('is-scroll-locked')
}

const unlock = () => {
  lockCount = Math.max(0, lockCount - 1)
  if (lockCount === 0) document.body.classList.remove('is-scroll-locked')
}

// Stops the page behind an open sheet/drawer from scrolling.
export const useScrollLock = (isActive) => {
  let isLocked = false

  const sync = (shouldLock) => {
    if (shouldLock === isLocked) return
    isLocked = shouldLock
    if (shouldLock) lock()
    else unlock()
  }

  watch(isActive, sync, { immediate: true })
  onBeforeUnmount(() => sync(false))
}
