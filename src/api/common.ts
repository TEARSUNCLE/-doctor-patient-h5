import { codeLoginType, getCodeType } from "@/types/common";
import request from "@/utils/request";

/** 登录-获取验证码 */ 
export const getCodeApi = (params: getCodeType) => {
  return request.get(`code`, { params })
}

/** 验证码登录 */ 
export const codeLoginApi = (params: codeLoginType) => {
  return request.post(`login`, params)
}

/** 密码登录 */ 
export const accountLoginApi = (params: codeLoginType) => {
  return request.post(`login/password`, params)
}

/** 通用上传 */ 
export const commonUploadApi = (params: any) => {
  return request.post(`upload`, params)
}