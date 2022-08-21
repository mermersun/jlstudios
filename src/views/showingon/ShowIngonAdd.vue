<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>新增排片计划</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 标题 -->
    <p>
      为
      <span style="color: #67c23a; font-weight: bold">{{
        cinemaRoomInfo.cinema_name
      }}</span
      >的
      <span style="color: #67c23a; font-weight: bold"
        >{{ cinemaRoomInfo.cinema_room_name }}
        {{ cinemaRoomInfo.cinema_room_type }}</span
      >
      添加排片计划
    </p>
    <el-divider></el-divider>
    <!-- 新增排片计划 -->
    <el-form :rules="rules" ref="form" :model="form" label-width="80px">
      <el-form-item label="选择电影" prop="movie_id">
        <el-select
          ref="movieSelector"
          style="width: 450px"
          v-model="form.movie_id"
          filterable
          remote
          reserve-keyword
          placeholder="请搜索电影"
          :remote-method="remoteMethod"
          :loading="loading"
        >
          <el-option
            v-for="item in movieList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="放映日期" prop="showingon_data">
        <el-date-picker
          v-model="form.showingon_date"
          align="right"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker
        >&nbsp;
        <el-time-select
          v-model="form.showingon_time"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
          }"
          placeholder="选择时间"
        >
        </el-time-select>
      </el-form-item>
      <el-form-item label="票价" prop="price">
        <el-input style="width: 450px" v-model="form.price"></el-input>
      </el-form-item>
      <el-form-item label="立即发布" prop="status">
        <el-switch
          v-model="form.status"
          active-color="#67C23A"
          :active-value="1"
          :inactive-value="0"
        >
        </el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">立即新增该计划</el-button>
        <el-button type="success" plain>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //表单验证
      rules: {
        cinema_id: [
          { required: true, message: "请填写电影院ID", trigger: "blur" },
        ],
        cinema_room_id: [
          { required: true, message: "请填写放映厅ID", trigger: "blur" },
        ],
        movie_id: [
          { required: true, message: "请填写电影ID", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择是否立即发布", trigger: "blur" },
        ],
        showingon_date: [
          { required: true, message: "请选择排片日期", trigger: "blur" },
        ],
        showingon_time: [
          { required: true, message: "请选择场次", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请填写价格", trigger: "blur" },
          {
            parttern: /\d+(.\d+)?/,
            message: "请填写正确的格式",
            trigger: "blur",
          },
        ],
      },
      //选择日期
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
      form: {
        cinema_id: 0,
        cinema_room_id: this.$route.params.id,
        movie_id: "",
        status: 0,
        showingon_date: "",
        showingon_time: "",
        price: 0,
      },
      cinemaRoomInfo: {}, //加载放映厅基本信息
      loading: false,
      movieList: [],
    };
  },
  methods: {
    //点击按钮,添加排片计划
    onSubmit() {
      console.log(this.form);
      this.form.cinema_id = this.cinemaRoomInfo.cinema_id;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$http.ShowingonPlanApi.add(this.form).then((res) => {
            console.log("添加排片计划", res);
            if (res.data.code == 200) {
              this.$router.go(-1);
              this.$notify({
                title: "添加排片计划成功",
                message: `${this.cinemaRoomInfo.cinema_name}的${this.cinemaRoomInfo.cinema_room_name}将会在 ${this.form.showingon_date} ${this.form.showingon_time} 放映《${this.$refs.movieSelector.selectedLabel}》`,
                type: "success",
              });
            }
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },
    //加载放映厅基本信息
    loadCurrentMovieRoom() {
      this.$http.MovieRoomApi.queryById({ id: this.form.cinema_room_id }).then(
        (res) => {
          console.log("加载放映厅基本信息", res);
          if (res.data.code == 200) {
            this.cinemaRoomInfo = res.data.data;
          }
        }
      );
    },
    //通过名称模糊查询电影
    remoteMethod(query) {
      this.$http.MovieApi.listByName({
        name: query,
        page: 1,
        pagesize: 20,
      }).then((res) => {
        console.log("通过名称模糊查询电影", res);
        if (res.data.code == 200) {
          this.movieList = res.data.data.result;
        }
      });
    },
  },
  mounted() {
    this.loadCurrentMovieRoom();
  },
};
</script>

<style lang="scss" scoped></style>
