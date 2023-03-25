import { useUserStore } from './module/user';
import { useConsultStore } from './module/consult'
const useStore = () => {
  return {
    user: useUserStore(),
    consult: useConsultStore()
  }
}

export default useStore