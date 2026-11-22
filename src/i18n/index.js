import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { messages } from './messages'

export const SUPPORTED_LANGUAGES = Object.keys(messages)
export const DEFAULT_LANGUAGE = 'en'

const STORAGE_KEY = 'indah-puri:lang'

export const isSupportedLanguage = (lang) => SUPPORTED_LANGUAGES.includes(lang)

export const getSavedLanguage = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return isSupportedLanguage(saved) ? saved : DEFAULT_LANGUAGE
  } catch {
    return DEFAULT_LANGUAGE
  }
}

export const saveLanguage = (lang) => {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // Storage can be unavailable (private mode); the URL still carries the language.
  }
}

const lookup = (lang, key) =>
  key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages[lang])

const interpolate = (text, vars) =>
  text.replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match))

export const translate = (lang, key, vars = {}) => {
  const value = lookup(lang, key) ?? lookup(DEFAULT_LANGUAGE, key) ?? key
  return typeof value === 'string' ? interpolate(value, vars) : value
}

export const useI18n = () => {
  const route = useRoute()
  const lang = computed(() =>
    isSupportedLanguage(route.params.lang) ? route.params.lang : DEFAULT_LANGUAGE,
  )
  const t = (key, vars) => translate(lang.value, key, vars)

  return { lang, t }
}
