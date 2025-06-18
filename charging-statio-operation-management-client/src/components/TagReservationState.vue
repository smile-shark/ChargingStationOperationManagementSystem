<template>
  <div style="display: inline-block">
    <el-tag v-if="state == 0" type="info">已取消</el-tag>
    <el-tag v-if="state == 1" type="success">已完成</el-tag>
    <el-tag v-if="state == 2" type="primary">已预约</el-tag>
  </div>
</template>

<script>
export default {
  props: {
    state: {
      default: 0,
    },
  },
};
</script>

<style></style>
