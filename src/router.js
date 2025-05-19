import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Fleet from './pages/Fleet.vue';
import Book from './pages/Book.vue';
import ServiceDetail from './pages/ServiceDetail.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/vehicles', component: Fleet },
  { path: '/book', component: Book },
  { path: '/services/:service', component: ServiceDetail },
  { path: '/:notFound(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() { return { top: 0 }; }
});

export default router;