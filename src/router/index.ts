import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'dashboard', component: () => import('@/views/DesignSystemView.vue') },
    {
      path: '/directions',
      name: 'directions',

      component: () => import('@/views/DirectionsView.vue'),
    },
  ],
})

export default router
