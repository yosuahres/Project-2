import './assets/styles.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { loadMenu } from './data/menu-store'

// Start fetching the menu before the first page renders, so it is already on its way.
if (!window.location.pathname.startsWith('/admin')) loadMenu()

const app = createApp(App).use(router)
// Wait for the first route (and the admin sign-in check) so the right frame shows from the start.
router.isReady().then(() => app.mount('#app'))
