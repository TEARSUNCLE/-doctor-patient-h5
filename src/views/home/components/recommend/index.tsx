import { defineComponent, onMounted, reactive, ref } from "vue"
import styles from '../css/recommend.module.less'
import LoadData from "@/components/loadData"
import { getKnowledgeListApi, likeApi } from "@/api/home"
import { articleListType } from "@/types/home"
export default defineComponent({

  setup() {
    const list = ref<articleListType[]>([])
    const otherData = reactive({
      pageTotal: 0,
      total: 0
    })
    const params = reactive({
      type: 'recommend',
      current: 1,
      pageSize: 10
    })

    const getList = async () => {
      const { data } = await getKnowledgeListApi(params)
      if (data.code === 10000) {
        list.value.push(...data.data.rows)
        otherData.pageTotal = data.data.pageTotal
        otherData.total = data.data.total

        console.log(27, list.value)
      }
    }

    const handleLike = async (row: articleListType) => {
      const { data } = await likeApi({ type: 'knowledge', id: row.id })
      if (data.code === 10000) {
        const index = list.value.findIndex(item => item.id === row.id)
        list.value[index].likeFlag = list.value[index].likeFlag == 0 ? 1 : 0
      }
    }

    const loadData = (type: string) => {
      if (type) {
        params.current++
        getList()
      }
    }

    onMounted(() => {
      getList()
    })

    return {
      list,
      otherData,
      handleLike,
      loadData,
    }
  },

  render() {
    const { list, otherData, handleLike, loadData } = this
    return (
      <>
        <div class={styles.recommendBox}>
          <ul class='knowledge-list pl15 pr15'>
            {list.length >= 1 && list.map(item => {
              return <li key={item.id} class={'knowledge-card pt20 pb17'}>
                <div class='head flexWrap'>
                  <img src={item.creatorAvatar} alt="" width={40} height={40} />
                  <div class='info pr10 fs14'>
                    <p>{item.creatorName}</p>
                    <p class='c-999 fs12 oneLine'>{item.creatorHospatalName} {item.creatorDep} {item.creatorTitles}</p>
                  </div>
                  <div class='btn flexBox aiCenter flexcenterX' onClick={() => handleLike(item)}>
                    {Boolean(item.likeFlag) ? '已关注' : '+ 关注'}
                  </div>
                </div>
                <div class='body'>
                  <h3 class='fs16 mt8 f400'>{item.title}</h3>
                  <div class='intro mt8 fs14 twoLine'>{item.content}</div>
                  <div class='imgs flexWrap mt7'>
                    {item.coverUrl.length >= 1 && item.coverUrl.map((key, index) => {
                      return <div class='img' key={index}>
                        <img src={key} alt="" />
                      </div>
                    })}
                  </div>
                  <p class='logs mt10'>
                    <span class='mr16'>{item.collectionNumber} 收藏</span>
                    <span>{item.commentNumber} 评论</span>
                  </p>
                </div>
              </li>
            })}
            <LoadData listLength={otherData.pageTotal} total={otherData.total} onSetLoadData={loadData} />
          </ul>
        </div>
      </>
    )
  }
})