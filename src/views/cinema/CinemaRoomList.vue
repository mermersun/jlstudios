<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 操作按钮 -->
    <el-button type="success" @click="showAddCinemaRoom">新增放映厅</el-button>
    <!-- 列表页面 -->
    <el-divider content-position="left">电影院列表</el-divider>
    <el-empty
      v-if="tableData.length == 0"
      description="当前影院暂无放映厅"
    ></el-empty>
    <!-- 放映厅列表 -->
    <el-table v-else :data="tableData" style="width: 100%">
      <el-table-column prop="room_name" label="放映厅名称" align="center">
      </el-table-column>
      <el-table-column prop="room_type" label="放映厅类型" align="center">
      </el-table-column>
      <el-table-column prop="room_size" label="放映厅座位数量" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.room_size"> {{ scope.row.room_size }} </span>
          <span v-else style="color: #aaa">【请先配置座位模板】</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            title="查看排片计划列表"
            type="success"
            icon="el-icon-view"
            circle
            @click="$router.push(`/home/showingon-plan/list/${scope.row.id}`)"
          ></el-button>
          <el-button
            title="添加排片计划"
            type="primary"
            icon="el-icon-plus"
            circle
            @click="
              $router.push(`/home/cinema-room-showingon-plan/${scope.row.id}`)
            "
          ></el-button>
          <el-button
            title="配置座位模板"
            type="warning"
            icon="el-icon-s-grid"
            circle
            @click="
              $router.push(`/home/cinema-room-seat-template/${scope.row.id}`)
            "
          ></el-button>
          <el-button
            title="删除放映厅"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="deleteMovieCinemaRoom(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增放映厅弹窗 -->
    <el-dialog title="添加放映厅" :visible.sync="dialogAddCinemaRoomVisible">
      <el-form :model="form">
        <el-form-item label="放映厅名称">
          <el-input
            v-model="form.room_name"
            autocomplete="off"
            style="width: 350px"
          ></el-input>
        </el-form-item>
        <el-form-item label="放映厅类型">
          <el-select
            v-model="form.room_type"
            placeholder="请选择放映厅类型"
            style="width: 350px"
          >
            <el-option
              :label="item.type_name"
              :value="item.type_name"
              v-for="item in cinemaRoomTypes"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          plain
          @click="dialogAddCinemaRoomVisible = false"
          >取 消</el-button
        >
        <el-button type="success" @click="onSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cinemaRoomTypes: "", //所有放映厅类型
      dialogAddCinemaRoomVisible: false, //添加框
      tableData: [],
      form: {
        room_name: "",
        room_type: "",
        movie_cinema_id: this.$route.params.id,
      },
    };
  },
  methods: {
    //点击按钮弹出添加框
    showAddCinemaRoom() {
      this.dialogAddCinemaRoomVisible = true;
    },
    //加载所有放映厅类型
    loadAllCinemaRoomTypes() {
      this.$http.MovieRoomApi.loadAllMovieRoomTypes().then((res) => {
        console.log("加载所有放映厅类型", res);
        if (res.data.code == 200) {
          this.cinemaRoomTypes = res.data.data;
        }
      });
    },
    //点击确定新增放映厅
    onSubmit() {
      this.$http.MovieRoomApi.add(this.form).then((res) => {
        console.log("点击确定新增放映厅", res);
      });
      this.dialogAddCinemaRoomVisible = false;
      this.form.room_name = "";
      this.form.room_type = "";
      this.loadAllCinemaRooms();
    },
    //加载当前影院所有放映厅
    loadAllCinemaRooms() {
      this.$http.MovieRoomApi.queryMovieById({
        movie_cinema_id: this.form.movie_cinema_id,
      }).then((res) => {
        console.log("加载当前影院所有放映厅", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
    //点击按钮删除放映厅
    deleteMovieCinemaRoom(id) {
      this.$confirm(
        "此操作将会永久关闭该放映厅，是否确定删除放映厅？",
        "注意",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then((res) => {
          return this.$http.MovieRoomApi.delete({ id });
        })
        .then((res) => {
          console.log("点击按钮删除放映厅", res);
          if (res.data.code == 200) {
            this.loadAllCinemaRooms();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
  mounted() {
    this.loadAllCinemaRoomTypes();
    this.loadAllCinemaRooms();
  },
};
</script>
