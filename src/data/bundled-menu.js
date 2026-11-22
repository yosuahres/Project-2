// The menu as it stood before it moved to Supabase, in the same row shape as the database.
// Supabase is now the source of truth: this copy is shown only when the app runs without
// Supabase settings (local development, tests), and is what 0002_menu_seed.sql was made from.
// Editing it does not change the live menu; use /admin for that.
//
// No path aliases here, so the file also loads in plain Node.
import * as itemsByCategory from './menu-items.js'
import { outlet } from './outlet.js'

const GROUPS = [
  { id: 'food', name_en: 'Food', name_id: 'Makanan' },
  { id: 'drinks', name_en: 'Drinks', name_id: 'Minuman' },
  { id: 'others', name_en: 'Others', name_id: 'Lainnya' },
]

// `keywords` find every item in a section whose item names don't already say what they are.
const CATEGORIES = [
  { id: 'rice', group_id: 'food', name_en: 'Rice', name_id: 'Nasi' },
  { id: 'noodles', group_id: 'food', name_en: 'Noodles', name_id: 'Mi & Kwetiau' },
  {
    id: 'mains',
    group_id: 'food',
    name_en: 'Chicken, Beef & Seafood',
    name_id: 'Ayam, Daging & Seafood',
  },
  { id: 'soup', group_id: 'food', name_en: 'Soup & Porridge', name_id: 'Sup & Bubur' },
  {
    id: 'japanese',
    group_id: 'food',
    name_en: 'Japanese & Korean',
    name_id: 'Jepang & Korea',
    keywords: ['japanese', 'jepang', 'korean', 'korea'],
  },
  {
    id: 'western',
    group_id: 'food',
    name_en: 'Steak & Western',
    name_id: 'Steak & Western',
    keywords: ['western'],
  },
  {
    id: 'breakfast',
    group_id: 'food',
    name_en: 'Eggs & Breakfast',
    name_id: 'Telur & Sarapan',
    keywords: ['breakfast', 'sarapan'],
  },
  {
    id: 'bread',
    group_id: 'food',
    name_en: 'Toast, Sandwich & Prata',
    name_id: 'Roti, Sandwich & Prata',
  },
  {
    id: 'vegetables',
    group_id: 'food',
    name_en: 'Vegetables & Tofu',
    name_id: 'Sayur & Tahu',
    keywords: ['vegetarian'],
  },
  {
    id: 'snacks',
    group_id: 'food',
    name_en: 'Snacks',
    name_id: 'Camilan',
    keywords: ['snack', 'camilan'],
  },
  {
    id: 'desserts',
    group_id: 'food',
    name_en: 'Ice Cream & Fruit',
    name_id: 'Es Krim & Buah',
    keywords: ['dessert', 'ice', 'cream', 'krim'],
  },
  { id: 'coffeeTea', group_id: 'drinks', name_en: 'Coffee & Tea', name_id: 'Kopi & Teh' },
  { id: 'juice', group_id: 'drinks', name_en: 'Juice & Iced Drinks', name_id: 'Jus & Es' },
  {
    id: 'softDrinks',
    group_id: 'drinks',
    name_en: 'Soft Drinks & Water',
    name_id: 'Minuman Ringan & Air',
    keywords: ['soft', 'soda', 'ringan'],
  },
  {
    id: 'beer',
    group_id: 'drinks',
    name_en: 'Beer & Soju',
    name_id: 'Bir & Soju',
    keywords: ['beer', 'bir'],
  },
  {
    id: 'spirits',
    group_id: 'drinks',
    name_en: 'Spirits by the Shot',
    name_id: 'Spirit per Shot',
    keywords: ['spirit', 'liquor'],
  },
  {
    id: 'bottles',
    group_id: 'drinks',
    name_en: 'Wine & Spirits by the Bottle',
    name_id: 'Wine & Spirit per Botol',
    keywords: ['bottle', 'botol', 'wine', 'spirit'],
  },
  {
    id: 'cigarettes',
    group_id: 'others',
    name_en: 'Cigarettes',
    name_id: 'Rokok',
    keywords: ['cigarette', 'rokok'],
  },
]

// Gaps of 10 leave room to slot a row in between without renumbering the rest.
const ORDER_STEP = 10
const nthOrder = (index) => (index + 1) * ORDER_STEP

const toRanks = (ids) => new Map(ids.map((id, index) => [id, index + 1]))
// Item ids for "Most ordered", best seller first. Empty until there is real POS data.
const POPULAR_RANKS = toRanks([])

const groups = GROUPS.map((group, index) => ({ ...group, sort_order: nthOrder(index) }))

const categories = groups.flatMap((group) =>
  CATEGORIES.filter((category) => category.group_id === group.id).map((category, index) => ({
    keywords: [],
    ...category,
    sort_order: nthOrder(index),
    is_visible: true,
  })),
)

const items = categories.flatMap((category) =>
  itemsByCategory[`${category.id}Items`].map((item, index) => ({
    id: item.id,
    category_id: category.id,
    name: item.name,
    price: item.price,
    sort_order: nthOrder(index),
    is_available: true,
    popular_rank: POPULAR_RANKS.get(item.id) ?? null,
  })),
)

export const bundledMenuRows = { groups, categories, items }

export const bundledOutletRows = {
  outlet: {
    name: outlet.name,
    address: outlet.address,
    phone: outlet.phone,
    maps_url: outlet.mapsUrl,
  },
  hours: outlet.hours.map((hours, day) => ({
    day,
    opens_at: hours.open,
    closes_at: hours.close,
    is_closed: false,
  })),
}
