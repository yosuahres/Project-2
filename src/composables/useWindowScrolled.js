import { onBeforeUnmount, onMounted, ref } from 'vue'

export const useWindowScrolled = (threshold = 8) => {
  const isScrolled = ref(false)
  const update = () => {
    isScrolled.value = window.scrollY > threshold
  }

  onMounted(() => {
    update()
    window.addEventListener('scroll', update, { passive: true })
  })
  onBeforeUnmount(() => window.removeEventListener('scroll', update))

  return isScrolled
}
