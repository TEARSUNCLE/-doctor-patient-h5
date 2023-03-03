/** 获取验证码 */
export interface getCodeType {
  mobile: string,
  type: string
}

/** 登录 */
export interface codeLoginType {
  mobile: string,
  code?: string,
  password?: string,
}