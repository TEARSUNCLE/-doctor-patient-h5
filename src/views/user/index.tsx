import useStore from "@/store"
import { defineComponent } from "vue"
export default defineComponent({

  setup() {
    const { user } = useStore()

    console.log(8, user.userInfo)
    
  },

  render() {
    return (
      <div class={`fs30`}>个人中心</div>
    )
  }
})