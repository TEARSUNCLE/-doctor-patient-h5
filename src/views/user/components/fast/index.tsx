import useStore from "@/store"
import { defineComponent } from "vue"
import { RouterLink, useRouter } from "vue-router"
import styles from '../css/fast.module.less'
import Navbar from "@/components/Navbar"
export default defineComponent({

  setup() {
    const router = useRouter()
    const { consult } = useStore()

    const handleGo = (illnessType: string, type: string) => {
      consult.setConsultInfo({ illnessType, type })
      router.push('/consult/department')
    }

    return {
      router,
      handleGo,
    }
  },

  render() {
    const { router, handleGo } = this
    return (
      <>
        <div class={styles.fastBox}>
          <Navbar title="极速问诊" v-slots={{
            rightText: () => (
              <>
                <div onClick={() => router.push('/user/consult')}>问诊记录</div>
              </>
            )
          }} />

          <div class='fast-logo textCenter mt30 mb45'>
            <img src="/images/consult-fast.png" alt="" width={240} />
            <p class='fs16 mt10'> <span style={{ color: '#16c2a3' }}>20s</span> 快速匹配专业医生</p>
          </div>

          <div class='fast-type pl15 pr15'>
            <a href="javascript:;" onClick={() => handleGo('1', '2')} class='item mb15 flexWrap'>
              <div class='flexBox'>
                <img src="/images/icons/consult/doctor.svg" alt="" width={40} height={40} />
                <div class='info ml10'>
                  <p class='fs16 title mb4'>三甲图文问诊</p>
                  <p class='desc'>三甲主治及以上级别医生</p>
                </div>
              </div>
              <van-icon name="arrow" class='fs14 c-999' />
            </a>
            <a href="javascript:;" onClick={() => handleGo('0', '1')} class='item flexWrap'>
              <div class='flexBox'>
                <img src="/images/icons/consult/message.svg" alt="" width={40} height={40} />
                <div class='info ml10'>
                  <p class='fs16 title mb4'>普通图文问诊</p>
                  <p class='desc'>二甲主治及以上级别医生</p>
                </div>
              </div>
              <van-icon name="arrow" class='fs14 c-999' />
            </a>
          </div>
        </div>
      </>
    )
  }
})