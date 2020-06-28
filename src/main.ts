import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "sweetalert2/dist/sweetalert2.min.css";
import Vue from "vue";
import VueSweetalert2 from "vue-sweetalert2";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;
Vue.use(Buefy);
Vue.use(VueSweetalert2);

console.log(process.env);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount("#app");
