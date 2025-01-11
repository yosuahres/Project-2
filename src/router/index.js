import { createRouter, createWebHistory } from 'vue-router';
import MenuPage from '../components/menu.vue';
import GameInfoPage from '../components/gameField.vue';

const routes = [
  { path: '/menu', name: 'MenuPage', component: MenuPage },
  { path: '/game-info', name: 'GameInfoPage', component: GameInfoPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;