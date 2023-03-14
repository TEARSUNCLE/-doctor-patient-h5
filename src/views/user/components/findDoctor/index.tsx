import { defineComponent } from "vue"
import styles from '../css/doctor.module.less'
export default defineComponent({

  setup() { },

  render() {
    return (
      <>
        <div class={`${styles.pageBox} fs16`}>找医生</div>
      </>
    )
  }
})