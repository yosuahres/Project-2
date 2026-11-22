import { cigaretteItems, dessertItems, drinkItems, heavyFoodItems, snackItems } from './menu-items'

// Groups are the big headings (and the options in the category picker);
// categories are the sticky tabs and the sections under each heading.
export const menuGroups = [
  {
    id: 'food',
    categories: [
      { id: 'heavyFood', items: heavyFoodItems },
      { id: 'snack', items: snackItems },
    ],
  },
  {
    id: 'drinks',
    categories: [
      { id: 'dessert', items: dessertItems },
      { id: 'drink', items: drinkItems },
    ],
  },
  {
    id: 'others',
    categories: [{ id: 'cigarette', items: cigaretteItems }],
  },
]

export const menuCategories = menuGroups.flatMap((group) =>
  group.categories.map((category) => ({ ...category, groupId: group.id })),
)

export const MENU_IMAGE_BASE = '/assets/icons/'

const priceFormatter = new Intl.NumberFormat('id-ID')

export const formatPrice = (rupiah) => `Rp${priceFormatter.format(rupiah)}`
