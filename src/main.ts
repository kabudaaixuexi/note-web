import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css'
import 'xs-editor/lib/style/common.css'

createApp(App).use(ElementPlus).use(router).mount('#app')
