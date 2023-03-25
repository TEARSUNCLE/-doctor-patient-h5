import { computed, defineComponent, onMounted, reactive, ref } from "vue"
import Navbar from "@/components/Navbar"
import styles from '../css/pay.module.less'
import { buildOrderAPI, getPatientInfoApi, orderPreApi } from "@/api/patient"
import useStore from "@/store"
import { couponInfoType, patientInfoType } from "@/types/patient"
import { showToast } from "vant"
import PayPopup from "@/components/PayPopup"
export default defineComponent({

  setup() {
    const isActive = ref<boolean>(false)
    const showPopup = ref<boolean>(false)
    const curOrder = reactive({
      info: {}
    })
    const payInfo = reactive({
      data: {} as couponInfoType
    })
    const patientInfo = reactive({
      data: {} as patientInfoType
    })
    const { consult } = useStore()

    const getPreinfo = async () => {
      const params = {
        type: consult.consultInfo.type,
        illnessType: consult.consultInfo.illnessType
      }
      const { data } = await orderPreApi(params)
      if (data.code === 10000) {
        payInfo.data = data.data
      }
    }

    const getPatientinfo = async () => {
      const { data } = await getPatientInfoApi(consult.consultInfo.patientId as string)
      if (data.code === 10000) {
        patientInfo.data = data.data
      }
    }

    const showPatientInfo = computed(() => {
      if (patientInfo.data) {
        const { name, gender, age } = patientInfo.data
        return `${name} | ${gender === 1 ? '男' : '女'} | ${age}岁`
      }
    })

    const toggleStatus = () => {
      isActive.value = !isActive.value
    }

    const handlePay = async () => {
      if (!isActive.value) return showToast('请勾选我已同意支付协议')
      const payData = {
        ...consult.consultInfo,
        ...consult.illnesInfo,
        couponId: null,
        pictures: consult.illnesInfo.pictures.map(item => {
          return {
            ...item.file
          }
        })
      }
      if (payData.illnessType) payData.illnessType = +payData.illnessType
      if (payData.type) payData.type = +payData.type
      const { data } = await buildOrderAPI(payData)
      if (data.code === 10000) {
        curOrder.info = {
          price: payInfo.data.actualPayment,
          id: data.data.id
        }
        showPopup.value = true
      }
    }

    const setShowPayFn = (show: boolean) => {
      showPopup.value = show
    }

    onMounted(() => {
      getPreinfo()
      getPatientinfo()
    })

    return {
      payInfo,
      showPatientInfo,
      toggleStatus,
      isActive,
      handlePay,
      consult,
      patientInfo,
      showPopup,
      curOrder,
      setShowPayFn,
    }
  },

  render() {
    const {
      payInfo,
      showPatientInfo,
      toggleStatus,
      isActive,
      handlePay,
      consult,
      patientInfo,
      showPopup,
      curOrder,
      setShowPayFn,
    } = this
    return (
      <div class={styles.payBox}>
        <Navbar title="支付" />

        {payInfo.data && patientInfo.data && <div class='pay-page'>
          <div class='pay-info'>
            <p class='fs16 mb10'>图文问诊 {payInfo.data.payment} 元</p>
            <div class='flexBox'>
              <img src="/images/avatar-doctor.svg" alt="" class='mr10' />
              <p class='desc'>
                <span class='block fs16'>极速问诊</span>
                <span class='block fs14'>自动分配医生</span>
              </p>
            </div>
          </div>

          <van-cell-group>
            <van-cell title="优惠券" value={'-¥' + payInfo.data.couponDeduction} />
            <van-cell title="积分抵扣" value={'-¥' + payInfo.data.pointDeduction} />
            <van-cell title="实付款" value={'¥' + payInfo.data.actualPayment} class='actualPayment' />
          </van-cell-group>

          <div class='pay-space'></div>

          <van-cell-group>
            <van-cell title="患者信息" value={showPatientInfo} />
            <van-cell title="病情描述" label={consult.illnesInfo.illnessDesc} />
          </van-cell-group>

          <div class='pay-schema flexBox flexcenterX aiCenter fs14'>
            <van-checkbox
              checked={isActive}
              onClick={toggleStatus}
              icon-size="14px"
              checked-color="#16c2a3"
            >我已同意 <span style={{ color: '#16c2a3' }}>支付协议</span></van-checkbox>
          </div>

          <van-action-bar class='flexWrap pl15 pr15'>
            <div>
              <span class='fs14'>合计: </span>
              <span class='fs12 price'>¥</span>
              <span class='fs20 price'>{payInfo.data.actualPayment}</span>
              <span class='fs12 price'>.00</span>
            </div>
            <van-button text="立即支付" color='#16c2a3' round class='fs16' onClick={handlePay} />
          </van-action-bar>
        </div>
        }

        {/* 支付抽屉 */}
        {showPopup && <PayPopup isShowPay={showPopup} curOrder={curOrder.info} onSetShowPayFn={setShowPayFn} />}
      </div>
    )
  }
})