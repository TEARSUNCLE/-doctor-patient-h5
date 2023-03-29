import { clearToken } from '@/utils/storage'
import { userInfoType } from '@/types/user'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      userInfo: {} as userInfoType
    }
  },

  // 数据持久化
  persist: {
    enabled: true, // 开启存储
    strategies: [
      { storage: localStorage, paths: ['userInfo'] }
    ]
  },

  actions: {
    setUserInfo(row: userInfoType) {
      if (row) {
        this.userInfo = row
      }
    },

    layout() {
      this.userInfo = {}
      clearToken()
    }
  }
})