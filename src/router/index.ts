import { RouteRecordRaw, createWebHistory, createRouter } from 'vue-router'
import TabBar from '@/components/tabBar'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: () => TabBar,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'home',
        component: () => import('@/views/user/index'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/article',
        name: 'article',
        component: () => import('@/views/article/index'),
        meta: {
          title: '健康百科'
        }
      },
      {
        path: '/notify',
        name: 'notify',
        component: () => import('@/views/notify/index'),
        meta: {
          title: '消息中心'
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router