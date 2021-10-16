import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import main from '../components/main.vue';
import PortalVue from 'portal-vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
//import { createPopper } from '@popperjs/core';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueRouter);
Vue.use(PortalVue);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
const popcorn = document.querySelector('#popcorn');
const tooltip = document.querySelector('#tooltip');
//createPopper(popcorn, tooltip, { placement: 'top',});

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/main',
    name: 'main',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: main
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
