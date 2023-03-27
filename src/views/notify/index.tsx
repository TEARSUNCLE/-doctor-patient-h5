import { defineComponent } from "vue"
import styles from './css/index.module.less'
export default defineComponent({

  setup() { },

  render() {
    return (
      <div class={styles.notifyBox}>消息中心</div>
    )
  }
})