import * as items from './menu-items'

// Item ids for the "Most ordered" section at the top of the menu, best seller first.
// Fill this from real sales (POS) data, not guesses — the section stays hidden while empty.
const POPULAR_ITEM_IDS = []

// Groups are the big headings; categories are the sticky tabs and the sections under each heading.
const baseGroups = [
  {
    id: 'food',
    categoryIds: [
      'rice',
      'noodles',
      'mains',
      'soup',
      'japanese',
      'western',
      'breakfast',
      'bread',
      'vegetables',
      'snacks',
      'desserts',
    ],
  },
  {
    id: 'drinks',
    categoryIds: ['coffeeTea', 'juice', 'softDrinks', 'beer', 'spirits', 'bottles'],
  },
  {
    id: 'others',
    categoryIds: ['cigarettes'],
  },
]

const toCategory = (id) => ({ id, items: items[`${id}Items`] })

const allItems = Object.values(items).flat()

const popularItems = POPULAR_ITEM_IDS.map((id) => {
  const item = allItems.find((candidate) => candidate.id === id)
  if (!item) throw new Error(`Unknown popular menu item id: ${id}`)
  return item
})

const popularGroups = popularItems.length
  ? [{ id: 'popular', hideHeading: true, categories: [{ id: 'popular', items: popularItems }] }]
  : []

export const menuGroups = [
  ...popularGroups,
  ...baseGroups.map((group) => ({ ...group, categories: group.categoryIds.map(toCategory) })),
]

export const menuCategories = menuGroups.flatMap((group) =>
  group.categories.map((category) => ({ ...category, groupId: group.id })),
)

const priceFormatter = new Intl.NumberFormat('id-ID')

export const formatPrice = (rupiah) => `Rp${priceFormatter.format(rupiah)}`
