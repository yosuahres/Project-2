// Loads the menu and outlet once per visit and shares them between pages.
//
// With Supabase configured, the copy saved on the last visit is shown straight away and replaced
// when fresh rows arrive, so a guest on a weak signal still gets a menu. Without a saved copy the
// page waits, and says so if loading fails: showing old prices as if they were current would be
// worse than asking to try again. Without Supabase settings the bundled copy is used.
import { computed, reactive, readonly } from 'vue'
import { isSupabaseConfigured, supabase } from '@/lib/supabase'
import { bundledMenuRows, bundledOutletRows } from './bundled-menu'
import { buildMenu, buildOutlet } from './menu'

const CACHE_KEY = 'indah-puri:menu-rows'
// Bump when the saved shape changes, so an old copy is ignored rather than misread.
const CACHE_VERSION = 1

const state = reactive({
  // 'loading' until there is something to show, then 'ready'; 'error' if there never was.
  status: 'loading',
  menu: { groups: [], categories: [] },
  outlet: null,
})

const apply = (rows) => {
  state.menu = buildMenu(rows)
  state.outlet = buildOutlet(rows)
  state.status = 'ready'
}

const readCache = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY))
    return saved?.version === CACHE_VERSION ? saved.rows : null
  } catch {
    return null
  }
}

const writeCache = (rows) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ version: CACHE_VERSION, rows }))
  } catch {
    // Storage can be full or unavailable (private mode); the next visit just loads again.
  }
}

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

// Only shown rows are asked for: an admin signed in on this device could otherwise read hidden ones.
const fetchRows = async () => {
  const [groups, categories, items, outlet, hours] = await Promise.all([
    supabase.from('menu_groups').select('id, name_en, name_id, sort_order'),
    supabase
      .from('menu_categories')
      .select('id, group_id, name_en, name_id, keywords, sort_order, is_visible')
      .eq('is_visible', true),
    supabase
      .from('menu_items')
      .select('id, category_id, name, price, sort_order, is_available, popular_rank')
      .eq('is_available', true),
    supabase.from('outlet').select('name, address, phone, maps_url').single(),
    supabase.from('outlet_hours').select('day, opens_at, closes_at, is_closed'),
  ])
  return {
    groups: unwrap(groups),
    categories: unwrap(categories),
    items: unwrap(items),
    outlet: unwrap(outlet),
    hours: unwrap(hours),
  }
}

let pending = null
let isFresh = false

const refresh = async () => {
  try {
    const rows = await fetchRows()
    apply(rows)
    writeCache(rows)
    isFresh = true
  } catch (error) {
    console.error('Could not load the menu from Supabase:', error)
    if (state.status !== 'ready') state.status = 'error'
  } finally {
    pending = null
  }
}

// Safe to call from every page: the first call loads, later ones share it.
export const loadMenu = () => {
  if (!isSupabaseConfigured) {
    if (state.status !== 'ready') apply({ ...bundledMenuRows, ...bundledOutletRows })
    return Promise.resolve()
  }
  if (isFresh) return Promise.resolve()
  if (pending) return pending
  if (state.status !== 'ready') {
    const cached = readCache()
    if (cached) apply(cached)
  }
  pending = refresh()
  return pending
}

// For a "Try again" button after a failed load.
export const retryLoadMenu = () => {
  state.status = 'loading'
  return loadMenu()
}

const shared = readonly(state)

export const useMenu = () => {
  loadMenu()
  return {
    status: computed(() => shared.status),
    menuGroups: computed(() => shared.menu.groups),
    menuCategories: computed(() => shared.menu.categories),
    outlet: computed(() => shared.outlet),
    retry: retryLoadMenu,
  }
}
