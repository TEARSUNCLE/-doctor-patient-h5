import { defineComponent } from "vue"
import styles from './css/index.module.less'
export default defineComponent({

  setup() { },

  render() {
    return (
      <div class={styles.articleBox}>健康中心</div>
    )
  }
})