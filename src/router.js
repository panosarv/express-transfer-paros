import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Fleet from './pages/Fleet.vue';
import Book from './pages/Book.vue';
import ServiceDetail from './pages/ServiceDetail.vue';
import TourDetail from './pages/TourDetail.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/vehicles', component: Fleet },
  // renamed booking path to match the TourDetail link
  { path: '/booking', component: Book },
  // existing service details
  { path: '/services/:service', component: ServiceDetail },
  // new tour detail page
  { path: '/tours/:id', component: TourDetail },
  // fallback
  { path: '/:notFound(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;
