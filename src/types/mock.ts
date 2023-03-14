/** 图文、开药问诊订单状态 */
export enum consultOrderStatus {
  '待支付' = 1,
  '待接诊' = 2,
  '咨询中' = 3,
  '已完成' = 4,
  '已取消' = 5,
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
  '一月内' = 2,
  '半年内' = 3,
  '半年以上' = 4
}

/** 找医生/问诊-是否就诊过 */
export enum consultFlag {
  '未就诊' = 0,
  '就诊过' = 1
}