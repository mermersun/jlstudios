<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>演员管理</el-breadcrumb-item>
      <el-breadcrumb-item>演员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input
          v-model="searchForm.actorName"
          placeholder="请输入演员姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表页面 -->
    <el-divider content-position="left">演员列表</el-divider>
    <person-item
      v-for="item in actorList"
      :key="item.id"
      :name="item.actor_name"
      :avatar="item.actor_avatar"
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
      actorList: null,
      searchForm: {
        actorName: "",
      },
    };
  },
  mounted() {
    this.loadActorList();
  },
  methods: {
    onDelete(id) {
      this.$http.ActorApi.delete({ id }).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          this.$message.success("删除成功!");
          this.loadActorList();
        }
      });
    },
    onSearch() {
      if (!this.searchForm.actorName.trim()) {
        this.loadActorList();
        return;
      }
      this.$http.ActorApi.listByName({ name: this.searchForm.actorName }).then(
        (res) => {
          if (res.data.code == 200) {
            this.actorList = res.data.data;
          }
        }
      );
    },
    loadActorList() {
      this.$http.ActorApi.list({ page: 1, pagesize: 100 }).then((res) => {
        if (res.data.code == 200) {
          this.actorList = res.data.data;
        }
      });
    },
  },
};
</script>
