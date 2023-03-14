import { showToast } from "vant"
import { defineComponent } from "vue"
import { copyText } from 'vue3-clipboard'
export default defineComponent({
  props: {
    content: { // 复制的内容
      type: String,
      required: true
    },
    text: { // 显示的内容
      type: String,
      default: ''
    }
  },

  setup(props) {
    const copyFn = () => {
      copyText(props.content, undefined, (error) => {
        if (error) {
          console.log('复制错误', error)
        } else {
          showToast('复制成功')
        }
      })
    }

    return {
      copyFn
    }
  },

  render(props) {
    const { copyFn } = this
    return (
      <div>
        <div class={'inlineBlock vMiddle'}>
          {props.text || props.content}
        </div>
        {/* <div class={'hand inlineBlock vMiddle edit ml5'} style={'position: relative; top: -1px;'} onClick={copyFn}>
          <img src={copyIcon} />
        </div> */}
      </div>
    )
  }
})