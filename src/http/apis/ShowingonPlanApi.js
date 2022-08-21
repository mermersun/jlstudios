import myAxios from "../MyAxios";
import BASEURL from "../BaseUrl";
const showingonPlanApi = {
  //修改当前排片计划为不发布状态
  nopublish(params) {
    return myAxios.post(BASEURL + "/plan/no-publish", params);
  },

  //修改当前排片计划为发布状态
  publish(params) {
    return myAxios.post(BASEURL + "/plan/publish", params);
  },

  //删除排片计划
  delete(params) {
    return myAxios.post(BASEURL + "/plan/del", params);
  },

  // 添加排片计划
  add(params) {
    return myAxios.post(BASEURL + "/plan/add", params);
  },

  //查询排片计划列表
  queryByRoomId(params) {
    return myAxios.get(BASEURL + "/plans/roomid", params);
  },
};

export default showingonPlanApi;
