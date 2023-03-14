import { createPatientApi, getPatientListApi, updatePatientApi } from "@/api/patient"
import { createPatientType, patientInfoType } from "@/types/patient"
import { Desensitize } from "@/utils/common"
import { showToast } from "vant"
import { defineComponent, onMounted, reactive, ref } from "vue"
import { useRouter } from "vue-router"
import styles from '../css/patient.module.less'
export default defineComponent({

  setup() {
    const patientList = ref<patientInfoType[]>([])
    const showRight = ref(false)
    const router = useRouter()

    const modalData = reactive({
      data: {
        id: '',
        name: '',
        idCard: '',
        defaultFlag: 0,
        gender: 1
      } as createPatientType
    })

    const showPopup = (show: boolean) => {
      if (!show) {
        modalData.data = {}
        modalData.data.defaultFlag = 0
        modalData.data.gender = 1
      }
      showRight.value = show
    }

    const toggleGender = (num: number) => {
      modalData.data.gender = num
    }

    const submit = async () => {
      // 姓名 2-16位中文字符
      const namePattern = /^(?:[\u4e00-\u9fa5·]{2,16})$/
      const idCardPattern = /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/
      if (!modalData.data.name) return showToast('请输入真实姓名')
      if (!namePattern.test(modalData.data.name)) return showToast('中文2-16个字符')
      if (!modalData.data.idCard) return showToast('请输入身份证号')
      if (!idCardPattern.test(modalData.data.idCard)) return showToast('身份证号码不正确')

      const params = {
        ...modalData.data
      }
      if (!params.id) delete params.id
      if (params.genderValue) delete params.genderValue
      if (params.age) delete params.age
      const { data } = !params.id ? await createPatientApi(params) : await updatePatientApi(params)
      if (data.code === 10000) {
        showPopup(false)
        getPatientList()
        showToast(!params.id ? '添加成功' : '修改成功')
      }
    }

    const handleEdit = (row: createPatientType) => {
      if (row) {
        modalData.data = { ...row }
        showPopup(true)
      }
    }

    const getPatientList = async () => {
      const { data } = await getPatientListApi()
      if (data.code === 10000) {
        patientList.value = data.data
      }
    }

    onMounted(() => {
      getPatientList()
    })

    return {
      router,
      showRight,
      showPopup,
      modalData,
      toggleGender,
      submit,
      patientList,
      handleEdit,
    }
  },

  render() {
    const { router, showRight, showPopup, modalData, toggleGender, submit, patientList, handleEdit } = this
    return (
      <>
        <div class={styles.patientBox}>
          <van-nav-bar
            title="家庭档案"
            left-text=""
            left-arrow
            onClickLeft={() => router.back()}
          />

          <div class='patient-list fs14'>
            {patientList.length && patientList.map(item => {
              return <div class='patient-item fs14 mb15 flexWrap' key={item.id}>
                <div class='info'>
                  <van-row gutter="20">
                    <van-col span="6" class='fs16' style={{ color: '#121826;' }}>{item.name}</van-col>
                    <van-col span="18" style={{ color: '#3c3e42' }}>{Desensitize(item.idCard, 6, 14)}</van-col>

                    <van-col span="2" class='c-999 mt5'>{item.gender === 1 ? '男' : '女'}</van-col>
                    <van-col span="15" class='c-999 mt5'>{item.age + '岁'}</van-col>
                  </van-row>
                </div>
                <div class='icon fs14' onClick={() => handleEdit(item)}><van-icon name="edit" color="#848484" /></div>
                {Boolean(item.defaultFlag) && <div class='tag'>默认</div>}
              </div>
            })}
            {patientList.length < 6 && <div class='patient-add textCenter' onClick={() => showPopup(true)}>
              <van-icon name="plus" class='fs22' />
              <p class='mt5'>添加患者</p>
            </div>}
            <div class='patient-tip'>最多可添加 6 人</div>
          </div>

          {/* 添加档案信息弹窗 */}
          <van-popup
            v-model:show={showRight}
            position="right"
            style={{ width: '100%', height: '100%' }}
          >
            <van-nav-bar
              title="家庭档案"
              left-text=""
              right-text="保存"
              left-arrow
              onClickLeft={() => showPopup(false)}
              onClickRight={submit}
            />
            <div class='form'>
              <van-form>
                <van-cell-group inset>
                  <van-field
                    v-model={modalData.data.name}
                    name="name"
                    label="真实姓名"
                    placeholder="请输入真实姓名"
                    maxlength='16'
                  />
                  <van-field
                    v-model={modalData.data.idCard}
                    name="idCard"
                    label="身份证号"
                    placeholder="请输入身份证号"
                    maxlength='18'
                  />
                  <van-row class='mt15 arr' align='center'>
                    <van-col span="7" offset="1" class='fs14'>性别</van-col>
                    <van-col span="10" class='fs14'>
                      <van-row class='genderRow' justify='center'>
                        <van-col span='10'
                          onClick={() => toggleGender(1)}
                          style={{ 'backgroundColor': modalData.data.gender === 1 ? '#eaf8f6' : '#f6f7f9', 'height': '32px', 'lineHeight': '30px', 'textAlign': 'center', 'borderRadius': '4px', 'border': '1px solid', 'borderColor': modalData.data.gender === 1 ? '#16c2a3' : '#f6f7f9' }}>
                          男
                        </van-col>
                        <van-col span='10' offset="4"
                          onClick={() => toggleGender(0)}
                          style={{ 'backgroundColor': modalData.data.gender === 0 ? '#eaf8f6' : '#f6f7f9', 'height': '32px', 'lineHeight': '30px', 'textAlign': 'center', 'borderRadius': '4px', 'border': '1px solid', 'borderColor': modalData.data.gender === 0 ? '#16c2a3' : '#f6f7f9' }}>
                          女
                        </van-col>
                      </van-row>
                    </van-col>
                  </van-row>
                  <van-row justify='center'>
                    <van-col span="22">
                      <van-divider />
                    </van-col>
                  </van-row>
                </van-cell-group>
                <div class='flexBox ml32 mt5 arr'>
                  <p class='fs14'>默认就诊人</p>
                  <van-checkbox class='ml30 fs14' checked={modalData.data.defaultFlag} checked-color="#16c2a3" icon-size="18px" onClick={() => modalData.data.defaultFlag === 1 ? modalData.data.defaultFlag = 0 : modalData.data.defaultFlag = 1} />
                </div>
              </van-form>
            </div>
          </van-popup>
        </div >
      </>
    )
  }
})