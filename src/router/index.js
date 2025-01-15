import { createRouter, createWebHistory } from 'vue-router';
import MenuPageEng from '../components/menu{en}.vue';
import HandicapGolfInfoPageEng from '../components/fields{en}.vue';
import MenuPageInd from '../components/menu{id}.vue';
import HandicapGolfInfoPageInd from '../components/fields{id}.vue';
import AboutPageInd from '../components/about{id}.vue';
import AboutPageEng from '../components/about{en}.vue';

const routes = [
  // English routes
  { path: '/en/menu', name: 'MenuPageEng', component: MenuPageEng },
  { path: '/en/handicap-golf-fields', name: 'HandicapGolfInfoPageEng', component: HandicapGolfInfoPageEng },
  { path: '/en/about', name: 'AboutPageEng', component: AboutPageEng },
  
  // Indonesian routes
  { path: '/id/menu', name: 'MenuPageInd', component: MenuPageInd },
  { path: '/id/handicap-golf-fields', name: 'HandicapGolfInfoPageInd', component: HandicapGolfInfoPageInd },
  { path: '/id/about', name: 'AboutPageInd', component: AboutPageInd },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;