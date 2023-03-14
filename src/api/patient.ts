import { createPatientType, requestOrderListType } from "@/types/patient";
import request from "@/utils/request";

/** 问诊记录-订单列表 */
export const getOrderListApi = (params: requestOrderListType) => {
  return request.get(`/patient/consult/order/list`, { params })
}

/** 药品-药品处方 */
export const getConsultPreApi = (id: string) => {
  return request.get(`/patient/consult/prescription/${id}`)
}

/** 订单-删除订单 */
export const delOrderApi = (id: string) => {
  return request.delete(`/patient/order/${id}`)
}

/** 问诊-订单详情 */
export const getOrderDetailApi = (params: { orderId: string | unknown }) => {
  return request.get(`/patient/consult/order/detail`, { params })
}


/** 问诊-患者列表 */
export const getPatientListApi = () => {
  return request.get(`/patient/mylist`)
}

/** 问诊-添加患者 */
export const createPatientApi = (params: createPatientType) => {
  return request.post(`/patient/add`, params)
}

/** 问诊-添加患者 */
export const updatePatientApi = (params: createPatientType) => {
  return request.put(`/patient/update`, params)
}