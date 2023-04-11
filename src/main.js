import Vue from 'vue'
import App from './App.vue'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import VueSweetalert2 from 'vue-sweetalert2'
import VueSession from 'vue-session'
import Vuesax from 'vuesax'
import fullCalendar from 'vue-fullcalendar'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'sweetalert2/dist/sweetalert2.min.css'
import 'vuesax/dist/vuesax.css'
import 'boxicons'

// Make BootstrapVue available throughout your project
Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueSweetalert2);
Vue.use(VueSession)
Vue.use(Vuesax)
Vue.component('full-calendar', fullCalendar)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
