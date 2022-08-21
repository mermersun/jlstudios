import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const actorApi = {
  // 查询演员
  list(params) {
    return myAxios.get(BASEURL + "/movie-actors", params);
  },

  // 模糊查询
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-actors/name", params);
  },

  // 添加演员
  add(params) {
    return myAxios.post(BASEURL + "/movie-actor/add", params);
  },

  // 删除演员
  delete(params) {
    return myAxios.post(BASEURL + "/movie-actor/del", params);
  },

  //通过电影ID查询演员
  listByMovieId(params) {
    return myAxios.get(BASEURL + "/movie-actors/movieid", params);
  },
};

export default actorApi;
