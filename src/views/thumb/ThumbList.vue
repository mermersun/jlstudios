<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
      <el-breadcrumb-item>剧照列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 列表页面 -->
    <el-divider content-position="left">剧照列表</el-divider>
    <div v-if="thumbList">
      <div v-for="item in thumbList" :key="item.id" class="thumb-item">
        <el-image
          style="
            width: 160px;
            height: 120px;
            box-shadow: #0003 5px 5px 5px 0px;
            margin: 8px 15px;
          "
          :src="item.url"
          fit="cover"
        ></el-image>
        <i class="el-icon-error" @click="deleteThumb(item.id)"></i>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      movie_id: this.$route.params.movie_id,
      thumbList: null,
    };
  },
  methods: {
    deleteThumb(id) {
      this.$http.MovieThumbApi.delete({ id }).then((res) => {
        console.log("删除剧照", res);
        if (res.data.code == 200) {
          this.loadThumbsByMovieId();
        }
      });
    },
    loadThumbsByMovieId() {
      this.$http.MovieThumbApi.listByMovieId({ movie_id: this.movie_id }).then(
        (res) => {
          console.log("通过电影ID，查询剧照列表", res);
          this.thumbList = res.data.data;
        }
      );
    },
  },
  mounted() {
    this.loadThumbsByMovieId();
  },
};
</script>
<style scoped lang="scss">
.thumb-item {
  display: inline-block;
  position: relative;

  i {
    position: absolute;
    right: 4px;
    top: 0;
    font-size: 1.5em;
    display: none;
  }
  &:hover i {
    display: block;
  }
}
</style>
