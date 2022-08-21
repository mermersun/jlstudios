<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>查看排片计划列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 标题 -->
    <p>
      <span style="color: #67c23a; font-weight: bold">{{
        cinemaRoomInfo.cinema_name
      }}</span
      >的
      <span style="color: #67c23a; font-weight: bold"
        >{{ cinemaRoomInfo.cinema_room_name }}
        {{ cinemaRoomInfo.cinema_room_type }}</span
      >
      排片计划列表
    </p>
    <el-divider></el-divider>
    <!-- 表单 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="电影名称"> </el-table-column>
      <el-table-column prop="showingon_date" label="放映时间">
      </el-table-column>
      <el-table-column prop="showingon_time" label="场次"> </el-table-column>
      <el-table-column prop="price" label="票价">
        <template slot-scope="scope">{{ scope.row.price }} 元</template>
      </el-table-column>
      <el-table-column prop="status" label="是否已发布">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row.plan_id, scope.row.status)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            title="删除排片计划"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteShowingonPlan(scope.row.plan_id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [],
      cinema_room_id: this.$route.params.id,
      cinemaRoomInfo: {}, //加载放映厅基本信息
    };
  },
  methods: {
    changeStatus(id, val) {
      if (val == 0) {
        this.nopublishPlan(id);
      } else if (val == 1) {
        this.publishPlan(id);
      }
    },
    //设置当前排片计划为不发布状态
    nopublishPlan(id) {
      this.$http.ShowingonPlanApi.nopublish({ id }).then((res) => {
        console.log("修改排片计划为不发布状态", res);
        if (res.data.code == 200) {
          this.$message.warning("已经成功阻止该计划的成功发布!");
        }
      });
    },
    //设置当前排片计划为发布状态
    publishPlan(id) {
      this.$http.ShowingonPlanApi.publish({ id }).then((res) => {
        console.log("修改排片计划为发布状态", res);
        if (res.data.code == 200) {
          this.$message.success("该计划发布成功!");
        }
      });
    },
    //删除排片计划
    deleteShowingonPlan(id) {
      this.$http.ShowingonPlanApi.delete({ id }).then((res) => {
        console.log("删除排片计划", res);
        if (res.data.code == 200) {
          this.$message.success("删除排片成功!");
          this.loadShowingonPlans();
        }
      });
    },
    //加载放映厅基本信息
    loadCurrentMovieRoom() {
      this.$http.MovieRoomApi.queryById({ id: this.cinema_room_id }).then(
        (res) => {
          console.log("加载放映厅基本信息", res);
          if (res.data.code == 200) {
            this.cinemaRoomInfo = res.data.data;
          }
        }
      );
    },
    // 通过放映厅ID查询排片计划列表
    loadShowingonPlans() {
      this.$http.ShowingonPlanApi.queryByRoomId({
        cinema_room_id: this.cinema_room_id,
      }).then((res) => {
        console.log("通过放映厅ID查询排片计划列表", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
  },

  mounted() {
    this.loadCurrentMovieRoom();
    this.loadShowingonPlans();
  },
};
</script>
