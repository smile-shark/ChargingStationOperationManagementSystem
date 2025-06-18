<template>
  <div>
    <div class="header">
      <h1>充电卡管理</h1>
      <el-button type="primary" @click="addChargingCard">新增充电卡</el-button>
    </div>
    <el-row>
      <el-col :span="24"> 
        
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="mt-2">
        <el-pagination
          @current-change="getCars"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
    };
  },
  methods: {
    addChargingCard() {},
  },
};
</script>

<style></style>
