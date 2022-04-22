import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'note',
    component: () => import('../leafs/_notepad/index.vue'), meta: { title: '记录一下' }
  },
  {
    path: '/uploadPackages',
    name: 'uploadPackages',
    component: () => import('../leafs/_uploadPackages/index.vue'), meta: { title: '上传软件包' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
