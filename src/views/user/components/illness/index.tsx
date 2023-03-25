import { commonUploadApi } from "@/api/common"
import { showConfirmDialog, showToast } from "vant"
import { computed, defineComponent, onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import styles from '../css/illness.module.less'
import Navbar from "@/components/Navbar"
import { setIllnessType } from "@/types/patient"
import useStore from "@/store"
export default defineComponent({

  setup() {
    const router = useRouter()
    const route = useRoute()
    const { consult } = useStore()

    const otherData: setIllnessType = reactive({
      illnessDesc: '',
      illnessTime: undefined,
      consultFlag: undefined,
      pictures: []
    })

    const timeOptions = ref([
      { label: '一周内', value: 1 },
      { label: '一月内', value: 2 },
      { label: '半年内', value: 3 },
      { label: '大于半年', value: 4 }
    ])
    const flagOptions = ref([
      { label: '就诊过', value: 0 },
      { label: '没就诊过', value: 1 }
    ])

    const changeItem = (val: number, type: string) => {
      otherData[type] = val
    }
    const onBeforeRead = (file: { type: string }) => {
      const WhiteList = ['image/jpg', 'image/png', 'image/jpeg', 'image/gif']
      if (!WhiteList.includes(file.type)) {
        showToast('请上传正确的格式图片')
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast('上传的图片不可大于5M')
        return false
      }
      return true
    }

    const onAfterRead = (file) => {
      if (!file.file) return

      file.status = 'uploading'
      file.message = '上传中...'
      requestFile(file.file).then(res => {
        file.status = 'done'
        file.message = undefined
        file.file = res
      })
    }

    const requestFile = async (file: string | Blob) => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await commonUploadApi(formData)
      if (data.code === 10000) {
        showToast('已上传')
        return data.data
      }
    }

    const isTrue = computed(() => {
      if (otherData.consultFlag && otherData.illnessTime && otherData.illnessDesc) return true
      return false
    })

    const submit = () => {
      if (!otherData.illnessDesc) return showToast('请输入病情描述')
      if (!otherData.illnessTime) return showToast('请选择症状持续时间')
      if (!otherData.consultFlag) return showToast('请选择是否已经就诊')

      consult.setIllnessInfo(otherData)
      router.push('/user/patient?isChange=1')
    }

    const showConfirm = () => {
      showConfirmDialog({
        title: '温馨提示',
        message: '是否恢复您之前填写的病情信息呢？',
        closeOnPopstate: false
      }).then(() => {
        // 确认
        otherData.illnessDesc = consult.illnesInfo.illnessDesc
        otherData.illnessTime = consult.illnesInfo.illnessTime
        otherData.consultFlag = consult.illnesInfo.consultFlag
        otherData.pictures = consult.illnesInfo.pictures
      }).catch(() => { })
    }

    onMounted(() => {
      if (consult.illnesInfo) {
        showConfirm()
      }
    })

    return {
      router,
      route,
      otherData,
      timeOptions,
      flagOptions,
      changeItem,
      onAfterRead,
      onBeforeRead,
      isTrue,
      submit,
    }
  },

  render() {
    const {
      router,
      route,
      otherData,
      timeOptions,
      flagOptions,
      changeItem,
      onAfterRead,
      onBeforeRead,
      isTrue,
      submit,
    } = this
    return (
      <>
        <div class={styles.illnessBox}>
          <Navbar title="图文问诊" />

          <div class='illness-tip flexBox'>
            <img src="/images/avatar-doctor.svg" alt="" width={52} height={52} class='mt10' />
            <div class='info pl12'>
              <p class='fs16 mb5'>在线医生</p>
              <p class='tip mb10'>请描述你的疾病或症状、是否用药、就诊经历，需要我听过什么样的帮助</p>
              <p class='fs12' style={{ color: '#6f6f6f' }}><van-icon name="completed" class='pr2' />内容仅医生可见</p>
            </div>
          </div>

          <div class='illness-form'>
            <van-cell-group inset class='pt15'>
              <van-field
                v-model={otherData.illnessDesc}
                type="textarea"
                rows="3"
                placeholder="请详细描述您的病情，病情描述不能为空"
              />
            </van-cell-group>

            <div class='itemBox pl15 pr15'>
              <p class='mt15 mb15 fs14'>本次患病多久了？</p>
              <div class='ops flexBox'>
                {timeOptions.length >= 1 && timeOptions.map(item => {
                  return <div
                    key={item.value}
                    class='item mb10 mr10 fs14'
                    style={{ backgroundColor: otherData.illnessTime === item.value ? '#eaf8f6' : '', borderColor: otherData.illnessTime === item.value ? '#16c2a3' : '' }}
                    onClick={() => changeItem(item.value, 'illnessTime')}
                  >
                    {item.label}
                  </div>
                })}
              </div>
            </div>
            <div class='itemBox pl15 pr15'>
              <p class='mt15 mb15 fs14'>此次病情是否去医院就诊过？</p>
              <div class='ops flexBox'>
                {flagOptions.length >= 1 && flagOptions.map(item => {
                  return <div
                    key={item.value}
                    class='item mb10 mr10 fs14'
                    style={{ backgroundColor: otherData.consultFlag === item.value ? '#eaf8f6' : '', borderColor: otherData.consultFlag === item.value ? '#16c2a3' : '' }}
                    onClick={() => changeItem(item.value, 'consultFlag')}
                  >
                    {item.label}
                  </div>
                })}
              </div>
            </div>

            <div class='upload-wrapper mt15 mb40 pl15 pr15 flexBox aiCenter'>
              <van-uploader
                upload-icon='photo-o'
                upload-text='上传图片'
                max-count="9"
                max-size={5 * 1024 * 1024}
                v-model={otherData.pictures}
                afterRead={onAfterRead}
                beforeRead={onBeforeRead}
              >
              </van-uploader>
              {!otherData.pictures.length && <p class='fs12 c-999 tip'>上传内容仅医生可见,最多9张图,最大5MB</p>}
            </div>
          </div>

          <div class='pl15 pr15 btn'>
            <van-button
              type="primary"
              style={{ color: !isTrue ? '#d9dbde' : '#fff' }}
              color={!isTrue ? '#fafafa' : '#16c2a3'}
              class='fs16'
              block
              onClick={submit}
            >
              下一步
            </van-button>
          </div>
        </div>
      </>
    )
  }
})