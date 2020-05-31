import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAMap from 'vue-amap'

Vue.config.productionTip = false

Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '3b2af4f8d425b56314e832583b3ebf6d',
  plugin: ['AMap.Geolocation'],
  uiVersion: '1.0',
  v: '1.4.4'
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
