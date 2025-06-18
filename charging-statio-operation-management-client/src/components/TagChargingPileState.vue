<template>
  <div style="display: inline-block">
    <el-tag v-if="state == 0" type="primary">充电中</el-tag>
    <el-tag v-if="state == 1" type="success">空闲</el-tag>
    <el-tag v-if="state == 2" type="info">离线</el-tag>
    <el-tag v-if="state == 3" type="danger">故障</el-tag>
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
