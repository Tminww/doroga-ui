import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/design-system',
      name: 'designSystem',

      component: () => import('@/views/DesignSystem.vue'),
    },
  ],
})

export default router
