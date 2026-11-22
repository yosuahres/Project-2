<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import OutletIntro from '@/components/OutletIntro.vue'
import MenuItemCard from '@/components/MenuItemCard.vue'
import BottomSheet from '@/components/BottomSheet.vue'
import OptionList from '@/components/OptionList.vue'
import { useI18n } from '@/i18n'
import { menuCategories, menuGroups } from '@/data/menu'

// After a tab tap, the scroll-spy waits until the smooth scroll has been idle this long.
const SCROLL_IDLE_MS = 150

const { t } = useI18n()

const activeCategoryId = ref(menuCategories[0].id)
const isPickerOpen = ref(false)

const tabBar = ref(null)
const tabScroller = ref(null)
const sectionEls = {}
const tabEls = {}

const activeGroupId = computed(
  () => menuCategories.find((category) => category.id === activeCategoryId.value).groupId,
)

const groupOptions = computed(() =>
  menuGroups.map((group) => ({ value: group.id, label: t(`menu.groups.${group.id}`) })),
)

let isJumping = false
let jumpIdleTimer
let spyFrame

const findCategoryInView = () => {
  const isAtBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (isAtBottom) return menuCategories[menuCategories.length - 1].id

  const readingLine = tabBar.value.getBoundingClientRect().bottom + 12
  let current = menuCategories[0].id
  for (const category of menuCategories) {
    const section = sectionEls[category.id]
    if (section && section.getBoundingClientRect().top <= readingLine) current = category.id
  }
  return current
}

const updateActiveCategory = () => {
  spyFrame = undefined
  if (isJumping || !tabBar.value) return
  activeCategoryId.value = findCategoryInView()
}

const finishJump = () => {
  isJumping = false
  updateActiveCategory()
}

const waitForJumpToSettle = () => {
  clearTimeout(jumpIdleTimer)
  jumpIdleTimer = setTimeout(finishJump, SCROLL_IDLE_MS)
}

const onScroll = () => {
  if (isJumping) waitForJumpToSettle()
  else if (spyFrame === undefined) spyFrame = requestAnimationFrame(updateActiveCategory)
}

const scrollToCategory = (categoryId) => {
  activeCategoryId.value = categoryId
  isJumping = true
  waitForJumpToSettle()
  sectionEls[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const selectGroup = async (groupId) => {
  isPickerOpen.value = false
  // Wait for the sheet to release the scroll lock before scrolling the page.
  await nextTick()
  const group = menuGroups.find((candidate) => candidate.id === groupId)
  scrollToCategory(group.categories[0].id)
}

// Keep the active tab visible inside the horizontally scrolling tab strip.
watch(activeCategoryId, (categoryId) => {
  const scroller = tabScroller.value
  const tab = tabEls[categoryId]
  if (!scroller || !tab) return
  const left = tab.offsetLeft - (scroller.clientWidth - tab.offsetWidth) / 2
  scroller.scrollTo({ left, behavior: 'smooth' })
})

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  clearTimeout(jumpIdleTimer)
  if (spyFrame !== undefined) cancelAnimationFrame(spyFrame)
})
</script>

<template>
  <OutletIntro discover="fields" />

  <nav ref="tabBar" class="tabs" :aria-label="t('menu.pickerTitle')">
    <button type="button" class="tabs__picker" @click="isPickerOpen = true">
      <span class="tabs__picker-icon" aria-hidden="true"><i /><i /><i /></span>
      {{ t(`menu.groups.${activeGroupId}`) }}
    </button>
    <div ref="tabScroller" class="tabs__scroller">
      <button
        v-for="category in menuCategories"
        :key="category.id"
        :ref="(el) => (tabEls[category.id] = el)"
        type="button"
        class="tabs__tab"
        :class="{ 'is-active': category.id === activeCategoryId }"
        :aria-current="category.id === activeCategoryId ? 'true' : undefined"
        @click="scrollToCategory(category.id)"
      >
        {{ t(`menu.categories.${category.id}`) }}
      </button>
    </div>
  </nav>

  <div class="menu">
    <template v-for="group in menuGroups" :key="group.id">
      <h2 class="menu__group">
        <span>{{ t(`menu.groups.${group.id}`) }}</span>
      </h2>

      <section
        v-for="category in group.categories"
        :key="category.id"
        :ref="(el) => (sectionEls[category.id] = el)"
        class="menu__category"
        :aria-labelledby="`category-${category.id}`"
      >
        <h3 :id="`category-${category.id}`" class="menu__category-title">
          {{ t(`menu.categories.${category.id}`) }}
        </h3>
        <ul class="menu__grid">
          <li v-for="item in category.items" :key="item.id">
            <MenuItemCard :item="item" />
          </li>
        </ul>
      </section>
    </template>
  </div>

  <BottomSheet :open="isPickerOpen" :title="t('menu.pickerTitle')" @close="isPickerOpen = false">
    <OptionList :options="groupOptions" :selected="activeGroupId" @select="selectGroup" />
  </BottomSheet>
</template>

<style scoped>
.tabs {
  position: sticky;
  top: calc(var(--header-height) + var(--safe-top));
  z-index: 10;
  display: flex;
  align-items: stretch;
  height: var(--tabs-height);
  background: var(--color-surface);
  box-shadow: 0 1px 0 var(--color-border);
}

.tabs__picker {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  padding: 0 12px 0 16px;
  border-right: 1px solid var(--color-border);
  font-size: 12px;
  font-weight: 700;
}

.tabs__picker-icon {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tabs__picker-icon i {
  display: block;
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background: currentColor;
}

.tabs__scroller {
  position: relative;
  display: flex;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.tabs__scroller::-webkit-scrollbar {
  display: none;
}

.tabs__tab {
  flex-shrink: 0;
  padding: 0 14px;
  border-bottom: 3px solid transparent;
  color: var(--color-muted);
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.tabs__tab.is-active {
  border-bottom-color: var(--color-accent);
  color: var(--color-text);
  font-weight: 700;
}

.menu {
  padding: 0 12px;
}

.menu__group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 4px 4px;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.menu__group::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-text);
  opacity: 0.25;
}

.menu__category {
  /* Land just below the sticky header + tab bar when jumped to. */
  scroll-margin-top: calc(var(--header-height) + var(--tabs-height) + var(--safe-top));
  padding-top: 12px;
}

.menu__category-title {
  margin: 0 4px 10px;
  font-size: 14px;
  font-weight: 700;
  color: var(--color-muted);
  letter-spacing: 0.03em;
}

.menu__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
</style>
