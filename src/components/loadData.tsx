import { defineComponent, ref } from "vue"
export default defineComponent({
  props: {
    notDataMsg: {
      type: String,
      default: '没有更多了'
    },
    listLength: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  },
  emits: ['setLoadData'],
  setup(props, { emit }) {
    const historyHeight = ref<number>(0)

    window.addEventListener('scroll', () => {
      // 滚动高度
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 元素内部高度，包含padding 不包含border margin
      const windowHeight = document.documentElement.clientHeight || document.body.clientHeight
      // 元素内容高度
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight

      if (scrollTop + windowHeight > historyHeight.value && scrollTop + windowHeight == scrollHeight) {
        historyHeight.value = scrollTop + windowHeight
        emit('setLoadData', 'loadData')
      }
    })
  },

  render(props) {
    return (
      <>
        {props.listLength === props.total &&
          <div class='textCenter fs14 mt15 mb20' style={{ color: 'rgb(150, 151, 153)' }}>
            {props.notDataMsg}
          </div>}
      </>
    )
  }
})