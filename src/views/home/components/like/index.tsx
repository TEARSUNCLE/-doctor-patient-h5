import { getLikeDocApi, likeApi } from "@/api/home"
import { articleListType, doctorListType, requestArticleListType } from "@/types/home"
import { defineComponent, onMounted, ref } from "vue"
import styles from '../css/like.module.less'
export default defineComponent({
  props: {
    typeKey: {
      type: String,
      required: true
    }
  },
  setup() {
    const doctorList = ref<any[]>([])

    const getDoctorList = async () => {
      const params = {
        current: 1,
        pageSize: 5
      }
      const { data } = await getLikeDocApi(params)
      if (data.code === 10000) {
        for (let i = 0; i < data.data.rows.length; i += 5) {
          doctorList.value.push(data.data.rows.slice(i, i + 5))
        }
      }
    }

    const handleLike = async (row: articleListType) => {
      const { data } = await likeApi({ type: 'doc', id: row.id })
      if (data.code === 10000) {
        const index = doctorList.value[0].findIndex(item => item.id === row.id)
        doctorList.value[0][index].likeFlag = doctorList.value[0][index].likeFlag == 0 ? 1 : 0
      }
    }

    onMounted(() => {
      getDoctorList()
    })

    return {
      doctorList,
      handleLike,
    }
  },

  render() {
    const { doctorList, handleLike } = this
    return (
      <>
        <div class={styles.likeBox}>
          <div class='like-content'>
            <div class='head flexWrap'>
              <p>推荐关注</p>
              <a href="javascript:;" class='c-999'>查看更多<van-icon name="arrow" /></a>
            </div>
            <div class='body'>
              <van-swipe autoplay="" show-indicators={false} loop={false}>
                {doctorList.length >= 1 && doctorList[0].map((key, index) => {
                  return <van-swipe-item key={index}>
                    <div class='list-item'>
                      <div class='doctor-card textCenter bg-ff textCenter'>
                        <div class='mb8'>
                          <img src={key.avatar} alt="" />
                        </div>
                        <p class='name mb5'>{key.name}</p>
                        <p class='desc c-999 fs12 oneLine'>{key.hospitalName + key.depName}</p>
                        <p class='c-999 fs12'>{key.positionalTitles}</p>

                        <div class='btn flexBox aiCenter flexcenterX c-fff' onClick={() => handleLike(key)}>
                          {Boolean(key.likeFlag) ? '已关注' : '+ 关注'}
                        </div>
                      </div>
                    </div>
                  </van-swipe-item>
                })
                }
              </van-swipe>
            </div>
          </div>
        </div >
      </>
    )
  }
})