// Reads and writes for the admin screens. Row level security (supabase/migrations) is what
// actually allows or refuses each change; nothing here is a security check.
import { supabase } from '@/lib/supabase'

// Gaps of 10, like the seed, leave room to slot a row in between.
const ORDER_STEP = 10

const GROUP_COLUMNS = 'id, name_en, name_id, sort_order'
const CATEGORY_COLUMNS = 'id, group_id, name_en, name_id, keywords, sort_order, is_visible'
const ITEM_COLUMNS =
  'id, category_id, name, price, sort_order, is_available, is_sold_out, popular_rank'

// Postgres error codes worth a sentence of their own.
const FRIENDLY_ERRORS = {
  23503: 'It still has things inside it. Move or delete those first.',
  23505: 'Something with that id already exists.',
  23514:
    'One of the values is not allowed. Check that names are filled in and prices are not negative.',
  42501: 'Your account is not allowed to change the menu. Sign out and back in, or ask for access.',
  PGRST301: 'Your sign-in has expired. Sign in again.',
}

export const describeError = (error) =>
  FRIENDLY_ERRORS[error?.code] ?? error?.message ?? 'Something went wrong. Try again.'

// An update or delete that row level security refuses touches no rows instead of failing.
const refused = () => Object.assign(new Error('Refused by row level security'), { code: '42501' })

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

// Everything, hidden rows included: the policies let an admin read them.
export const fetchMenuRows = async () => {
  const [groups, categories, items] = await Promise.all([
    supabase.from('menu_groups').select(GROUP_COLUMNS).order('sort_order'),
    supabase.from('menu_categories').select(CATEGORY_COLUMNS).order('sort_order'),
    supabase.from('menu_items').select(ITEM_COLUMNS).order('sort_order'),
  ])
  return { groups: unwrap(groups), categories: unwrap(categories), items: unwrap(items) }
}

export const nextSortOrder = (rows) =>
  rows.reduce((highest, row) => Math.max(highest, row.sort_order), 0) + ORDER_STEP

const TABLES = {
  group: { name: 'menu_groups', columns: GROUP_COLUMNS },
  category: { name: 'menu_categories', columns: CATEGORY_COLUMNS },
  item: { name: 'menu_items', columns: ITEM_COLUMNS },
}

// Adds the row when it has no id yet, otherwise changes it. Returns the saved row.
export const saveRow = async (kind, { id, ...values }) => {
  const table = TABLES[kind]
  const query = id
    ? supabase.from(table.name).update(values).eq('id', id)
    : supabase.from(table.name).insert(values)
  const saved = unwrap(await query.select(table.columns))
  if (!saved.length) throw refused()
  return saved[0]
}

export const deleteRow = async (kind, id) => {
  const deleted = unwrap(await supabase.from(TABLES[kind].name).delete().eq('id', id).select('id'))
  if (!deleted.length) throw refused()
}

// Moves rows[index] one place up (-1) or down (+1), renumbering the list so ties can't stick.
// Returns the rows whose sort_order changed, already updated.
export const moveRow = async (kind, rows, index, direction) => {
  const target = index + direction
  if (target < 0 || target >= rows.length) return []

  const reordered = [...rows]
  ;[reordered[index], reordered[target]] = [reordered[target], reordered[index]]
  const changed = reordered
    .map((row, position) => ({ row, sort_order: (position + 1) * ORDER_STEP }))
    .filter(({ row, sort_order }) => row.sort_order !== sort_order)

  return Promise.all(
    changed.map(({ row, sort_order }) => saveRow(kind, { id: row.id, sort_order })),
  )
}

export const fetchOutletRows = async () => {
  const [outlet, hours] = await Promise.all([
    supabase.from('outlet').select('name, address, phone, maps_url').single(),
    supabase.from('outlet_hours').select('day, opens_at, closes_at, is_closed').order('day'),
  ])
  return { outlet: unwrap(outlet), hours: unwrap(hours) }
}

export const saveOutlet = async (outlet, hours) => {
  const saved = unwrap(await supabase.from('outlet').update(outlet).eq('id', true).select('name'))
  if (!saved.length) throw refused()
  unwrap(await supabase.from('outlet_hours').upsert(hours, { onConflict: 'day' }))
}
