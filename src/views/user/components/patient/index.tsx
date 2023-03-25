import { createPatientApi, getPatientListApi, updatePatientApi } from "@/api/patient"
import useStore from "@/store"
import { createPatientType, patientInfoType } from "@/types/patient"
import { Desensitize } from "@/utils/common"
import { showToast } from "vant"
import { defineComponent, onMounted, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import styles from '../css/patient.module.less'
import Navbar from "@/components/Navbar"
export default defineComponent({

  setup() {
    const patientList = ref<patientInfoType[]>([])
    const showRight = ref(false)
    const router = useRouter()
    const route = useRoute()
    const { consult } = useStore()
    const curId = ref('')

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
        curId.value = patientList.value[0].id
      }
    }

    const toggleItem = (id: string) => {
      curId.value = id
    }

    const handleGo = () => {
      if (!curId.value) return showToast('请选择患者信息')
      consult.setConsultInfo({ patientId: curId.value })
      router.push('/consult/pay')
    }

    onMounted(() => {
      getPatientList()
    })

    return {
      router,
      route,
      showRight,
      showPopup,
      modalData,
      toggleGender,
      submit,
      patientList,
      handleEdit,
      curId,
      toggleItem,
      handleGo,
    }
  },

  render() {
    const {
      router,
      route,
      showRight,
      showPopup,
      modalData,
      toggleGender,
      submit,
      patientList,
      handleEdit,
      curId,
      toggleItem,
      handleGo,
    } = this
    return (
      <>
        <div class={styles.patientBox}>
          <Navbar title={route.query.isChange === '1' ? '选择患者' : '家庭档案'} />

          {route.query.isChange === '1' &&
            <div class='pt15 pb15 pl15 pr15'>
              <h3 class='fs16 f400 mb5'>请选择患者信息</h3>
              <p class='fs14' style={{ color: '#6f6f6f' }}>以便医生给出更准确的治疗，信息仅医生可见</p>
            </div>
          }

          <div class='patient-list fs14'>
            {patientList.length >= 1 && patientList.map(item => {
              return <div
                class='patient-item fs14 mb15 flexWrap'
                style={{ backgroundColor: curId === item.id ? '#eaf8f6' : '', border: curId === item.id ? '1px solid #16c2a3' : '' }}
                key={item.id}
                onClick={() => toggleItem(item.id)}
              >
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

          {route.query.isChange === '1' &&
            <div class='pl15 pr15 btn'>
              <van-button type="primary" color='#16c2a3' class='fs16' round block onClick={handleGo}>下一步</van-button>
            </div>
          }

          {/* 添加档案信息弹窗 */}
          <van-popup
            v-model:show={showRight}
            position="right"
            style={{ width: '100%', height: '100%' }}
          >
            <Navbar
              title="添加患者"
              isBack={false}
              v-slots={{
                leftText: () => (
                  <>
                    <div onClick={() => showPopup(false)}>
                      <van-icon name="arrow-left" class='mt3' />
                    </div>
                  </>
                ),
                rightText: () => (
                  <>
                    <p onClick={submit}>保存</p>
                  </>
                )
              }}
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