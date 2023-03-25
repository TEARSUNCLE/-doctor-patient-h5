import { orderPayApi } from "@/api/order"
import { showConfirmDialog, showToast } from "vant"
import { defineComponent, ref } from "vue"
import { useRouter } from "vue-router"
import styles from './css/PayPopup.module.less'
export default defineComponent({
  props: {
    isShowPay: {
      type: Boolean,
      required: true
    },
    curOrder: {
      type: Object,
      default: () => { { } }
    }
  },
  emits: ['setShowPayFn'],
  setup(props, { emit }) {
    const payOpt = ref('')
    const router = useRouter()

    const togglePay = (val: string) => {
      payOpt.value = val
    }

    const handlePay = async () => {
      if (!payOpt.value) return showToast('请选择支付方式')
      const params = {
        paymentMethod: payOpt.value,
        orderId: props.curOrder.id
      }
      const { data } = await orderPayApi(params)
      if (data.code === 10000) {
        window.location.href = data.data.payUrl
      } else {
        showToast(data.message)
      }
    }

    const onClose = () => {
      return showConfirmDialog({
        title: '关闭支付',
        message: '取消支付将无法获得医生回复，医生接诊名额有限，是否确认关闭？',
        cancelButtonText: '仍要关闭',
        confirmButtonText: '继续支付',
      })
        .then(() => {
          emit('setShowPayFn', true)
          return false
        })
        .catch(() => {
          emit('setShowPayFn', false)
          router.push('/user/consult')
          return true
        })
    }

    return {
      payOpt,
      togglePay,
      handlePay,
      onClose,
    }
  },

  render(props) {
    const { payOpt, togglePay, handlePay, onClose } = this
    return (
      <>
        <div class={styles.payBox}>
          <van-popup
            v-model:show={props.isShowPay}
            position="bottom"
            style={{ height: '39%' }}
            before-close={onClose}
          >
            <div class='header fs16 f500 textCenter'>选择支付方式</div>
            <div class='content'>
              <p class='fs16 f700 pt20 pb20 pl20 pr20 textCenter'>￥{props.curOrder.price.toFixed(2)}</p>
              <van-radio-group>
                <van-cell-group inset>
                  <van-cell
                    title={
                      <div class='flexBox aiCenter'>
                        <img src="/images/icons/consult/wechat.svg" width={18} class='mr10' />
                        <span>微信支付</span>
                      </div>
                    }
                    value={
                      <div class='flexBox flexEndX'>
                        <van-radio name="0" icon-size="16px" checked={payOpt === '0'} checked-color='#16c2a3' onClick={() => togglePay('0')} />
                      </div>
                    }
                  />
                  <van-cell
                    title={
                      <div class='flexBox aiCenter'>
                        <img src="/images/icons/consult/alipay.svg" width={18} class='mr10' />
                        <span>支付宝支付</span>
                      </div>
                    }
                    value={
                      <div class='flexBox flexEndX'>
                        <van-radio name="1" icon-size="16px" checked={payOpt === '1'} checked-color='#16c2a3' onClick={() => togglePay('1')} />
                      </div>
                    }
                  />
                </van-cell-group>
              </van-radio-group>

              <div class='btn'>
                <van-button type="primary" class='fs16' color='#16c2a3' block round onClick={handlePay}>立即支付</van-button>
              </div>
            </div>
          </van-popup>
        </div >
      </>
    )
  }
})