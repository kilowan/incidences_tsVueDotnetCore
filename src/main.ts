import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import PortalVue from 'portal-vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { createPopper } from '@popperjs/core';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

const popcorn: any = document.querySelector('#popcorn');
const tooltip: any = document.querySelector('#tooltip');
createPopper(popcorn, tooltip, { placement: 'top',});

Vue.use(PortalVue);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
