import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/projects/:id',
    name: 'ProjectDetails',
    component: () => import('@/views/ProjectDetails.vue')
  },
  {
    path: '/subdomains/:id',
    name: 'SubdomainDetails',
    component: () => import('@/views/SubdomainDetails.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;