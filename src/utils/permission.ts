// 导航守卫
import router from "@/router";
import { getPageTitle } from "./pageTitle";

router.beforeEach((to, from, next) => {
  document.title = getPageTitle(to.meta.title as string)

  const whiteList = ['/login', '/register', '/404']

  next()
})