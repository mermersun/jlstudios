<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>配置座位模板</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 配置座位 -->
    <el-container>
      <el-aside>
        <el-timeline>
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>编辑坐标系</span>
              </div>
              <el-form label-width="60px">
                <el-form-item label="行数">
                  <el-input
                    v-model="rows"
                    placeholder="请输入行数"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-form-item label="列数">
                  <el-input
                    v-model="cols"
                    placeholder="请输入列数"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-button
                  size="small"
                  style="width: 100%"
                  type="primary"
                  plain
                  @click="step1()"
                  >生成座位模板</el-button
                >
              </el-form>
            </el-card>
          </el-timeline-item>
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>选择座位区域（框选）</span>
              </div>
              <el-button
                size="small"
                style="width: 100%"
                type="primary"
                plain
                @click="step2()"
                >撤销选中</el-button
              >
            </el-card>
          </el-timeline-item>
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>选择座位类型</span>
              </div>
              <el-button
                size="small"
                style="width: 100%; margin: 10px 0"
                type="primary"
                plain
                @click="step3(1)"
                >普通座位</el-button
              >
              <el-button
                size="small"
                style="width: 100%; margin: 10px 0"
                type="primary"
                plain
                @click="step3(2)"
                >情侣座位</el-button
              >
              <el-button
                size="small"
                style="width: 100%; margin: 10px 0"
                type="primary"
                plain
                @click="step3(3)"
                >过道</el-button
              >
            </el-card>
          </el-timeline-item>
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>确认模板</span>
              </div>
              <el-button
                size="small"
                style="width: 100%"
                type="success"
                @click="step4()"
                >完成</el-button
              >
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-aside>
      <el-main>
        <div class="seat">
          <div><span style="background-color: #36d9"></span>未选择</div>
          <div><span style="background-color: #36d"></span>已选择</div>
          <div><span style="background-color: #e53e31"></span>普通座位</div>
          <div><span style="background-color: #edb0ba"></span>情侣座位</div>
          <div><span style="background-color: #ccc"></span>过道</div>
        </div>
        <el-divider></el-divider>
        <el-divider>电影荧屏</el-divider>
        <canvas id="canvas"></canvas>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SeatSelector from "@/libs/SeatSelector.js";
export default {
  data() {
    return {
      rows: 0,
      cols: 0,
      seatSelector: null,
      id: this.$route.params.id,
    };
  },
  methods: {
    step1() {
      let row = parseInt(this.rows);
      let col = parseInt(this.cols);
      this.seatSelector = new SeatSelector(row, col, "canvas");
      this.seatSelector.draw();
    },
    step2() {
      if (this.seatSelector) {
        this.seatSelector.seatNoSelect();
      }
    },
    step3(seatType) {
      if (this.seatSelector) {
        this.seatSelector.seatSelectToNormalSeats(seatType);
      }
    },
    step4() {
      if (this.seatSelector) {
        try {
          let seat_template = this.seatSelector.getSeatTemplateJsonString();
          let room_size = this.seatSelector.getSeatCount();
          let id = this.id;
          this.$http.MovieRoomApi.updateSeatTemplate({
            id,
            seat_template,
            room_size,
          }).then((res) => {
            console.log("更新放映厅座位模板", res);
            if (res.data.code == 200) {
              this.$message.success("更新放映厅的座位模板完成");
              this.$router.go(-1);
            }
          });
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
#canvas {
  border: 1px dashed #999;
  border-radius: 4px;
  display: none;
  margin: 10px auto;
}
.seat {
  width: 100%;
  display: flex;
  justify-content: space-evenly;

  span {
    display: inline-block;
    width: 20px;
    height: 20px;
    vertical-align: middle;
    margin: 0 8px;
    border-radius: 2px;
  }
}
</style>
