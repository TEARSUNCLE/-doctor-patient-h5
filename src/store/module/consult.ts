import { requestOrderPreType, setIllnessType } from '@/types/patient'
import { defineStore } from 'pinia'

export const useConsultStore = defineStore('consult', {
  state: () => {
    return {
      consultInfo: {} as requestOrderPreType,
      illnesInfo: {} as setIllnessType
    }
  },

  // 数据持久化
  persist: {
    enabled: true, // 开启存储
    strategies: [
      { storage: localStorage, paths: ['consultInfo', 'illnesInfo'] }
    ]
  },

  actions: {
    setConsultInfo(row: requestOrderPreType) {
      if (row) {
        this.consultInfo = { ...this.consultInfo, ...row }
      }
    },

    setIllnessInfo(row: setIllnessType) {
      if (row) {
        this.illnesInfo = row
      }
    }
  }
})