import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const movieApi = {
  // 添加电影
  add(params) {
    return myAxios.post(BASEURL + "/movie-info/add", params);
  },

  // 查询所有电影类型
  loadAllMovieTypes() {
    return myAxios.get(BASEURL + "/movie-types");
  },

  //查询所有电影
  list(params) {
    return myAxios.get(BASEURL + "/movie-infos", params);
  },

  // 删除电影
  delete(params) {
    return myAxios.post(BASEURL + "/movie-info/del", params);
  },

  // 通过ID查找电影
  queryById(params) {
    return myAxios.get(BASEURL + "/movie-info/query", params);
  },

  // 通过电影名称模糊查找电影
  listByName(params) {
    return myAxios.post(BASEURL + "/movie-infos/name", params);
  },

  // 修改电影
  update(params) {
    return myAxios.post(BASEURL + "/movie-info/update", params);
  },

  //为电影绑定演员
  bindActors(params) {
    return myAxios.post(BASEURL + "/movie-info/bind-actors", params);
  },
};

export default movieApi;
