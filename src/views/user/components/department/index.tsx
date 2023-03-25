import { getDepListApi } from "@/api/patient"
import useStore from "@/store"
import { depType } from "@/types/patient"
import { defineComponent, onMounted, ref } from "vue"
import { RouterLink, useRoute, useRouter } from "vue-router"
import styles from '../css/dep.module.less'
import Navbar from "@/components/Navbar"
export default defineComponent({

  setup() {
    const list = ref<depType[]>([])
    const curActive = ref('')
    const router = useRouter()
    const route = useRoute()
    const { consult } = useStore()

    const tabChange = (id: string) => {
      curActive.value = id
    }

    const getDepList = async () => {
      const { data } = await getDepListApi()
      if (data.code === 10000) {
        list.value = data.data
        curActive.value = data.data[0].id
      }
    }

    const handleGo = (id: string) => {
      consult.setConsultInfo({ depId: id })
      router.push('/consult/illness')
    }

    onMounted(() => {
      getDepList()
    })

    return {
      router,
      curActive,
      tabChange,
      list,
      route,
      handleGo,
    }
  },

  render() {
    const { router, curActive, tabChange, list, route, handleGo } = this
    return (
      <>
        <div class={styles.depBox}>
          <Navbar title="选择科室" />

          <div class='wrapper flexBox'>
            <div class='tabList'>
              {list.length >= 1 && list.map(item => {
                return <div
                  class='tab-item fs14'
                  style={{ backgroundColor: curActive === item.id ? '#fff' : '', color: curActive === item.id ? '#333' : '' }}
                  key={item.id}
                  onClick={() => tabChange(item.id)}
                >
                  {item.name}
                </div>
              })}
            </div>

            <div class='sub-dep'>
              {list.length >= 1 && list.map(item => {
                return item.child.length >= 1 && curActive === item.id && item.child.map(key => {
                  return <a href="javascript:;" onClick={() => handleGo(key.id)} class='block fs14'>{key.name}</a>
                })
              })
              }
            </div>
          </div>
        </div>
      </>
    )
  }
})