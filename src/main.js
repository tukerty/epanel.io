// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App'
import router from './router'
import vOutsideEvents from 'vue-outside-events'
import VueSocketio from 'vue-socket.io'

import 'vue-material-design-icons/styles.css'

Vue.use(vOutsideEvents)
Vue.use(VueAxios, axios)
Vue.use(VueSocketio, 'http://127.0.0.1:3000')

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
