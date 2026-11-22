<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import OutletIntro from '@/components/OutletIntro.vue'
import MenuSearch from '@/components/MenuSearch.vue'
import MenuItemRow from '@/components/MenuItemRow.vue'
import CategorySheet from '@/components/CategorySheet.vue'
import AppIcon from '@/components/AppIcon.vue'
import LoadStatus from '@/components/LoadStatus.vue'
import { useI18n } from '@/i18n'
import { POPULAR_ID } from '@/data/menu'
import { useMenu } from '@/data/menu-store'
import { searchMenu } from '@/data/menu-search'

// After a tab tap, the scroll-spy waits until the smooth scroll has been idle this long.
const SCROLL_IDLE_MS = 150
// Screen readers hear the result count once typing pauses, not on every keystroke.
const ANNOUNCE_DELAY_MS = 600

const { t, localize } = useI18n()
const { status, menuGroups, menuCategories, retry } = useMenu()

const query = ref('')
const activeCategoryId = ref(menuCategories.value[0]?.id)
const isPickerOpen = ref(false)
const announcement = ref('')

const search = ref(null)
const tabBar = ref(null)
const tabScroller = ref(null)
const sectionEls = {}
const tabEls = {}

const isSearching = computed(() => query.value.trim() !== '')

// While searching, show only matching items. "Most ordered" items also live in their own
// category, so that section is left out of results to avoid listing them twice.
const visibleGroups = computed(() => {
  if (!isSearching.value) return menuGroups.value
  return menuGroups.value
    .filter((group) => group.id !== POPULAR_ID)
    .map((group) => ({ ...group, categories: searchMenu(group.categories, query.value) }))
    .filter((group) => group.categories.length)
})

const resultCount = computed(() =>
  visibleGroups.value
    .flatMap((group) => group.categories)
    .reduce((total, category) => total + category.items.length, 0),
)

const resultSummary = computed(() => {
  const vars = { count: resultCount.value, query: query.value.trim() }
  if (resultCount.value === 0) return t('menu.search.noResults', vars)
  return t(resultCount.value === 1 ? 'menu.search.resultsOne' : 'menu.search.resultsOther', vars)
})

let announceTimer
watch(resultSummary, (summary) => {
  clearTimeout(announceTimer)
  announceTimer = setTimeout(() => {
    announcement.value = isSearching.value ? summary : ''
  }, ANNOUNCE_DELAY_MS)
})

let isJumping = false
let jumpIdleTimer
let spyFrame

