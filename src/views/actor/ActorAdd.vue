<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>演员管理</el-breadcrumb-item>
      <el-breadcrumb-item>演员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 新增演员 -->
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="演员姓名">
        <el-input style="width: 300px" v-model="form.actorName"></el-input>
      </el-form-item>
      <el-form-item label="演员头像">
        <el-upload
          class="avatar-uploader"
          action="http://localhost:9000/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <el-image
            v-if="form.actorAvatar"
            :src="form.actorAvatar"
            fit="container"
            class="avatar"
          />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit">立即新增</el-button>
        <el-button type="success" plain>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        actorName: "",
        actorAvatar: "",
      },
    };
  },
  methods: {
    onSubmit() {
      this.$http.ActorApi.add(this.form).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("头像添加成功!");
          this.$router.push("/home/actor-list");
        }
      });
    },
    handleAvatarSuccess(res, file) {
      console.log(res);
      if (res.code == 200) {
        this.form.actorAvatar = res.data;
      }
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
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
</style>
