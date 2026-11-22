// Words diners may type in either language for the same thing. Typing (the start of) any word
// in a set also searches for the others, so "ayam" finds "Chicken Steak" and "coffee" finds "Kopi Tarik".
const SYNONYM_SETS = [
  ['ayam', 'chicken'],
  ['daging', 'sapi', 'beef'],
  ['udang', 'prawn', 'shrimp'],
  ['ikan', 'fish'],
  ['cumi', 'sotong', 'squid'],
  ['telur', 'egg', 'omelette'],
  ['nasi', 'rice'],
  ['mie', 'mi', 'mee', 'noodle', 'ramen', 'udon', 'kwetiau', 'horfun', 'bihun'],
  ['sup', 'sop', 'soup'],
  ['bubur', 'porridge'],
  ['buntut', 'oxtail'],
  ['goreng', 'fried'],
  ['sayur', 'vegetable'],
  ['tahu', 'tofu'],
  ['roti', 'bread', 'toast', 'sandwich', 'prata'],
  ['kentang', 'fries', 'potato'],
  ['madu', 'honey'],
  ['kopi', 'coffee', 'espresso', 'americano', 'latte', 'cappuccino'],
  ['teh', 'tea'],
  ['susu', 'milk', 'milo'],
  ['jus', 'juice'],
  ['buah', 'fruit'],
  ['es', 'ice', 'iced'],
  ['air', 'water', 'aqua'],
  ['bir', 'beer'],
  ['rokok', 'cigarette'],
  ['korek', 'lighter'],
]

// Below this length a typed word must equal a synonym exactly ("es", "mi"), not just start it.
const MIN_PREFIX_FOR_SYNONYM = 3
// Short synonyms ("es", "teh", "bir") only match whole words, so "ice" doesn't list "Espresso".
const MIN_LENGTH_FOR_SYNONYM_PREFIX = 4
// Shorter words are too close to each other to guess at typos ("beef" vs "beer").
const MIN_LENGTH_FOR_TYPO = 5

export const normalize = (text) =>
  text
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const toWords = (text) => normalize(text).split(' ').filter(Boolean)

// Optimal string alignment distance, capped: we only ever need to know "0, 1 or more".
const isWithinOneEdit = (a, b) => {
  if (Math.abs(a.length - b.length) > 1) return false
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i])
  for (let j = 1; j <= b.length; j++) rows[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      rows[i][j] = Math.min(rows[i - 1][j] + 1, rows[i][j - 1] + 1, rows[i - 1][j - 1] + cost)
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        rows[i][j] = Math.min(rows[i][j], rows[i - 2][j - 2] + 1)
      }
    }
  }
  return rows[a.length][b.length] <= 1
}

// Each typed word becomes a list of terms: the word itself plus its synonyms in the other language.
const toTerms = (token) => {
  const typed = { text: token, isTyped: true }
  const isSynonymOf = (word) =>
    token.length < MIN_PREFIX_FOR_SYNONYM ? word === token : word.startsWith(token)
  const synonyms = SYNONYM_SETS.filter((set) => set.some(isSynonymOf))
    .flat()
    .filter((word) => word !== token)
    .map((word) => ({ text: word, isTyped: false }))
  return [typed, ...synonyms]
}

const isTypo = (word, text) =>
  text.length >= MIN_LENGTH_FOR_TYPO &&
  // A typo in the whole word ("chiken") or in the part typed so far ("honye").
  [text.length - 1, text.length, text.length + 1].some((length) =>
    isWithinOneEdit(word.slice(0, length), text),
  )

const wordMatches = (word, { text, isTyped }, allowTypos) => {
  if (!isTyped && text.length < MIN_LENGTH_FOR_SYNONYM_PREFIX) return word === text
  if (word.startsWith(text)) return true
  return allowTypos && isTyped && isTypo(word, text)
}

// Words that mean "this whole section", e.g. typing "beer" should also list Heineken.
// Only for sections whose item names don't already say what they are.
const CATEGORY_KEYWORDS = {
  japanese: ['japanese', 'jepang', 'korean', 'korea'],
  western: ['western'],
  breakfast: ['breakfast', 'sarapan'],
  vegetables: ['vegetarian'],
  snacks: ['snack', 'camilan'],
  desserts: ['dessert', 'ice', 'cream', 'krim'],
  softDrinks: ['soft', 'soda', 'ringan'],
  beer: ['beer', 'bir'],
  spirits: ['spirit', 'liquor'],
  bottles: ['bottle', 'botol', 'wine', 'spirit'],
  cigarettes: ['cigarette', 'rokok'],
}

const buildIndex = (categories) =>
  categories.flatMap((category) =>
    category.items.map((item) => ({
      key: `${category.id}:${item.id}`,
      words: [...toWords(item.name), ...(CATEGORY_KEYWORDS[category.id] ?? [])],
    })),
  )

const findMatchingKeys = (index, termsPerToken, allowTypos) =>
  new Set(
    index
      .filter(({ words }) =>
        termsPerToken.every((terms) =>
          terms.some((term) => words.some((word) => wordMatches(word, term, allowTypos))),
        ),
      )
      .map(({ key }) => key),
  )

// Returns the categories (in menu order) with only the items that match every typed word.
// Typo-tolerant matching is a fallback for when the exact spelling finds nothing.
export const searchMenu = (categories, query) => {
  const tokens = toWords(query)
  if (!tokens.length) return categories

  const termsPerToken = tokens.map(toTerms)
  const index = buildIndex(categories)
  let matchingKeys = findMatchingKeys(index, termsPerToken, false)
  if (!matchingKeys.size) matchingKeys = findMatchingKeys(index, termsPerToken, true)

  return categories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => matchingKeys.has(`${category.id}:${item.id}`)),
    }))
    .filter((category) => category.items.length)
}
