<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>修改电影院信息</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 新增电影院表单 -->
    <el-row>
      <el-col :span="12">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
          <el-form-item label="电影院名称" prop="cinema_name">
            <el-input v-model="form.cinema_name"></el-input>
          </el-form-item>
          <el-form-item label="选择位置" prop="address">
            <el-button type="success" plain @click="AdressVisible"
              >点击此处选择修改位置</el-button
            >
            <el-dialog
              width="90%"
              title="请点击地图选择位置"
              :visible.sync="dialogAdressVisible"
              :before-close="handleClose"
            >
              <div
                id="mapContainer"
                style="width: 100%; height: 400px; border: 1px solid #ccc"
              ></div>
              <span slot="footer" class="dialog-footer">
                <el-button type="success" @click="dialogAdressAdd"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-input v-model="form.province"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city"></el-input>
          </el-form-item>
          <el-form-item label="地区" prop="district">
            <el-input v-model="form.district"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="form.longitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="form.latitude"></el-input>
          </el-form-item>
          <el-form-item label="选择标签" prop="tags">
            <el-select
              v-model="form.tags"
              multiple
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in cinemaTags"
                :key="item.id"
                :label="item.tagname"
                :value="item.tagname"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onSubmit">立即更新</el-button>
            <el-button type="success" plain>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  data() {
    return {
      lnglat: null,
      mapInCinema: null,
      dialogAdressVisible: false,
      cinemaTags: [],
      form: {
        id: this.$route.params.id,
        cinema_name: "",
        address: "",
        province: "",
        city: "",
        district: "",
        longitude: "",
        latitude: "",
        tags: "",
      },
      rules: {
        cinema_name: [
          { required: true, message: "请填写电影院名称", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        province: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        city: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        district: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        longitude: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        latitude: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        tags: [
          { required: true, message: "请选择该影支持的标签", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    //初始化当前影院信息
    this.loadCinemaById();
    //初始化所有影院标签
    this.loadAllCinemaTags();
  },
  methods: {
    //加载当前影院信息,回填表单
    loadCinemaById() {
      this.$http.CinemaApi.queryById({ id: this.form.id }).then((res) => {
        console.log("加载当前影院信息", res);
        if (res.data.code == 200) {
          this.form = res.data.data;
          this.form.tags = this.form.tags.split(",");
        }
      });
    },
    //点击错误关闭弹窗
    handleClose(done) {
      done();
      this.form.address = "";
      this.form.province = "";
      this.form.city = "";
      this.form.district = "";
      this.form.longitude = "";
      this.form.latitude = "";
    },
    //弹出选择位置框
    AdressVisible() {
      this.dialogAdressVisible = true;
      this.initMap();
    },
    //点击确定上传位置信息
    dialogAdressAdd() {
      this.dialogAdressVisible = false;
      console.log("点击确定后数据", this.mapInCinema);
      console.log("经纬度", this.lnglat);
      //点击确定后渲染页面
      this.form.address = this.mapInCinema.formattedAddress;
      this.form.province = this.mapInCinema.addressComponent.province;
      this.form.city = this.mapInCinema.addressComponent.city;
      this.form.district = this.mapInCinema.addressComponent.district;
      this.form.longitude = this.lnglat.KL;
      this.form.latitude = this.lnglat.kT;
    },
    //显示地图并且返回所需数据
    initMap() {
      AMapLoader.load({
        key: "a506ee23cd661ec14ddf39ee524f3c64", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          let map = new AMap.Map("mapContainer", {
            zoom: 11, //级别
            center: [116.397428, 39.90923], //中心点坐标
            viewMode: "3D", //使用3D视图
          });
          let marker = null;
          map.on("click", (e) => {
            this.lnglat = e.lnglat;
            console.log("选中的经纬度坐标位置", this.lnglat);
            if (marker != null) {
              map.remove(marker);
            }
            marker = new AMap.Marker({
              position: new AMap.LngLat(this.lnglat.lng, this.lnglat.lat),
            });
            map.add(marker);
            //通过经纬度，访问逆地址编码接口，获取该经纬度的字符串位置描述
            var geocoder = new AMap.Geocoder();
            geocoder.getAddress(
              [this.lnglat.KL, this.lnglat.kT],
              (status, result) => {
                console.log(status, result);
                if (status == "complete") {
                  this.mapInCinema = result.regeocode;
                } else {
                  this.$message.error("地图数据加载失败，请重试！");
                }
              }
            );
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    //初始化所有影院标签
    loadAllCinemaTags() {
      this.$http.CinemaApi.queryAllTags().then((res) => {
        console.log("初始化所有影院标签", res);
        if (res.data.code == 200) {
          this.cinemaTags = res.data.data;
        }
      });
    },
    //点击新增提交表单
    onSubmit() {
      //将tags转成字符串
      this.form.tags = this.form.tags.toString();
      //新增电影院
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log("填入的值", this.form);
          this.$http.CinemaApi.update(this.form).then((res) => {
            console.log("添加成功返回值", res);
            if (res.data.code == 200) this.$message.success("修改成功！");
            this.$router.push("/home/cinema-list");
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },
  },
};
</script>
