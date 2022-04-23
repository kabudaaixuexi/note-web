import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

let Ret = ''
if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
 Ret= '/uploadPackages'
}
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
	redirect: Ret,
    name: 'note',
    component: () => import('../leafs/_notepad/index.vue'), meta: { title: '记录一下' }
  },
  {
    path: '/portfolio',
    name: 'portfolio',
    component: () => import('../leafs/_portfolio/index.vue'), meta: { title: '虚拟网盘' }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
