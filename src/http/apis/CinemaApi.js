import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const cinemaApi = {
  //修改电影院信息
  update(params) {
    return myAxios.post(BASEURL + "/cinema/update", params);
  },

  //通过ID查询电影院
  queryById(params) {
    return myAxios.get(BASEURL + "/cinema/query", params);
  },

  //删除电影院
  delete(params) {
    return myAxios.post(BASEURL + "/cinema/del", params);
  },

  //查询所有电影院
  list() {
    return myAxios.get(BASEURL + "/cinemas");
  },

  // 添加电影
  add(params) {
    return myAxios.post(BASEURL + "/cinema/add", params);
  },

  //查询所有影院标签
  queryAllTags() {
    return myAxios.get(BASEURL + "/cinema/tags");
  },
};

export default cinemaApi;
