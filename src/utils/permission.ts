// 导航守卫
import router from "@/router";
import { hasToken } from '@/utils/storage';
import { getPageTitle } from "./pageTitle";
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach((to, from, next) => {
  document.title = getPageTitle(to.meta.title as string)
  const whiteList = ['/login', '/register', '/404']
  
  NProgress.start()

  if (hasToken()) {
    whiteList.includes(to.path) ? next('/') : next()
  } else {
    whiteList.includes(to.path) ? next() : next('/login')
  }
})

router.afterEach(() => {
  NProgress.done()
})

NProgress.configure({
  easing: 'ease', // 动画方式
  speed: 500, // 递增进度条速度
  showSpinner: false, // 是否显示加载icon
  trickleSpeed: 200, // 自动递增间隔
  minimum: .3, // 初始化的最小百分比
})