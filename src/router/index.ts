import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/Home.vue";
import main from '../components/main.vue';
import statistics from '../components/statistics.vue';
import employeeList from '../components/employeeList.vue';
import incidences from '../components/incidences.vue';
import pieces from '../components/piecesList.vue';
import PasswordRecovery from '../components/PasswordRecovery.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/PasswordRecovery",
    name: "PasswordRecovery",
    component: PasswordRecovery,
  },
  {
    path: '/main',
    name: 'main',
    component: main,
    children: [
      {
        path: '/main/incidences',
        name: 'incidences',
        component: incidences
      },
      {
        path: '/main/pieces',
        name: 'pieces',
        component: pieces
      },
      {
        path: '/main/employeeList',
        name: 'employeeList',
        component: employeeList
      },
      {
        path: '/main/statistics',
        name: 'statistics',
        component: statistics
      }
    ]
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
