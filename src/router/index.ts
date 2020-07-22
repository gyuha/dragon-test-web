import Lobby from "@/views/Lobby.vue";
import Matgo from "@/views/Matgo.vue";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Holdem from "../views/Holdem.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Lobby",
    component: Lobby,
  },
  {
    path: "/matgo/:id",
    name: "Matgo",
    component: Matgo,
    props: true,
  },
  {
    path: "/holdem/:id",
    name: "Holdem",
    component: Holdem,
    props: true,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
