<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>导演管理</el-breadcrumb-item>
      <el-breadcrumb-item>导演列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input
          v-model="searchForm.directorName"
          placeholder="请输入导演姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表页面 -->
    <el-divider content-position="left">导演列表</el-divider>
    <person-item
      v-for="item in directorList"
      :key="item.id"
      :name="item.director_name"
      :avatar="item.director_avatar"
      @delete="onDelete(item.id)"
    />
  </div>
</template>

<script>
import PersonItem from "@/components/PersonItem.vue";
export default {
  components: { PersonItem },
  data() {
    return {
      directorList: null,
      searchForm: {
        directorName: "",
      },
    };
  },
  mounted() {
    this.loadDirectorList();
  },
  methods: {
    onDelete(id) {
      this.$http.DirectorApi.delete({ id }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功!");
          this.loadDirectorList();
        }
      });
    },
    onSearch() {
      if (!this.searchForm.directorName.trim()) {
        this.loadDirectorList();
        return;
      }
      this.$http.DirectorApi.listByName({
        name: this.searchForm.directorName,
      }).then((res) => {
        if (res.data.code == 200) {
          this.directorList = res.data.data;
        }
      });
    },
    loadDirectorList() {
      this.$http.DirectorApi.list({ page: 1, pagesize: 100 }).then((res) => {
        if (res.data.code == 200) {
          this.directorList = res.data.data;
        }
      });
    },
  },
};
</script>
