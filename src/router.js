import { createRouter, createWebHistory } from 'vue-router';
import Home from './pages/Home.vue';
import Fleet from './pages/Fleet.vue';
import Book from './pages/Book.vue';
import ServiceDetail from './pages/ServiceDetail.vue';
import TourDetail from './pages/TourDetail.vue';

const DEFAULT_TITLE = 'Express Transfer Paros | Transfer Services in Paros';

const routes = [
  { path: '/', component: Home, meta: { title: DEFAULT_TITLE } },
  { path: '/vehicles', component: Fleet, meta: { title: 'Our Fleet | Express Transfer Paros' } },
  // renamed booking path to match the TourDetail link
  { path: '/booking', component: Book, meta: { title: 'Book a Transfer | Express Transfer Paros' } },
  // existing service details
  { path: '/services/:service', component: ServiceDetail },
  // new tour detail page
  { path: '/tours/:id', component: TourDetail },
  // section routes — same Home page, scroll to section
  { path: '/contact', component: Home, meta: { scrollTo: '#contact', title: 'Contact Us | Express Transfer Paros' } },
  { path: '/tours', component: Home, meta: { scrollTo: '#tours', title: 'Tours in Paros | Express Transfer Paros' } },
  { path: '/fleet', component: Home, meta: { scrollTo: '#fleet', title: 'Our Fleet | Express Transfer Paros' } },
  { path: '/services', component: Home, meta: { scrollTo: '#services', title: 'Transfer Services | Express Transfer Paros' } },
  { path: '/about', component: Home, meta: { scrollTo: '#about', title: 'About Us | Express Transfer Paros' } },
  { path: '/reviews', component: Home, meta: { scrollTo: '#reviews', title: 'Customer Reviews | Express Transfer Paros' } },
  // fallback
  { path: '/:notFound(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    const target = to.hash || to.meta?.scrollTo;
    if (target) return { el: target, behavior: 'smooth' };
    return { top: 0 };
  }
});

router.afterEach((to) => {
  document.title = to.meta?.title || DEFAULT_TITLE;
});

export default router;
