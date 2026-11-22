import { describe, expect, it } from 'vitest'
import { buildMenu } from '@/data/menu'
import { bundledMenuRows } from '@/data/bundled-menu'

const withItem = (id, changes) => ({
  ...bundledMenuRows,
  items: bundledMenuRows.items.map((item) => (item.id === id ? { ...item, ...changes } : item)),
})

const findItem = (menu, id) =>
  menu.categories.flatMap((category) => category.items).find((item) => item.id === id)

describe('buildMenu', () => {
  it('keeps a sold-out item on the menu, flagged', () => {
    const menu = buildMenu(withItem('hf-3', { is_sold_out: true }))
    expect(findItem(menu, 'hf-3')).toMatchObject({ isSoldOut: true, price: 80000 })
    expect(findItem(menu, 'hf-11').isSoldOut).toBe(false)
  })

  it('leaves a hidden item out entirely', () => {
    const menu = buildMenu(withItem('hf-3', { is_available: false }))
    expect(findItem(menu, 'hf-3')).toBeUndefined()
  })

  it('lists ranked items under "Most ordered" first', () => {
    const menu = buildMenu(withItem('dr-2', { popular_rank: 1 }))
    expect(menu.groups[0].id).toBe('popular')
    expect(menu.groups[0].categories[0].items.map((item) => item.id)).toEqual(['dr-2'])
  })
})
