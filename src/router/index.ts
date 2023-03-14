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
    path: '/order',
    name: 'order',
    component: () => import('@/views/order/index'),
    meta: {
      title: '订单'
    }
  },
  {
    path: '/',
    component: () => TabBar,
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/home/index'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'article',
        name: 'article',
        component: () => import('@/views/article/index'),
        meta: {
          title: '健康百科'
        }
      },
      {
        path: 'notify',
        name: 'notify',
        component: () => import('@/views/notify/index'),
        meta: {
          title: '消息中心'
        }
      },
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/user/index'),
        meta: {
          title: '个人中心'
        },
      }
    ]
  },
  {
    path: '/user/consult',
    name: 'consult',
    component: () => import('@/views/user/components/index'),
    meta: {
      title: '问诊记录'
    }
  },
  // 医生问诊室
  {
    path: '/room',
    name: 'room',
    component: () => import('@/views/room/index'),
    meta: {
      title: '问诊室'
    }
  },
  {
    path: '/user/consult/:id',
    name: 'consultDetail',
    component: () => import('@/views/user/components/consultDetail/index'),
    meta: {
      title: '问诊详情'
    }
  },
  {
    path: '/user/patient',
    name: 'patient',
    component: () => import('@/views/user/components/patient/index'),
    meta: {
      title: '家庭档案'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router