export interface getCodeType {
  mobile: string,
  type: string
}

export interface codeLoginType {
  mobile: string,
  code?: string,
  password?: string,
}