import request from "@/utils/request";

/** 订单-支付 */
export const orderPayApi = (params) => {
  return request.post(`patient/consult/pay`, params)
}