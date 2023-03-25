/** 图文、开药问诊订单状态 */
export enum consultOrderStatus {
  '待支付' = 1,
  '待接诊',
  '咨询中',
  '已完成',
  '已取消',
}

/** 药品订单状态 */
export enum medicineOrderStatus {
  '待支付' = 10,
  '待发货' = 11,
  '待收货' = 12,
  '已完成' = 13,
  '已取消' = 14,
}

/** 找医生/问诊-患病时间 */
export enum illnessTime {
  '一周内' = 1,
  '一月内',
  '半年内',
  '半年以上',
}

/** 找医生/问诊-是否就诊过 */
export enum consultFlag {
  '未就诊' = 0,
  '就诊过' = 1
}