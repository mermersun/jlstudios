<template>
  <div>
    <div class="back">
      <el-form ref="form" :model="form" :rules="rules">
        <p class="title">欢迎登录</p>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="form.username"
            placeholder="请输入管理员账号"
          ></el-input>
        </el-form-item>
        <el-form-item prop="userpwd">
          <el-input
            type="password"
            v-model="form.userpwd"
            placeholder="请输入管理员密码"
          ></el-input>
        </el-form-item>
        <el-button type="success" style="width: 100%" @click="onSubmit()"
          >点击登录</el-button
        >
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        userpwd: "",
      },
      rules: {
        username: [
          { required: true, message: "请填写账号", trigger: "blur" },
          {
            pattern: /^\w{3,15}$/,
            message: "3~15位字符，包含：数字、字母、下划线",
            trigger: blur,
          },
        ],
        userpwd: [
          { required: true, message: "请填写密码", trigger: "blur" },
          {
            pattern: /^\w{6,15}$/,
            message: "6~15位字符，包含：数字、字母、下划线",
            trigger: blur,
          },
        ],
      },
    };
  },
  methods: {
    //点击登录提交表单
    onSubmit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$http.AdminApi.login(this.form).then((res) => {
            console.log("点击登录提交表单", res);
            if (res.data.code == 200) {
              this.$store.commit("saveUserState", res.data.data);
              this.$router.push("/");
            } else if (res.data.code == 1001) {
              this.$message.error("账号密码输入错误，请重新输入");
              this.form.username = "";
              this.form.userpwd = "";
            }
          });
        } else {
          this.$message.warning("表单填写错误！");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.back {
  height: 100vh;
  background-image: linear-gradient(125deg, #000, #555159, #514b5f, #000);
  background-size: 500%;
  animation: animate 15s infinite;

  .el-form {
    width: 25%;
    position: absolute;
    top: 30%;
    left: 37.5%;
  }

  .title {
    font-size: 1.8em;
    color: white;
    text-align: center;
    margin-bottom: 10px;
  }
}
@keyframes animate {
  0% {
    background-position: 0%, 50%;
  }
  50% {
    background-position: 100%, 50%;
  }
  100% {
    background-position: 0%, 50%;
  }
}
</style>
