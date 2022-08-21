import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const directorApi = {
  // 查询导演
  list(params) {
    return myAxios.get(BASEURL + "/movie-directors", params);
  },

  // 模糊查询
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-directors/name", params);
  },

  // 添加导演
  add(params) {
    return myAxios.post(BASEURL + "/movie-director/add", params);
  },

  // 删除导演
  delete(params) {
    return myAxios.post(BASEURL + "/movie-director/del", params);
  },
};

export default directorApi;
