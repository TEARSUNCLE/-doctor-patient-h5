import { delOrderApi, getConsultPreApi, getOrderDetailApi } from "@/api/patient"
import { consultFlag, consultOrderStatus, illnessTime } from "@/types/mock"
import { orderDetailType } from "@/types/patient"
import { computed, defineComponent, onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import styles from '../css/detail.module.less'
import CopyBoard from "@/components/copyBoard"
import { showConfirmDialog, showImagePreview, showToast } from "vant"
export default defineComponent({

  setup() {
    const copyRef = ref<any>(null)
    const popupShow = ref<boolean>(false)
    const curModalId = ref('')

    const orderDetail = reactive({
      data: {} as orderDetailType
    })

    const router = useRouter()
    const route = useRoute()

    const getOrderList = async () => {
      const { data } = await getOrderDetailApi({ orderId: route.params.id })
      if (data.code === 10000) {
        orderDetail.data = data.data
      }
    }

    // 复制
    const copyFn = () => {
      copyRef.value.copyFn()
    }

    const patientInfo = computed(() => {
      if (orderDetail.data.patientInfo) {
        const { name, gender, age } = orderDetail.data.patientInfo
        return `${name} | ${gender === 1 ? '女' : '男'} | ${age}岁`
      }
    })

    const toggleState = (id: string) => {
      if (id) {
        popupShow.value = !popupShow.value
        curModalId.value = id
      }
    }

    const derOrderModal = (id: string) => {
      showConfirmDialog({
        title: '温馨提示',
        message:
          '您确认要删除该订单吗？',
      })
        .then(() => {
          delOrder(id)
        })
        .catch(() => {
          // 取消事件
        })
    }

    const delOrder = async (id: string) => {
      const { data } = await delOrderApi(id)
      if (data.code === 10000) {
        showToast('已删除')
        router.back()
      }
    }

    // 查看处方
    const getConsultPre = async (id: string) => {
      const { data } = await getConsultPreApi(id)
      if (data.code === 10000) {
        showImagePreview({ images: [data.data.url], closeable: true })
      }
    }

    const handleBtn = (preId: string, type: string) => {
      if (type === 'checkPre') {
        getConsultPre(preId)
      }
    }

    onMounted(() => {
      getOrderList()
    })

    return {
      router,
      patientInfo,
      orderDetail,
      copyFn,
      copyRef,
      popupShow,
      curModalId,
      toggleState,
      derOrderModal,
      handleBtn,
    }
  },

  render() {
    const { router, patientInfo, orderDetail, copyFn, popupShow, curModalId, toggleState, derOrderModal, handleBtn } = this
    return (
      <>
        <div class={styles.consultDetailBox}>
          <van-nav-bar
            title="问诊详情"
            left-text=""
            left-arrow
            onClickLeft={() => router.back()}
          />

          <div class='detail-head'>
            <div class='text'>
              <div class='flexWrap'>
                <h3 class='fs16'>图文问诊 {orderDetail.data.payment} 元</h3>
                <span class='fs16 f500'>{consultOrderStatus[orderDetail.data.status]}</span>
              </div>
              <p class='fs14 mt5'>服务医生信息</p>
            </div>
            <div class='card bg-ff flexWrap'>
              <div class='flexBox'>
                <img src="/images/avatar-doctor.svg" alt="" width={38} height={38} />
                <p class='pl15'>
                  <span class='block fs16'>极速问诊</span>
                  <span>{orderDetail.data.docInfo?.name || '暂未分配到医生'}</span>
                </p>
              </div>
              <van-icon name="arrow" class='fs14 c-999' />
            </div>
          </div>

          <div class='detail-patient bg-ff pb13 mt35'>
            <van-cell-group class='pl3 pr3'>
              <van-cell title='患者信息' value={patientInfo} />
              <van-cell title="患病时长" value={illnessTime[orderDetail.data.illnessTime]} />
              <van-cell title="就诊情况" value={consultFlag[orderDetail.data.consultFlag]} />
              <van-cell title="病情描述" label={orderDetail.data.illnessDesc} />
            </van-cell-group>
          </div>

          <div class='detail-order mt10 bg-ff'>
            <h3 class='fs16 f400 pt10 pb10 pl18 pr18'>订单信息</h3>
            <van-cell-group class='pl3 pr3 orderNo'>
              <span class='fs12 copyBtn hand block' onClick={copyFn}>复制</span>
              <van-cell title='订单编号' value={<CopyBoard content={orderDetail.data.orderNo} ref='copyRef' />} />
              <van-cell title="创建时间" value={orderDetail.data.createTime} />
              <van-cell title="应付款" value={'￥' + orderDetail.data.payment} />
              <van-cell title="优惠券" value={'-￥' + orderDetail.data.couponDeduction} />
              <van-cell title="积分抵扣" value={'-￥' + orderDetail.data.pointDeduction} />
              <van-cell title="实付款" value={'￥' + orderDetail.data.actualPayment} class='actualPayment' />
            </van-cell-group>
          </div>

          <div class='foot flexWrap pl15 pr15 pb bg-ff'>

            <div class='fs14 more'>
              {orderDetail.data.status === 4 && <>
                <p onClick={() => toggleState(orderDetail.data.id)} class='hand'>更多</p>
                {popupShow && curModalId === orderDetail.data.id &&
                  <div class='popup bg-ff pt8 pb10 textCenter pl10 pr10'>
                    <van-button type="default" class='pb20 check' disabled={!orderDetail.data.prescriptionId} onClick={() => getConsultPre(orderDetail.data.prescriptionId as string)}>查看处方</van-button>
                    <van-button type="default" class='pb15 pt20' onClick={() => derOrderModal(orderDetail.data.id)}>删除订单</van-button>
                    <div class='triangle'></div>
                  </div>
                }
              </>
              }
            </div>

            <div class='flexBox'>
              {(orderDetail.data.status === 1 || orderDetail.data.status === 2) && <p class='fs12 btn ml10 hand' onClick={() => handleBtn(orderDetail.data.prescriptionId, 'channel')}>取消问诊</p>}
              {orderDetail.data.status === 1 && <p class='fs12 btn ml10 hand'>去支付</p>}

              {orderDetail.data.status === 3 && orderDetail.data.prescriptionId && <p class='fs12 btn ml10 hand' onClick={() => handleBtn(orderDetail.data.prescriptionId, 'checkPre')}>查看处方</p>}
              {orderDetail.data.status === 2 || orderDetail.data.status === 3 && <p class='fs12 btn ml10 hand other' onClick={() => { router.push({ name: `/room?orderId=${orderDetail.data.id}`, query: { status: orderDetail.data.status, time: orderDetail.data.createTime } }) }}>继续沟通</p>}

              {orderDetail.data.status === 4 && <p class='fs12 btn ml10 hand' onClick={() => { router.push(`/room?orderId=${orderDetail.data.id}`) }}>问诊记录</p>}
              {orderDetail.data.status === 4 && <p class={orderDetail.data.evaluateId ? 'fs12 btn ml10 hand' : 'other fs12 btn ml10 hand'}>{orderDetail.data.evaluateId ? '查看评价' : '去评价'}</p>}

              {orderDetail.data.status === 5 && <p class='fs12 btn ml10 hand' onClick={() => derOrderModal(orderDetail.data.id)}>删除订单</p>}
              {orderDetail.data.status === 5 && <p class='fs12 btn ml10 hand other' onClick={() => { router.push('/home') }}>咨询其他医生</p>}
            </div>
          </div>
        </div>
      </>
    )
  }
})