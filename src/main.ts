import { createApp } from 'vue'
import 'vant/lib/index.css';
import './assets/css/index.less'
import App from './App'
import router from './router'
import Vant from 'vant'
import '@/utils/permission'

const app = createApp(App)
app.use(router).use(Vant).mount('#app')