const findCategoryInView = () => {
  const categories = menuCategories.value
  const isAtBottom =
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
  if (isAtBottom) return categories[categories.length - 1].id

  const readingLine = tabBar.value.getBoundingClientRect().bottom + 12
  let current = categories[0].id
  for (const category of categories) {
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
  if (isSearching.value || !menuCategories.value.length) return
  if (isJumping) waitForJumpToSettle()
  else if (spyFrame === undefined) spyFrame = requestAnimationFrame(updateActiveCategory)
}

const scrollToCategory = (categoryId) => {
  activeCategoryId.value = categoryId
  isJumping = true
  waitForJumpToSettle()
  sectionEls[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const selectCategory = async (categoryId) => {
  isPickerOpen.value = false
  query.value = ''
  // Wait for the full menu to render and the sheet to release the scroll lock.
  await nextTick()
  scrollToCategory(categoryId)
}

const clearSearch = () => {
  query.value = ''
  search.value.focus()
}

// When the menu arrives or changes (fresh rows replacing the saved copy), keep a tab selected.
watch(menuCategories, (categories) => {
  if (!categories.some((category) => category.id === activeCategoryId.value)) {
    activeCategoryId.value = categories[0]?.id
  }
})

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
  clearTimeout(announceTimer)
  if (spyFrame !== undefined) cancelAnimationFrame(spyFrame)
})
</script>

<template>
  <OutletIntro discover="fields" />

  <LoadStatus v-if="status !== 'ready'" :status="status" @retry="retry" />

  <template v-else>
    <div class="menu-search">
      <MenuSearch ref="search" v-model="query" />
      <p v-if="isSearching && resultCount" class="menu-search__summary">{{ resultSummary }}</p>
      <p class="visually-hidden" role="status">{{ announcement }}</p>
    </div>

    <nav v-if="!isSearching" ref="tabBar" class="tabs" :aria-label="t('menu.allCategories')">
      <button
        type="button"
        class="tabs__picker"
        aria-haspopup="dialog"
        :aria-label="t('menu.allCategories')"
        @click="isPickerOpen = true"
      >
        <span class="tabs__picker-icon" aria-hidden="true"><i /><i /><i /></span>
        {{ t('menu.allShort') }}
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
          {{ localize(category.name) }}
        </button>
      </div>
      <button
        type="button"
        class="tabs__search"
        :aria-label="t('menu.search.open')"
        @click="search.focus()"
      >
        <AppIcon name="search" />
      </button>
    </nav>

    <div class="menu">
      <template v-for="group in visibleGroups" :key="group.id">
        <h2 v-if="!group.hideHeading" class="menu__group">
          {{ localize(group.name) }}
        </h2>

        <section
          v-for="category in group.categories"
          :key="category.id"
          :ref="(el) => (sectionEls[category.id] = el)"
          class="menu__category"
          :aria-labelledby="`category-${category.id}`"
        >
          <h3 :id="`category-${category.id}`" class="menu__category-title">
            {{ localize(category.name) }}
            <span class="menu__category-count" aria-hidden="true">{{ category.items.length }}</span>
          </h3>
          <ul class="menu__list">
            <li v-for="item in category.items" :key="item.id" class="menu__list-item">
              <MenuItemRow :item="item" />
            </li>
          </ul>
        </section>
      </template>

      <div v-if="isSearching && !resultCount" class="empty">
        <p class="empty__title">{{ resultSummary }}</p>
        <p class="empty__hint">{{ t('menu.search.noResultsHint') }}</p>
        <div class="empty__actions">
          <button type="button" class="empty__button" @click="clearSearch">
            {{ t('menu.search.clear') }}
          </button>
          <button
            type="button"
            class="empty__button empty__button--primary"
            @click="isPickerOpen = true"
          >
            {{ t('menu.search.browse') }}
          </button>
        </div>
      </div>
    </div>
  </template>

  <CategorySheet
    :open="isPickerOpen"
    :active-category-id="activeCategoryId"
    @close="isPickerOpen = false"
    @select="selectCategory"
  />
</template>

<style scoped>
.menu-search {
  padding: 16px 12px 4px;
}

.menu-search__summary {
  margin: 12px 4px 0;
  color: var(--color-muted);
  font-size: 14px;
}

.tabs {
  position: sticky;
  top: calc(var(--header-height) + var(--safe-top));
  z-index: 10;
  display: flex;
  align-items: stretch;
  height: var(--tabs-height);
  margin-top: 12px;
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
  font-size: 15px;
  font-weight: 600;
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
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;
  transition:
    color 0.15s ease,
    border-color 0.15s ease;
}

.tabs__tab.is-active {
  border-bottom-color: var(--color-accent-strong);
  color: var(--color-text);
  font-weight: 600;
}

.tabs__search {
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 48px;
  border-left: 1px solid var(--color-border);
}

.menu {
  padding: 0 12px;
}

.menu__group {
  margin: 28px 4px 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.menu__category {
  /* Land just below the sticky header + tab bar when jumped to. */
  scroll-margin-top: calc(var(--header-height) + var(--tabs-height) + var(--safe-top) + 12px);
  margin-top: 12px;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
}

.menu__category-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 16px 16px 4px;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.menu__category-count {
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 400;
  font-variant-numeric: tabular-nums;
}

.menu__list {
  padding: 0 16px 4px;
}

.menu__list-item + .menu__list-item {
  border-top: 1px solid var(--color-border);
}

.empty {
  margin-top: 16px;
  padding: 24px 20px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  text-align: center;
}

.empty__title {
  font-size: 17px;
  font-weight: 600;
  overflow-wrap: anywhere;
}

.empty__hint {
  margin-top: 4px;
  color: var(--color-muted);
  font-size: 15px;
}

.empty__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.empty__button {
  min-height: 44px;
  padding: 0 16px;
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
}

.empty__button--primary {
  border-color: var(--color-text);
  background: var(--color-text);
  color: var(--color-surface);
}
</style>
