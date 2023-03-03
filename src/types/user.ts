/** 基础信息 */
export interface userInfoType {
  token?: string
  refreshToken?: string
  avatar?: string
  mobile?: string
  account?: string
  id?: string
}

export interface consultationInfoType {
  id: string
  name: string
  avatar: string
  depName: string
  positionalTitles: string
  hospitalName: string
  gradeName: string
  orderId: string
}

/** 订单 */
export interface orderInfoType {
  paidNumber: number
  receivedNumber: number
  shippedNumber: number
  finishedNumber: number
}

/** 用户-详细信息 */
export interface myUserType {
  id: string
  avatar: string
  mobile: string
  account: string
  likeNumber: number
  collectionNumber: number
  score: number
  couponNumber: number
  consultationInfo: consultationInfoType[]
  orderInfo: orderInfoType
}