import { createRouter, createWebHistory } from 'vue-router'
import { getSavedLanguage, saveLanguage, translate } from '@/i18n'
import MenuView from '@/views/MenuView.vue'

const LANG = ':lang(en|id)'

// Paths are kept identical to the old ones so existing QR codes and links keep working.
const routes = [
  { path: '/', redirect: () => `/${getSavedLanguage()}/menu` },
  { path: `/${LANG}`, redirect: (to) => `/${to.params.lang}/menu` },
  {
    path: `/${LANG}/menu`,
    name: 'menu',
    component: MenuView,
    meta: { titleKey: 'nav.menu' },
  },
  {
    path: `/${LANG}/handicap-golf-fields`,
    name: 'fields',
    component: () => import('@/views/FieldsView.vue'),
    meta: { titleKey: 'nav.fields' },
  },
  {
    path: `/${LANG}/about`,
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
    meta: { titleKey: 'nav.about', showBack: true },
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    // Switching language keeps the reader where they were on the same page.
    if (to.name === from.name) return false
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const lang = to.params.lang
  if (!lang) return

  saveLanguage(lang)
  document.documentElement.lang = lang
  const pageTitle = to.meta.titleKey ? translate(lang, to.meta.titleKey) : ''
  document.title = pageTitle ? `${pageTitle} · Indah Puri` : 'Indah Puri'
})

export default router
