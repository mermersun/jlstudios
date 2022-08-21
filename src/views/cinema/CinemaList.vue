<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 地图 -->
    <div
      id="cinemaListMapContainer"
      style="height: 250px; width: 100%; border: 1px solid #ccc"
    ></div>

    <!-- 列表页面 -->
    <el-divider content-position="left">电影院列表</el-divider>
    <!-- 表单 -->
    <el-table :data="tableData" style="width: 100%" height="380">
      <el-table-column prop="cinema_name" label="影院名称" width="240" sortable>
      </el-table-column>
      <el-table-column prop="address" label="影院地址"> </el-table-column>
      <el-table-column
        label="影院位置"
        width="220"
        align="center"
        sortable
        :sort-method="sortByLocation"
      >
        <template slot-scope="scope"
          >{{ scope.row.city }} {{ scope.row.district }}</template
        >
      </el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            @click="showLocation(scope.row.latitude, scope.row.longitude)"
            title="查看位置"
            type="primary"
            icon="el-icon-location-information"
            circle
          ></el-button>
          <el-button
            title="查看影院放映厅列表"
            @click="$router.push(`/home/cinema-room-list/${scope.row.id}`)"
            type="success"
            icon="el-icon-s-unfold"
            circle
          ></el-button>
          <el-button
            title="修改电影院信息"
            type="warning"
            icon="el-icon-edit"
            circle
            @click="$router.push(`/home/cinema-update/${scope.row.id}`)"
          ></el-button>
          <el-button
            title="删除电影院"
            type="danger"
            icon="el-icon-delete"
            circle
            @click="showDeleteDialog(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  data() {
    return {
      map: null,
      tableData: [],
    };
  },
  mounted() {
    this.loadAllCinemas();
    this.initMap();
  },
  methods: {
    //弹出删除对话框
    showDeleteDialog(id) {
      this.$confirm(
        "此操作将会永久关闭该影院，已有影片排期将作废，是否确定删除影院？",
        "注意",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then((res) => {
          return this.$http.CinemaApi.delete({ id });
        })
        .then((res) => {
          console.log("删除影院", res);
          if (res.data.code == 200) {
            this.loadAllCinemas();
            this.$message.success("删除成功");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    //点击位置按钮设置地图中心点放大
    showLocation(lng, lat) {
      if (this.map != null) {
        console.log(lng, lat);
        this.map.setCenter([lat, lng], false, 1000);
        this.map.setZoom(18, false, 1000);
      }
    },
    //显示地图
    initMap() {
      AMapLoader.load({
        key: "a506ee23cd661ec14ddf39ee524f3c64", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("cinemaListMapContainer", {
            zoom: 11, //级别
            center: [116.397428, 39.90923], //中心点坐标
            viewMode: "3D", //使用3D视图
          });
          this.tableData.forEach((item) => {
            let lat = item.latitude;
            let lng = item.longitude;
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
            });
            this.map.add(marker);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //电影院位置排序
    sortByLocation(a, b) {
      let astr = a.city + a.district;
      let bstr = b.city + b.district;
      return astr > bstr;
    },
    //查询所有电影院信息
    loadAllCinemas() {
      this.$http.CinemaApi.list().then((res) => {
        console.log("查询所有电影院信息", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
  },
};
</script>
