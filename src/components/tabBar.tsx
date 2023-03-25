import { defineComponent } from "vue"
import { RouterView, useRoute } from "vue-router"
import styles from './css/TabBar.module.less'
export default defineComponent({

  setup() {
    const route = useRoute()

    return {
      route
    }
  },

  render() {
    const { route } = this
    return (
      <>
        <RouterView />
        <div class={styles.tabBarBox}>
          <van-tabbar route>
            <van-tabbar-item to={'/home'}>
              <div class={`textCenter`}>
                <img src={route.path === '/home' ? "/images/icons/home/home-active.svg" : "/images/icons/home/home-default.svg"} alt="" width={21} height={21} />
                <p class={`pt5`}>首页</p>
              </div>
            </van-tabbar-item>
            <van-tabbar-item to={'/article'}>
              <div class={`textCenter`}>
                <img src={route.path === '/article' ? "/images/icons/home/health-active.svg" : "/images/icons/home/health-default.svg"} alt="" width={21} height={21} />
                <p class={`pt5`}>健康中心</p>
              </div>
            </van-tabbar-item>
            <van-tabbar-item to={'/notify'}>
              <div class={`textCenter`}>
                <img src={route.path === '/notify' ? "/images/icons/home/message-active.svg" : "/images/icons/home/message-default.svg"} alt="" width={21} height={21} />
                <p class={`pt5`}>消息中心</p>
              </div>
            </van-tabbar-item>
            <van-tabbar-item to={'/user'}>
              <div class={`textCenter`}>
                <img src={route.path === '/user' ? "/images/icons/home/my-active.svg" : "/images/icons/home/my-default.svg"} alt="" width={21} height={21} />
                <p class={`pt5`}>我的</p>
              </div>
            </van-tabbar-item>
          </van-tabbar>
        </div>
      </>
    )
  }
})