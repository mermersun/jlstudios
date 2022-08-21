import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const adminApi = {
  //登录
  login(params) {
    return myAxios.post(BASEURL + "/user/login", params);
  },
};

export default adminApi;
