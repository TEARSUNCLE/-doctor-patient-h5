import request from "@/utils/request";

/** 用户信息 */
export const getUserInfoApi = () => {
  return request.get(`/patient/myUser`)
}