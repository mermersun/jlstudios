import axios from "axios";
const instance = axios.create();
import qs from "qs";
import store from "../store";

instance.interceptors.request.use((config) => {
  let token = store.state.token;
  if (token) {
    config.headers.authorization = token;
  }
  return config;
});
instance.interceptors.response.use((response) => {
  if (response.data.code == 401) {
    window.location = "/user/login";
  } else {
    return response;
  }
});

const myAxios = {
  get(url, params) {
    return instance({
      method: "get",
      url: url,
      params: params,
    });
  },
  post(url, params) {
    return instance({
      method: "post",
      url: url,
      data: qs.stringify(params),
    });
  },
};

export default myAxios;
