// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Mc1Route from './components/Mc1Route'

import Hello from './components/Hello'

Vue.use(BootstrapVue)
Vue.use(VueRouter)
Vue.config.productionTip = false

const router = new VueRouter({
  routes:[
    {
      path: '/mc1-route',
      component: Mc1Route,
    },
    {
      path:'/',
      redirect: '/mc1-route',
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  router,
  el: '#app',
  template: '<App/>',
  components: { App }
})
