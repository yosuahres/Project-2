// Turns menu and outlet rows (from Supabase, or the bundled copy) into what the screens render.

import { messages } from '@/i18n/messages'

export const POPULAR_ID = 'popular'

const bySortOrder = (a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id)

const toName = (row) => ({ en: row.name_en, id: row.name_id })

const toItem = ({ id, name, price }) => ({ id, name, price })

// Map.groupBy, which older phones (iOS 16 and earlier) don't have.
const groupBy = (rows, keyOf) => {
  const groups = new Map()
  for (const row of rows) {
    const key = keyOf(row)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  }
  return groups
}

// Guests see only shown rows. The database already hides the rest from them, but an admin who is
// signed in on the same device can read everything, so the filter is applied here as well.
const buildCategories = (categories, items) => {
  const itemsByCategory = groupBy(
    items.filter((item) => item.is_available).sort(bySortOrder),
    (item) => item.category_id,
  )
  return categories
    .filter((category) => category.is_visible)
    .sort(bySortOrder)
    .map((category) => ({
      id: category.id,
      groupId: category.group_id,
      name: toName(category),
      keywords: category.keywords ?? [],
      items: (itemsByCategory.get(category.id) ?? []).map(toItem),
    }))
    .filter((category) => category.items.length)
}

// "Most ordered": items with a rank, best first, drawn only from sections guests can see.
const buildPopularGroup = (categories, items) => {
  const shownCategoryIds = new Set(categories.map((category) => category.id))
  const popularItems = items
    .filter(
      (item) =>
        item.is_available && item.popular_rank != null && shownCategoryIds.has(item.category_id),
    )
    .sort((a, b) => a.popular_rank - b.popular_rank || bySortOrder(a, b))
    .map(toItem)
  if (!popularItems.length) return []

  const name = { en: messages.en.menu.popular, id: messages.id.menu.popular }
  return [
    {
      id: POPULAR_ID,
      name,
      hideHeading: true,
      categories: [
        { id: POPULAR_ID, groupId: POPULAR_ID, name, keywords: [], items: popularItems },
      ],
    },
  ]
}

// Returns the groups (headings) in order, each with its categories (tabs and sections), and the
// same categories as one flat list. Empty categories and groups are left out.
export const buildMenu = ({ groups, categories, items }) => {
  const shownCategories = buildCategories(categories, items)
  const categoriesByGroup = groupBy(shownCategories, (category) => category.groupId)

  const menuGroups = [
    ...buildPopularGroup(shownCategories, items),
    ...[...groups]
      .sort(bySortOrder)
      .map((group) => ({
        id: group.id,
        name: toName(group),
        categories: categoriesByGroup.get(group.id) ?? [],
      }))
      .filter((group) => group.categories.length),
  ]

  return { groups: menuGroups, categories: menuGroups.flatMap((group) => group.categories) }
}

// "06:00:00" from Postgres, or "06:00" from the bundled copy, both become "06:00".
const toClock = (time) => time.slice(0, 5)

// `hours` is indexed by day, 0 = Sunday, matching Date#getDay(). A day with no row is closed.
export const buildOutlet = ({ outlet, hours }) => {
  const hoursByDay = new Map(hours.map((row) => [row.day, row]))
  return {
    name: outlet.name,
    address: outlet.address,
    phone: outlet.phone,
    mapsUrl: outlet.maps_url,
    hours: Array.from({ length: 7 }, (_, day) => {
      const row = hoursByDay.get(day)
      if (!row || row.is_closed) return { isClosed: true, open: null, close: null }
      return { isClosed: false, open: toClock(row.opens_at), close: toClock(row.closes_at) }
    }),
  }
}

export const getTodayHours = (outlet, date = new Date()) => outlet.hours[date.getDay()]

// Null for a closed day, so the caller says "Closed" in the reader's language.
export const formatHours = ({ isClosed, open, close }, separator = '-') =>
  isClosed ? null : `${open}${separator}${close}`

const priceFormatter = new Intl.NumberFormat('id-ID')

export const formatPrice = (rupiah) => `Rp${priceFormatter.format(rupiah)}`
