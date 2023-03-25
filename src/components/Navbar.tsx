import { defineComponent } from "vue"
import { useRouter } from "vue-router"
import styles from './css/Navbar.module.less'
export default defineComponent({
  props: {
    title: {
      type: String,
      required: true
    },
    isBack: {
      type: Boolean,
      default: true
    }
  },
  setup() {
    const router = useRouter()

    return {
      router,
    }
  },

  render(props) {
    const { router } = this
    return (
      <>
        <div class={styles.navbarBox}>
          <van-nav-bar
            title={props.title}
            left-text={this.$slots.leftText?.()}
            left-arrow={props.isBack}
            right-text={this.$slots.rightText?.()}
            onClickLeft={props.isBack ? () => router.back() : ''}
          />
        </div>
      </>
    )
  }
})