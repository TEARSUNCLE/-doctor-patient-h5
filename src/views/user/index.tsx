import { defineComponent, onMounted, reactive, ref } from "vue"
import useStore from "@/store"
import styles from './css/index.module.less'
import errorImg from '@/assets/images/errorImg.gif'
import { getUserInfoApi } from "@/api/user"
import { myUserType } from "@/types/user"
import { showConfirmDialog, showToast } from "vant"
import { useRouter } from "vue-router"
export default defineComponent({

  setup() {
    const menuList = ref([
      { title: '收藏', value: 0, key: 'collectionNumber' },
      { title: '关注', value: 0, key: 'likeNumber' },
      { title: '积分', value: 0, key: 'score' },
      { title: '优惠券', value: 0, key: 'couponNumber' },
    ])

    const orderMenu = ref([
      { title: '待付款', img: 'paid', key: 'noPaid' },
      { title: '待发货', img: 'shipped', key: 'Unshipped' },
      { title: '待收货', img: 'received', key: 'Uncollected' },
      { title: '已完成', img: 'finished', key: 'finished' },
    ])

    const groupList = ref([
      { title: '我的问诊', img: 'tool-01', key: 'user/consult' },
      { title: '我的处方', img: 'tool-02', key: 'home' },
      { title: '家庭档案', img: 'tool-03', key: 'user/patient' },
      { title: '地址管理', img: 'tool-04', key: 'user/address' },
      { title: '我的评价', img: 'tool-05', key: 'home' },
      { title: '官方客服', img: 'tool-06', key: 'home' },
      { title: '设置', img: 'tool-07', key: 'home' },
    ])

    const userInfo = reactive({
      data: {} as myUserType
    })
    const { user } = useStore()
    const router = useRouter()

    const handleImgError = (e) => {
      if (e) {
        let img = e.srcElement
        img.src = errorImg
        img.onerror = null
      }
    }

    const getUserInfo = async () => {
      const { data } = await getUserInfoApi()
      if (data.code === 10000) {
        userInfo.data = data.data

        menuList.value.map(item => {
          for (const key in userInfo.data) {
            if (item.key === key) {
              item.value = userInfo.data[key]
            }
          }
        })
      }
    }

    const handleLayout = () => {
      showConfirmDialog({
        title: '温馨提示',
        message:
          '您确认要退出优医问诊吗？',
      })
        .then(() => {
          user.layout()
          showToast('已退出')
          router.push('/login')
        })
        .catch(() => {
          // 取消事件
        });
    }

    onMounted(async () => {
      await getUserInfo()
    })

    return {
      user,
      handleImgError,
      menuList,
      orderMenu,
      groupList,
      handleLayout,
    }
  },

  render() {
    const { user, handleImgError, menuList, orderMenu, groupList, handleLayout } = this
    return (
      <>
        <div class={styles.userBox}>
          <div class='user-page pl15 pr15'>
            <div class='page-head pl15 pr15'>
              <div class='top flexBox aiCenter pt50'>
                <img src={user.userInfo.avatar} alt="" onError={handleImgError} width={70} height={70} />
                <div class='ml13'>
                  <p class='f500 fs18'>{user.userInfo.account}</p>
                  <p class='f500 fs18 pt5'>
                    <van-icon name="edit" color={'#16c2a3'} />
                  </p>
                </div>
              </div>
              <div class='row flexWrap pl20 pr20 mt13'>
                {menuList.length && menuList.map((item, index) => {
                  return <div class='textCenter hand' key={index}>
                    <p class='fs18 f500 pb5'>{item.value}</p>
                    <p class='fs12 c-999'>{item.title}</p>
                  </div>
                })}
              </div>
            </div>

            <div class='user-order bg-ff pl15 pr15 pb15'>
              <div class="head flexWrap pt15 pb15">
                <h3 class='fs16'>药品订单</h3>
                <a href="javascript:;" class='fs14 block c-999'>全部订单<van-icon name="arrow" class='ml3' /></a>
              </div>
              <div class='row flexWrap pl10 pr10'>
                {orderMenu.length && orderMenu.map((item, index) => {
                  return <div class='textCenter hand' key={index}>
                    <img src={'images/icons/user/' + item.img + '.svg'} alt="" width={28} height={28} />
                    <p class='fs12 pt5'>{item.title}</p>
                  </div>
                })}
              </div>
            </div>

            <div class='user-group bg-ff mt15 mb15'>
              <h3 class='fs16 pt12 pb15 pl15 pr15'>快捷工具</h3>
              {groupList.length && groupList.map((item, index) => {
                return <div key={index} class='pb9'>
                  <van-cell title={item.title} center icon={"images/icons/user/" + item.img + '.svg'} is-link />
                </div>
              })}
            </div>

            <div class='layout fs14 textCenter pb20'>
              <a href="javascript:;" onClick={handleLayout}>退出登录</a>
            </div>
          </div>
        </div>
      </>
    )
  }
})