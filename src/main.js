import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 封装Axios
import httpApis from "./http/index";
Vue.prototype.$http = httpApis;

//地图安全密钥
window._AMapSecurityConfig = {
  securityJsCode: "6e4140ee558dc3899dcb22741934e9d5",
};
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
