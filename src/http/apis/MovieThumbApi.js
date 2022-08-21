import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const movieThumbApi = {
  // 添加剧照
  add(params) {
    return myAxios.post(BASEURL + "/movie-thumb/add", params);
  },

  //查询相应电影id下的所有电影
  listByMovieId(params) {
    return myAxios.post(BASEURL + "/movie-thumbs/movieid", params);
  },

  // 删除剧照
  delete(params) {
    return myAxios.post(BASEURL + "/movie-thumb/del", params);
  },
};

export default movieThumbApi;
