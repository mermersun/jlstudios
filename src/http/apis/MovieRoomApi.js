import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const movieApi = {
  //通过放映厅ID查询放映厅
  queryById(params) {
    return myAxios.get(BASEURL + "/cinema-room/query", params);
  },

  //修改座位模板
  updateSeatTemplate(params) {
    return myAxios.post(BASEURL + "/cinema-room/edit-seat-template", params);
  },

  // 添加放映厅
  add(params) {
    return myAxios.post(BASEURL + "/cinema-room/add", params);
  },

  // 查询所有放映厅类型
  loadAllMovieRoomTypes() {
    return myAxios.get(BASEURL + "/cinema-room/types");
  },

  // 删除放映厅
  delete(params) {
    return myAxios.post(BASEURL + "/cinema-room/del", params);
  },

  // 通过电影ID查找放映厅
  queryMovieById(params) {
    return myAxios.get(BASEURL + "/cinema-rooms/movieid", params);
  },
};

export default movieApi;
