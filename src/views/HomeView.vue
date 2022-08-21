<template>
  <div>
    <!-- 页面的主题结构 -->
    <el-container>
      <el-header class="header"
        >嘉禄影城后台管理系统
        <div class="userinfo" v-if="$store.state.user">
          欢迎
          {{ $store.state.user.nickname }}
          <span @click="logout()">&nbsp;&nbsp;&nbsp;注销</span>
        </div>
        <div class="userinfo" v-else>未登录</div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside scroll-container">
          <el-menu
            router
            unique-opened
            :default-active="$route.path"
            background-color="#333"
            text-color="#ddd"
            active-text-color="#fff"
            style="border-right: none"
          >
            <el-submenu index="actor">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span slot="title">演员管理</span>
              </template>
              <el-menu-item index="/home/actor-list">
                <i class="el-icon-menu"></i>
                <span>演员列表</span>
              </el-menu-item>
              <el-menu-item index="/home/actor-add">
                <i class="el-icon-circle-plus"></i>
                <span>新增演员</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="director">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span slot="title">导演管理</span>
              </template>
              <el-menu-item index="/home/director-list">
                <i class="el-icon-menu"></i>
                <span>导演列表</span>
              </el-menu-item>
              <el-menu-item index="/home/director-add">
                <i class="el-icon-circle-plus"></i>
                <span>新增导演</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="movie">
              <template slot="title">
                <i class="el-icon-camera-solid"></i>
                <span slot="title">电影管理</span>
              </template>
              <el-menu-item index="/home/movie-list">
                <i class="el-icon-menu"></i>
                <span>电影列表</span>
              </el-menu-item>
              <el-menu-item index="/home/movie-add">
                <i class="el-icon-circle-plus"></i>
                <span>新增电影</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="cinema">
              <template slot="title">
                <i class="el-icon-s-marketing"></i>
                <span slot="title">电影院管理</span>
              </template>
              <el-menu-item index="/home/cinema-list">
                <i class="el-icon-menu"></i>
                <span>电影院列表</span>
              </el-menu-item>
              <el-menu-item index="/home/cinema-add">
                <i class="el-icon-circle-plus"></i>
                <span>新增电影院</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.commit("clearUserState");
      this.$router.push("/user/login");
    },
  },
};
</script>
<style scoped lang="scss">
.header {
  background-color: #333;
  color: #fff;
  line-height: 60px;
  font-size: 1.3em;
}
.aside {
  background-color: #333;
  height: calc(100vh - 60px);
}
.main {
  height: calc(100vh - 60px);
}
.el-menu-item.is-active {
  font-weight: bold;
}
.userinfo {
  float: right;

  span {
    cursor: pointer;
  }
  span:hover {
    color: #999;
  }
}
</style>
