import { defineComponent, ref } from "vue"
import styles from './css/index.module.less'
import CommonComponent from "./components/common"
import LikeComponent from "./components/like"
import { useRouter } from "vue-router"
export default defineComponent({

  setup() {
    const router = useRouter()
    const activeKey = ref('recommend')
    const isActive = ref(true)
    const topRow = ref([
      { img: 'doctor', title: '问医生', desc: '按科室查问医生' },
      { img: 'graphic', title: '极速问诊', desc: '20s医生极速回复', path: 'consult/fast' },
      { img: 'prescribe', title: '开药门诊', desc: '线上买药更方便' }
    ])
    const rowList = ref([
      { img: 'order', title: '药品订单' },
      { img: 'docs', title: '健康档案' },
      { img: 'rp', title: '我的处方' },
      { img: 'find', title: '疾病查询' }
    ])

    const toggleTab = (row: { name: string }) => {
      if (row) {
        isActive.value = false
        activeKey.value = row.name
      }
    }

    return {
      topRow,
      rowList,
      activeKey,
      toggleTab,
      isActive,
      router,
    }
  },

  render() {
    const { topRow, rowList, activeKey, toggleTab, isActive, router } = this
    return (
      <>
        <div class={styles.homeBox}>
          <div class='home-head'>
            <div class='con pl15 pr15'>
              <h1 class='fs18 f400 pl5 pt20 pb15 c-fff'>优医</h1>
              <div class='search flexBox aiCenter bg-ff'>
                <van-icon name="search" class='fs16 mr5' />搜一搜：疾病/症状/医生/健康知识
              </div>
            </div>
          </div>

          <div class='home-navs'>
            <div class='top-row pt10 pb10'>
              <van-row gutter="20">
                {topRow.length && topRow.map((item, index) => {
                  return <van-col span="8" class='textCenter hand' key={index} onClick={() => router.push('/' + item.path)}>
                    <img src={`/images/icons/home/${item.img}.svg`} alt="" width={48} />
                    <p class='fs14 title f500 mt5' style={{ color: '#121826' }}>{item.title}</p>
                    <p class='fs12 desc mt2' style={{ color: '#848484' }}>{item.desc}</p>
                  </van-col>
                })}
              </van-row>
            </div>
            <div class='row pt5 pb5'>
              <van-row gutter="20">
                {rowList.length && rowList.map((item, index) => {
                  return <van-col span="6" class='textCenter hand' key={index}>
                    <img src={`/images/icons/home/${item.img}.svg`} alt="" width={31} />
                    <p class='title mt5' style={{ color: '#121826', fontSize: '13px' }}>{item.title}</p>
                  </van-col>
                })}
              </van-row>
            </div>
          </div>

          <div class='home-banner'>
            <van-swipe class="my-swipe" autoplay="" indicator-color="white" loop={false}>
              <van-swipe-item>
                <img src="/images/ad.png" alt="" />
              </van-swipe-item>
              <van-swipe-item>
                <img src="/images/ad.png" alt="" />
              </van-swipe-item>
            </van-swipe>
          </div>

          <div class='home-tabs'>
            <van-tabs v-model={[activeKey, isActive ? 'active' : 'active']} shrink onClickTab={toggleTab}>
              <van-tab title="关注" name='like'>
                <LikeComponent typeKey={activeKey} />
                <CommonComponent typeKey={activeKey} />
              </van-tab>
              <van-tab title="推荐" name='recommend'>
                <CommonComponent typeKey={activeKey} />
              </van-tab>
              <van-tab title="减脂" name='fatReduction'>
                <CommonComponent typeKey={activeKey} />
              </van-tab>
              <van-tab title="饮食" name='food'>
                <CommonComponent typeKey={activeKey} />
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </>
    )
  }
})