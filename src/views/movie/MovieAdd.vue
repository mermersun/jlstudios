<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增电影</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="12">
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <el-form-item label="封面图片" prop="cover">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:9000/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image
                v-if="form.cover"
                :src="form.cover"
                fit="container"
                class="avatar"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="电影类别" prop="categoryId">
            <el-radio-group v-model="form.categoryId">
              <el-radio :label="1">热映</el-radio>
              <el-radio :label="2">待映</el-radio>
              <el-radio :label="3">经典</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电影名称" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="电影类型" prop="type">
            <el-select
              v-model="form.type"
              multiple
              placeholder="请选择电影类型"
            >
              <el-option
                :label="item.typename"
                :value="item.typename"
                v-for="item in movieTypes"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电影主演" prop="starActor">
            <el-select
              v-model="form.starActor"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入演员名称"
              :remote-method="loadActorsByName"
              :loading="loadingActors"
            >
              <el-option
                v-for="item in actorList"
                :key="item.id"
                :label="item.actor_name"
                :value="item.actor_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上映时间" prop="showingon">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.showingon"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="电影评分" prop="score">
            <el-input v-model="form.score"></el-input>
          </el-form-item>
          <el-form-item label="电影时长" prop="duration">
            <el-input v-model="form.duration"></el-input>
          </el-form-item>
          <el-form-item label="电影简介" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onSubmit">立即新增</el-button>
            <el-button type="success" plain>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loadingActors: false,
      actorList: null,
      movieTypes: null,
      form: {
        categoryId: 1,
        cover: "",
        title: "",
        type: "",
        starActor: "",
        showingon: "",
        score: "",
        duration: "",
        description: "",
      },
      rules: {
        categoryId: [
          { required: true, message: "请选择电影类别", trigger: "blur" },
        ],
        cover: [{ required: true, message: "请填写电影封面", trigger: "blur" }],
        title: [{ required: true, message: "请输入电影名称", trigger: "blur" }],
        type: [{ required: true, message: "请输入电影类型", trigger: "blur" }],
        starActor: [
          { required: true, message: "请输入电影主演", trigger: "blur" },
        ],
        showingon: [
          { required: true, message: "请选择电影上映时间", trigger: "blur" },
        ],
        score: [{ required: true, message: "请输入电影评分", trigger: "blur" }],
        duration: [
          { required: true, message: "请输入电影时长", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入电影简介", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.loadAllMovieTypes();
  },
  methods: {
    loadActorsByName(query) {
      this.loadingActors = true;
      this.form.starActor = this.form.starActor.join("/");
      this.$http.ActorApi.listByName({ name: query }).then((res) => {
        console.log("通过模糊查询查找电影", res);
        this.actorList = res.data.data;
        this.loadingActors = false;
      });
    },
    loadAllMovieTypes() {
      this.$http.MovieApi.loadAllMovieTypes().then((res) => {
        console.log("查找电影类型", res);
        if (res.data.code == 200) {
          this.movieTypes = res.data.data;
        }
      });
    },
    onSubmit() {
      this.form.starActor = this.form.starActor.join("/");
      this.form.type = this.form.type.join("/");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log("填入的值", this.form);
          this.$http.MovieApi.add(this.form).then((res) => {
            console.log("添加成功返回值", res);
            if (res.data.code == 200) this.$message.success("新增电影成功！");
            this.$router.push("/home/movie-list");
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      if (res.code == 200) {
        this.form.cover = res.data;
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG/PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.el-radio__input.is-checked .el-radio__inner {
  background: #67c23a;
}
.el-radio__input.is-checked + .el-radio__label {
  color: #67c23a;
}
</style>
