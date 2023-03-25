import { delOrderApi, getConsultPreApi, getOrderListApi } from "@/api/patient"
import { consultOrderStatus } from "@/types/mock"
import { consultOrderListType, requestOrderListType } from "@/types/patient"
import { defineComponent, onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import styles from '../css/consult.module.less'
import { showConfirmDialog, showImagePreview, showToast } from "vant"
import LoadData from "@/components/LoadData"
export default defineComponent({
  props: {
    curType: {
      type: Number,
      default: 2
    }
  },
  setup(props) {
    const popupShow = ref(false)
    const curModalId = ref('')
    const orderList = ref<consultOrderListType[]>([])

    const router = useRouter()

    const params = reactive<requestOrderListType>({
      current: 1,
      pageSize: 5,
      type: props.curType,
    })

    const pageData = reactive({
      listLength: 0,
      total: 0
    })

    const toggleState = (row: consultOrderListType) => {
      if (row.id) {
        popupShow.value = !popupShow.value
        curModalId.value = row.id
      }
    }

    const getOrderList = async () => {
      const { data } = await getOrderListApi(params)
      if (data.code === 10000) {
        orderList.value.push(...data.data.rows)
        pageData.total = data.data.total
        pageData.listLength = data.data.pageTotal
      }
    }

    // 触底加载更多数据
    const setLoadData = (type: string) => {
      if (type) {
        params.current++
        getOrderList()
      }
    }

    // 查看处方
    const getConsultPre = async (id: string) => {
      const { data } = await getConsultPreApi(id)
      if (data.code === 10000) {
        showImagePreview({ images: [data.data.url], closeable: true })
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
        getOrderList()
      }
    }

    const handleBtn = (row: consultOrderListType, type: string) => {
      if (type === 'checkPre') {
        getConsultPre(row.prescriptionId as string)
      }
    }

    onMounted(async () => {
      await getOrderList()
    })

    return {
      router,
      popupShow,
      toggleState,
      orderList,
      pageData,
      setLoadData,
      handleBtn,
      getConsultPre,
      derOrderModal,
      curModalId,
    }
  },

  render() {
    const {
      router,
      popupShow,
      toggleState,
      orderList,
      pageData,
      setLoadData,
      handleBtn,
      getConsultPre,
      derOrderModal,
      curModalId,
    } = this
    return (
      <>
        <div class={styles.consultBox}>
          <div class='consult-list'>
            {orderList.length >= 1 && orderList.map(item => {
              return <div class='consult-item bg-ff mb10' key={item.id}>
                <div class='head flexWrap pl15 pr15'>
                  <div class='flexBox'>
                    <img src="/images/avatar-doctor.svg" alt="" width={20} height={20} />
                    <p class='pl10'>{item.docInfo.name}</p>
                  </div>
                  <span class='block fs14 c-999' style={{ color: item.status === 1 ? '#f2994a' : item.status === 3 ? '#16c2a3' : '#999' }}>{consultOrderStatus[item.status]}</span>
                </div>
                <div class='body pl15 pr15 pt15' onClick={() => router.push({ path: `/user/consult/${item.id}` })}>
                  <van-row class='pb5'>
                    <van-col span="5" class='label'>病情描述</van-col>
                    <van-col span="18">{item.illnessDesc}</van-col>
                  </van-row>
                  <van-row class='pb5'>
                    <van-col span="5" class='label'>价格</van-col>
                    <van-col span="18">￥{item.payment}</van-col>
                  </van-row>
                  <van-row class='pb5'>
                    <van-col span="5" class='label'>创建时间</van-col>
                    <van-col span="18" class='time'>{item.createTime}</van-col>
                  </van-row>
                </div>
                <div class='foot flexWrap pl15 pr15 pb15 pt3'>

                  <div class='fs14 more'>
                    {item.status === 4 && <>
                      <p onClick={() => toggleState(item)} class='hand'>更多</p>
                      {popupShow && curModalId === item.id &&
                        <div class='popup bg-ff pt8 pb10 textCenter pl10 pr10'>
                          <van-button type="default" class='pb20 check' disabled={!item.prescriptionId} onClick={() => getConsultPre(item.prescriptionId as string)}>查看处方</van-button>
                          <van-button type="default" class='pb15 pt20' onClick={() => derOrderModal(item.id)}>删除订单</van-button>
                          <div class='triangle'></div>
                        </div>
                      }
                    </>
                    }
                  </div>

                  <div class='flexBox'>
                    {(item.status === 1 || item.status === 2) && <p class='fs12 btn ml10 hand' onClick={() => handleBtn(item, 'channel')}>取消问诊</p>}
                    {item.status === 1 && <p class='fs12 btn ml10 hand other'>去支付</p>}

                    {item.status === 3 && item.prescriptionId && <p class='fs12 btn ml10 hand' onClick={() => handleBtn(item, 'checkPre')}>查看处方</p>}
                    {item.status === 2 || item.status === 3 && <p class='fs12 btn ml10 hand other' onClick={() => { router.push({ name: `/room?orderId=${item.id}`, query: { status: item.status, time: item.createTime } }) }}>继续沟通</p>}

                    {item.status === 4 && <p class='fs12 btn ml10 hand' onClick={() => { router.push(`/room?orderId=${item.id}`) }}>问诊记录</p>}
                    {item.status === 4 && <p class={item.evaluateId ? 'fs12 btn ml10 hand' : 'other fs12 btn ml10 hand'}>{item.evaluateId ? '查看评价' : '去评价'}</p>}

                    {item.status === 5 && <p class='fs12 btn ml10 hand' onClick={() => derOrderModal(item.id)}>删除订单</p>}
                    {item.status === 5 && <p class='fs12 btn ml10 hand other' onClick={() => { router.push('/home') }}>咨询其他医生</p>}
                  </div>
                </div>
              </div>
            })}
          </div>

          <LoadData listLength={pageData.listLength} total={pageData.total} onSetLoadData={setLoadData} />
        </div>
      </>
    )
  }
})