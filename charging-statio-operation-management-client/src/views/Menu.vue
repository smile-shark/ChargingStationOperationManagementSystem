<template>
  <div>
    <el-container style="height: 100vh">
      <el-aside>
        <div class="g-pd-10">
          <h3 class="font-bold text-2xl">充电站运营系统</h3>
          <el-divider class="test-g-bg-color"></el-divider>
        </div>
        <el-menu router v-model="$route.path" :default-active="$route.path">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/realTimeMonitoring">实时监控</el-menu-item>
          <el-submenu index="2">
            <template slot="title"> 站桩管理 </template>
            <el-menu-item
              index="/stationaryPostureManagement/ChargingStationManagement"
              >充电站管理</el-menu-item
            >
            <el-menu-item
              index="/stationaryPostureManagement/ChargingPileManagement"
              >充电桩管理</el-menu-item
            >
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"> 运营管理 </template>
            <el-menu-item index="/operationManagement/AppointmentManagement"
              >预约管理</el-menu-item
            >
            <el-menu-item index="/operationManagement/CarManagement"
              >车辆管理</el-menu-item
            >
            <el-menu-item index="/operationManagement/ChargingCardManagement"
              >充电卡管理</el-menu-item
            >
            <el-menu-item index="/operationManagement/CustomerManagement"
              >客户管理</el-menu-item
            >
            <el-menu-item index="/operationManagement/VillingRules"
              >计费规则</el-menu-item
            >
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"> 订单管理 </template>
            <el-menu-item index="/orderManagement/ChargingRecord"
              >充电记录</el-menu-item
            >
            <el-menu-item index="/orderManagement/RechargeRecord"
              >充值记录</el-menu-item
            >
            <el-menu-item index="/orderManagement/TransationFlow"
              >交易流水</el-menu-item
            >
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"> 报警管理 </template>
            <el-menu-item index="/alarmManagement/AlarmMessage"
              >报警消息</el-menu-item
            >
            <el-menu-item index="/alarmManagement/AlarmSetting"
              >报警设置</el-menu-item
            >
          </el-submenu>
          <el-submenu index="6">
            <template slot="title"> 运维管理 </template>
            <el-menu-item
              index="/operationMaintenanceManagement/OperationMainTenancePersonnel"
              >运维人员</el-menu-item
            >
            <el-menu-item index="/operationMaintenanceManagement/TaskManagement"
              >任务管理</el-menu-item
            >
          </el-submenu>
          <el-submenu index="7">
            <template slot="title"> 分析报表 </template>
            <!-- <el-menu-item index="/analysisReports/FaultAnalysis"
              >故障分析</el-menu-item
            > -->
            <el-menu-item index="/analysisReports/OperaionAnalysis"
              >运营分析</el-menu-item
            >
            <!-- <el-menu-item index="/analysisReports/FinancialStateMents"
              >财务报表</el-menu-item
            >
            <el-menu-item index="/analysisReports/EnergyConsumptionReport"
              >耗能报表</el-menu-item
            > -->
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <!-- 头部  -->
          <el-link class="el-icon-setting" style="padding:10px" @click="$router.push('/login')">退出</el-link>
        </el-header>

        <el-main style="padding:0">
          <router-view> </router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
@import "@/css/global.scss";
.el-header {
  background-color: $test-g-bg-color;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
}
</style>
