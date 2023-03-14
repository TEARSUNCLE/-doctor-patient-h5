import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import styles from './css/index.module.less'
import ConsultComponent from './consult/index'
import DoctorComponent from "./findDoctor"
import MedicineComponent from "./medicines"
export default defineComponent({
  setup() {
    const activeTab = ref('1')
    const router = useRouter()

    return {
      activeTab,
      router,
    }
  },

  render() {
    const { activeTab, router } = this
    return (
      <>
        <div class={styles.pageBox}>
          <van-nav-bar
            title="问诊记录"
            left-text=""
            left-arrow
            onClickLeft={() => router.back()}
          />

          <van-tabs v-modal:active={activeTab} color={'#16c2a3'}>
            <van-tab title="极速问诊">
              <ConsultComponent />
            </van-tab>
            <van-tab title="找医生">
              <DoctorComponent />
            </van-tab>
            <van-tab title="开药问诊">
              <MedicineComponent />
            </van-tab>
          </van-tabs>
        </div>
      </>
    )
  }
})