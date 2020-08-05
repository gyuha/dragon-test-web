import Lobby from '@/views/Lobby.vue';
import Matgo from '@/views/Matgo.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Holdem from '../views/Holdem.vue';
import Login from '../views/Login.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/lobby/:token',
    name: 'lobby',
    component: Lobby,
    props: true,
  },
  {
    path: '/matgo/:id',
    name: 'matgo',
    component: Matgo,
    props: true,
  },
  {
    path: '/holdem/:id',
    name: 'holdem',
    component: Holdem,
    props: true,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
