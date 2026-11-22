// Every group, category and item, hidden ones included, shared by the admin pages so moving
// between them doesn't reload. Each change saved in a dialog is folded back in here.
import { computed, reactive, ref } from 'vue'
import { describeError, fetchMenuRows } from './menu-admin-api'

const KEYS = { group: 'groups', category: 'categories', item: 'items' }

const rows = reactive({ groups: [], categories: [], items: [] })
const status = ref('idle')
const loadError = ref('')

const load = async () => {
  status.value = 'loading'
  try {
    Object.assign(rows, await fetchMenuRows())
    status.value = 'ready'
  } catch (cause) {
    loadError.value = describeError(cause)
    status.value = 'error'
  }
}

const bySortOrder = (a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id)

// Puts saved rows in place of their old selves, or adds them.
const upsert = (kind, ...saved) => {
  const list = rows[KEYS[kind]]
  for (const row of saved) {
    const index = list.findIndex((existing) => existing.id === row.id)
    if (index === -1) list.push(row)
    else list[index] = row
  }
}

const remove = (kind, id) => {
  const list = rows[KEYS[kind]]
  list.splice(
    list.findIndex((row) => row.id === id),
    1,
  )
}

const groups = computed(() => [...rows.groups].sort(bySortOrder))

const categoriesIn = (groupId) =>
  rows.categories.filter((category) => category.group_id === groupId).sort(bySortOrder)

// Sections in menu order: by heading, then by their own order.
const categories = computed(() => groups.value.flatMap((group) => categoriesIn(group.id)))

const itemsIn = (categoryId) =>
  rows.items.filter((item) => item.category_id === categoryId).sort(bySortOrder)

export const useMenuRows = () => {
  if (status.value === 'idle') load()
  return {
    rows,
    status,
    loadError,
    reload: load,
    upsert,
    remove,
    groups,
    categories,
    categoriesIn,
    itemsIn,
  }
}
