<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  text-decoration: none;
}
.scroll-container::-webkit-scrollbar {
  width: 8px;
}
.scroll-container::-webkit-scrollbar-track {
  background: #efefef;
  width: 8px;
}
.scroll-container::-webkit-scrollbar-thumb {
  background: #bfbfbf;
  border-radius: 3px;
  width: 8px;
}
</style>
