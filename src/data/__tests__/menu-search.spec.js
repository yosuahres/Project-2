import { describe, expect, it } from 'vitest'
import { searchMenu } from '@/data/menu-search'
import { buildMenu } from '@/data/menu'
import { bundledMenuRows } from '@/data/bundled-menu'

const menuCategories = buildMenu(bundledMenuRows).categories

const findNames = (query) =>
  searchMenu(menuCategories, query).flatMap((category) => category.items.map((item) => item.name))

describe('searchMenu', () => {
  it('returns every category untouched for an empty query', () => {
    expect(searchMenu(menuCategories, '   ')).toBe(menuCategories)
  })

  it('finds an item by a word in its name, ignoring case', () => {
    expect(findNames('HONEY')).toEqual(['Thai Honey Chicken Set'])
  })

  it('matches the start of each typed word, in any order', () => {
    expect(findNames('chi hon')).toEqual(['Thai Honey Chicken Set'])
  })

  it('tolerates a one-letter typo when the exact spelling finds nothing', () => {
    expect(findNames('honye')).toEqual(['Thai Honey Chicken Set'])
    expect(findNames('chiken')).toContain('Chicken Garlic Rice')
  })

  it('does not fall back to typo matching when the exact spelling finds something', () => {
    expect(findNames('fries')).not.toContain('Fried Rice Indonesia')
    expect(findNames('beef')).not.toContain('Heineken (330 ml)')
  })

  it('translates between Indonesian and English words', () => {
    expect(findNames('madu')).toEqual(['Thai Honey Chicken Set'])
    expect(findNames('ayam')).toContain('Chicken Steak')
    expect(findNames('coffee')).toContain('Kopi Tarik')
    expect(findNames('es teh')).toEqual(['Ice Tea'])
  })

  it('lists a whole section for its category word', () => {
    expect(findNames('rokok')).toHaveLength(8)
    expect(findNames('bir')).toContain('Heineken (330 ml)')
  })

  it('keeps short synonyms to whole words', () => {
    expect(findNames('ice')).not.toContain('Espresso')
  })

  it('returns nothing for gibberish', () => {
    expect(findNames('zzqx')).toEqual([])
  })
})
