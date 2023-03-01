import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vant/lib/index.css';
import './assets/css/index.less'
import '@/utils/permission'
import App from './App'
import router from './router'
import Vant from 'vant'
import piniaPluginPersist from 'pinia-plugin-persist'

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersist )
app.use(router).use(Vant).use(pinia).mount('#app')