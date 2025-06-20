<template>
  <div>
    <el-tag v-if="level == 0" color="#A0A0A0"> VIP1 </el-tag>
    <el-tag v-if="level == 1" color="#C0C0C0"> VIP2 </el-tag>
    <el-tag v-if="level == 2" color="#FFD700"> VIP3 </el-tag>
    <el-tag v-if="level == 3" color="#E5E4E2"> VIP4 </el-tag>
    <el-tag v-if="level == 4" color="#00BFFF"> VIP5 </el-tag>
    <el-tag v-if="level == 5" color="#FF4500"> VIP6 </el-tag>
  </div>
</template>

<script>
export default {
  props: {
    level: {
      default: 0,
    },
  },
};
</script>

<style scope>
.el-tag{
    color:black;
}
</style>
