import { defineComponent } from "vue"
import styles from '../css/medicines.module.less'
export default defineComponent({

  setup() { },

  render() {
    return (
      <>
        <div class={`${styles.pageBox} fs16`}>开药问诊</div>
      </>
    )
  }
})