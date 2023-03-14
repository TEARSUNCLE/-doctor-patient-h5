import { getConsultPreApi, getOrderDetailApi } from "@/api/patient"
import { consultFlag, consultOrderStatus, illnessTime } from "@/types/mock"
import { orderDetailType } from "@/types/patient"
import { showImagePreview } from "vant"
import { computed, defineComponent, onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import styles from './css/index.module.less'
export default defineComponent({

  setup() {
    const cutSearch = ref()
    const orderDetail = reactive({
      data: {} as orderDetailType
    })

    const router = useRouter()
    const route = useRoute()

    const getOrderList = async () => {
      const { data } = await getOrderDetailApi({ orderId: route.query.orderId })
      if (data.code === 10000) {
        orderDetail.data = data.data
      }
    }

    // 查看处方
    const getConsultPre = async (id: string) => {
      const { data } = await getConsultPreApi(id)
      if (data.code === 10000) {
        showImagePreview({ images: [data.data.url], closeable: true })
      }
    }

    const countdown = computed(() => {
      return orderDetail.data.countdown * 1000
    })
    const patientInfo = computed(() => {
      if (orderDetail.data.patientInfo) {
        const { name, gender, age } = orderDetail.data.patientInfo
        return `${name} ${gender === 1 ? '女' : '男'} ${age}岁`
      }
    })

    onMounted(() => {
      getOrderList()
    })

    return {
      router,
      orderDetail,
      countdown,
      patientInfo,
      getConsultPre,
      cutSearch,
    }
  },

  render() {
    const { router, orderDetail, countdown, patientInfo, getConsultPre, cutSearch } = this
    return (
      <>
        <div class={styles.roomOrderBox}>
          <van-nav-bar
            title="医生问诊室"
            left-text=""
            left-arrow
            onClickLeft={() => router.back()}
          />

          <div class='room-status bg-ff flexWrap pl15 pr15'>
            {orderDetail.data.status === 3 &&
              <span class='status'>{consultOrderStatus[orderDetail.data.status]}</span>
            }
            {[4, 5].includes(orderDetail.data.status) && <div>
              {<van-icon name="passed" />}
              <span class='ml3'>{consultOrderStatus[orderDetail.data.status]}</span>
            </div>
            }
            {orderDetail.data.status === 2 &&
              <span>已通知医生尽快接诊，24小时内医生未回复将自动退款</span>
            }

            {orderDetail.data.status === 3 &&
              <div class='flexBox mr10'>
                <span>剩余时间：</span>
                <van-count-down time={countdown} />
              </div>
            }
          </div>

          <div class='fs12 time-tip textCenter'>
            <p>
              <span>{orderDetail.data.createTime}</span>
            </p>
          </div>

          <div class='msg-illness bg-ff'>
            <div class='patient pb13'>
              <p class='fs16'>{patientInfo}</p>
              <p class='c-999 fs12 mt5'>{illnessTime[orderDetail.data.illnessTime]} | {consultFlag[orderDetail.data.consultFlag]}</p>
            </div>
            <div class='row mt15'>
              <van-row class='fs12'>
                <van-col span="6" class='mb5'>病情描述</van-col>
                <van-col span="18" class='mb5 c-999'>多福多寿</van-col>
                <van-col span="6">图片</van-col>
                <van-col span="18 c-999">点击查看</van-col>
              </van-row>
            </div>
          </div>

          <div class='fs12 time-tip textCenter'>
            <p>
              <span>医护人员正在赶来,请耐心等候</span>
            </p>
          </div>

          <div class='fs12 msg-tip textCenter'>
            <p class='flexBox'>
              <i>温馨提示：</i>
              在线咨询不能代替面诊,医护人员建议仅供参考
            </p>
          </div>

          <div class='msg-recipe fs14'>
            <div class='content bg-ff'>
              <div class='head'>
                <div class='flexWrap head-title'>
                  <h3 class='fs16 f400'>电子处方</h3>
                  <p class='c-999 fs12 hand' onClick={() => getConsultPre(orderDetail.data.prescriptionId)}>原始处方<van-icon name="arrow" /></p>
                </div>
                <p class='fs12 c-999 mt5'>{patientInfo} 身体不适，请按照处方治疗</p>
                <p class='fs12 c-999 mt5'>开方时间：{orderDetail.data.createTime}</p>
              </div>
              <div class='body pt15 pl15 pb15 pr15'>
                <div class='flexWrap head-title'>
                  <h3 class='fs14 f400'>盐酸多奈哌齐片(思博海) 5mg</h3>
                  <p class='fs12'>x8</p>
                </div>
                <p class='fs12 c-999 mt5'>口服。初始用量每次5mg（1片），每日一次，睡前服用；并至少将初始剂量维持1个月以上，才可根据治疗效果增加剂量至每次10mg（2片），仍每日一次。此为最大推荐剂量。</p>
              </div>
              <div class='foot fs16 textCenter'>
                <span>购买药品</span>
              </div>
            </div>
          </div>

          <div class='room-action flexWrap bg-ff'>
            <van-field
              class="input"
              label=""
              v-model={[cutSearch, 'value']}
              placeholder="问医生"
            />
            <van-uploader>
              <van-icon name="photo-o" class='fs24' />
            </van-uploader>
          </div>

        </div>
      </>
    )
  }
})