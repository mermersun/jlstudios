<template>
  <div class="actor-item">
    <el-avatar shape="square" fit="cover" :size="70" :src="avatar"></el-avatar>
    <div>{{ name }}</div>
    <i class="el-icon-error" @click="deleteActor"></i>
  </div>
</template>
<script>
export default {
  props: ["name", "avatar"],
  methods: {
    deleteActor() {
      this.$emit("delete");
    },
  },
};
</script>
<style lang="scss" scoped>
.actor-item {
  display: inline-block;
  margin: 20px 20px 0 0;
  text-align: center;
  position: relative;

  &:hover i {
    display: block;
  }

  i {
    position: absolute;
    top: -6px;
    right: -6px;
    font-size: 1.5em;
    display: none;
  }

  div {
    font-size: 0.9em;
  }
}
.el-avatat >>> img {
  width: 100%;
}
</style>
