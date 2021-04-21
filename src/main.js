import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Http from './utils/http.js'
import ElementUI from 'element-ui';

import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/index.scss'

Vue.config.productionTip = false

Vue.prototype.$http = Http

Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
