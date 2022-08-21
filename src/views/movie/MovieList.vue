<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 搜索表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="电影名称">
        <el-input
          v-model="searchForm.movieName"
          placeholder="请输入电影名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <!-- 列表页面 -->
    <el-divider content-position="left">电影列表</el-divider>
    <div v-if="tableData">
      <el-table :data="tableData.result" stripe style="width: 100%">
        <el-table-column align="center" prop="cover" label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 40px; height: 60px"
              :src="scope.row.cover"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="主题">
        </el-table-column>
        <el-table-column align="center" prop="type" label="类型">
        </el-table-column>
        <el-table-column align="center" prop="star_actor" label="主演">
        </el-table-column>
        <el-table-column align="center" prop="showingon" label="上映时间">
        </el-table-column>
        <el-table-column align="center" prop="score" label="评分">
        </el-table-column>
        <el-table-column align="center" prop="description" label="电影简介">
        </el-table-column>
        <el-table-column align="center" prop="duration" label="电影时长">
          <template slot-scope="scope">{{ scope.row.duration }} 分钟</template>
        </el-table-column>
        <el-table-column align="center" prop="category_id" label="所属类别">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.category_id == 2">待映</el-tag>
            <el-tag v-if="scope.row.category_id == 3" type="success"
              >经典</el-tag
            >
            <el-tag v-if="scope.row.category_id == 1" type="danger"
              >热映</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="240">
          <template slot-scope="scope">
            <el-button
              title="配置演员列表"
              @click="showEditActorsDialog(scope.row.id)"
              type="info"
              icon="el-icon-user-solid"
              circle
            ></el-button>
            <el-button
              title="配置剧照列表"
              type="warning"
              icon="el-icon-picture"
              circle
              @click="showEditThumbDialog(scope.row.id)"
            ></el-button>
            <el-button
              title="修改演员信息"
              type="success"
              icon="el-icon-edit"
              circle
              @click="$router.push(`/home/movie-update/${scope.row.id}`)"
            ></el-button>
            <el-button
              title="删除电影"
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteMovie(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @current-change="handleCurrentChange"
        style="margin: 20px 0; text-align: right"
        layout="prev, pager, next"
        :total="tableData.total"
        :page-size="tableData.pagesize"
      >
      </el-pagination>
    </div>
    <!-- 配置剧照弹窗 -->
    <el-dialog title="配置电影剧照" :visible.sync="dialogThumbVisible">
      <el-upload
        multiple
        list-type="picture"
        class="upload-demo"
        ref="upload"
        action="http://localhost:9000/upload"
        :on-success="handleSuccess"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          @click="$router.push('/home/thumb-list/' + currentSelectedId)"
          >管理剧照图片</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>
    <!-- 配置演员列表弹窗 -->
    <el-dialog title="配置演员列表" :visible.sync="dialogEditActorsVisible">
      <el-transfer
        style="text-align: center"
        v-model="transferValue"
        :data="transferData"
        :titles="['未选择', '已选择']"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitActors">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除电影弹窗 -->
    <el-button type="text"></el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transferData: [], //原始数据
      transferValue: [], //选中项数据
      dialogEditActorsVisible: false, //演员弹窗默认不显示
      currentSelectedId: 0,
      fileList: [],
      dialogThumbVisible: false, //剧照弹窗默认不显示
      searchForm: {
        movieName: "",
      },
      tableData: null,
    };
  },
  mounted() {
    this.loadMovieList();
    this.loadAllActors();
  },
  methods: {
    //删除电影弹窗
    deleteMovie(id) {
      this.$confirm("此操作将永久删除该电影, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return this.$http.MovieApi.delete({ id });
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.loadMovieList();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    //在弹窗里显示所有的演员
    loadAllActors() {
      this.$http.ActorApi.list({ page: 1, pagesize: 10000 }).then((res) => {
        console.log("弹窗里加载所有演员", res);
        //将res.data.data中所有数据保存到 this.transferData
        //this.transferData 需要数据结构：[{key:1,label:'},...]
        //res.data.data现有数据 [{演员1},{演员2},{演员3},...]
        if (res.data.code == 200) {
          let mdata = [];
          res.data.data.forEach((item) => {
            mdata.push({
              key: item.id,
              label: item.actor_name,
            });
          });
          this.transferData = mdata;
        }
      });
    },
    //点击确定后拿到的穿梭框数据
    submitActors() {
      console.log("穿梭框选中项的数据,是演员的id", this.transferValue);
      let movie_id = this.currentSelectedId;
      let actor_ids = this.transferValue.toString();
      this.$http.MovieApi.bindActors({ movie_id, actor_ids }).then((res) => {
        console.log("为电影绑定演员列表", res);
        if (res.data.code == 200) {
          this.$message.success("演员列表绑定成功");
          this.dialogEditActorsVisible = false;
        }
      });
    },
    //获取当前电影下所有的演员
    showEditActorsDialog(movie_id) {
      this.dialogEditActorsVisible = true;
      this.currentSelectedId = movie_id;
      this.$http.ActorApi.listByMovieId({ movie_id }).then((res) => {
        console.log("获取当前电影下所有的演员", res);
        if (res.data.code == 200) {
          this.transferValue = [];
          res.data.data.forEach((item) => {
            this.transferValue.push(item.actor_id);
          });
        }
      });
    },
    handleSuccess(res) {
      console.log("上传图片", res);
      let url = res.data;
      let movie_id = this.currentSelectedId;
      this.$http.MovieThumbApi.add({ url, movie_id }).then((res) => {
        console.log("上传剧照成功", res);
      });
    },
    showEditThumbDialog(id) {
      this.dialogThumbVisible = true;
      this.currentSelectedId = id;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },

    //点击分页
    handleCurrentChange(val) {
      let name = this.searchForm.movieName.trim();
      if (!name) {
        this.$http.MovieApi.list({ page: val, pagesize: 2 }).then((res) => {
          console.log("查询所有电影", res);
          this.tableData = res.data.data;
        });
      } else {
        console.log(`当前页: ${val}`);
        this.$http.MovieApi.listByName({ name, page: val, pagesize: 2 }).then(
          (res) => {
            console.log("通过电影名称模糊查询电影", res);
            if (res.data.code == 200) {
              this.tableData = res.data.data;
            }
          }
        );
      }
    },

    //通过电影名称模糊查询电影
    onSearch() {
      let name = this.searchForm.movieName.trim();
      if (!name) {
        this.loadMovieList();
      } else {
        this.$http.MovieApi.listByName({ name, page: 1, pagesize: 2 }).then(
          (res) => {
            console.log("通过电影名称模糊查询电影", res);
            if (res.data.code == 200) {
              this.tableData = res.data.data;
            }
          }
        );
      }
    },

    loadMovieList() {
      this.$http.MovieApi.list({ page: 1, pagesize: 2 }).then((res) => {
        console.log("查询所有电影", res);
        this.tableData = res.data.data;
      });
    },
  },
};
</script>
<style>
.el-transfer-panel {
  text-align: left;
}
li:not(.disabled).active {
  background-color: #67c23a !important;
}
.el-pager li:not(.active):hover {
  color: #67c23a !important;
}
</style>
