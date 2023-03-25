import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import styles from './css/index.module.less'
import ConsultComponent from './consult/index'
import Navbar from "@/components/Navbar"
export default defineComponent({
  setup() {
    const activeTab = ref('2')
    const isActive = ref(true)
    const router = useRouter()

    const toogleTab = (row: { name: string }) => {
      if (row) {
        isActive.value = false
        activeTab.value = row.name
      }
    }

    return {
      activeTab,
      router,
      isActive,
      toogleTab,
    }
  },

  render() {
    const { activeTab, router, isActive, toogleTab } = this
    return (
      <>
        <div class={styles.pageBox}>
          <Navbar title="问诊记录" />

          <van-tabs
            v-model={[activeTab, isActive ? 'active' : 'active']}
            color={'#16c2a3'}
            onClickTab={toogleTab}
          >
            <van-tab title="极速问诊" name='2'>
              <ConsultComponent curType={+activeTab} />
            </van-tab>
            <van-tab title="找医生" name='1'>
              <ConsultComponent curType={+activeTab} />
            </van-tab>
            <van-tab title="开药问诊" name='3'>
              <ConsultComponent curType={+activeTab} />
            </van-tab>
          </van-tabs>
        </div>
      </>
    )
  }
})