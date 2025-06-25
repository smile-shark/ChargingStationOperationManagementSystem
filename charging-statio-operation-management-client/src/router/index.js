import Menu from "@/views/Menu.vue";
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/home/Home.vue";
import RealTimeMonitoring from "@/views/real-time-monitoring/RealTimeMonitoring.vue";
import ChargingStationManagement from "@/views/station-pile-management/ChargingStationManagement.vue";
import ChargingPileManagement from "@/views/station-pile-management/ChargingPileManagement.vue";

import AppointmentManagement from "@/views/operation-management/AppointmentManagement.vue";
import CarManagement from "@/views/operation-management/CarManagement.vue";
import ChargingCardManagement from "@/views/operation-management/ChargingCardManagement.vue";
import CustomerManagement from "@/views/operation-management/CustomerManagement.vue";
import VillingRules from "@/views/operation-management/VillingRules.vue";

import ChargingRecord from "@/views/order-management/ChargingRecord.vue";
import RechargeRecord from "@/views/order-management/RechargeRecord.vue";
import TransationFlow from "@/views/order-management/TransationFlow.vue";

import AlarmMessage from "@/views/alarm-management/AlarmMessage.vue";
import AlarmSetting from "@/views/alarm-management/AlarmSetting.vue";

import OperationMainTenancePersonnel from "@/views/operation-maintenance-management/OperationMainTenancePersonnel.vue";
import TaskManagement from "@/views/operation-maintenance-management/TaskManagement.vue";

import EnergyConsumptionReport from "@/views/analysis-reports/EnergyConsumptionReport.vue";
import FaultAnalysis from "@/views/analysis-reports/FaultAnalysis.vue";
import FinancialStateMents from "@/views/analysis-reports/FinancialStateMents.vue";
import OperaionAnalysis from "@/views/analysis-reports/OperaionAnalysis.vue";

import Middle from "@/views/Middle.vue";
import Login from "@/views/Login.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Menu",
    component: Menu,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
      },
      {
        path: "realTimeMonitoring",
        name: "RealTimeMonitoring",
        component: RealTimeMonitoring,
      },
      {
        path: "stationaryPostureManagement",
        name: "Middle",
        component: Middle,
        children: [
          {
            path: "ChargingStationManagement",
            name: "ChargingStationManagement",
            component: ChargingStationManagement,
          },
          {
            path: "ChargingPileManagement",
            name: "ChargingPileManagement",
            component: ChargingPileManagement,
          },
        ],
      },
      {
        path: "operationManagement",
        name: "Middle",
        component: Middle,
        children: [
          {
            path: "AppointmentManagement",
            name: "AppointmentManagement",
            component: AppointmentManagement,
          },
          {
            path: "CarManagement",
            name: "CarManagement",
            component: CarManagement,
          },
          {
            path: "ChargingCardManagement",
            name: "ChargingCardManagement",
            component: ChargingCardManagement,
          },
          {
            path: "CustomerManagement",
            name: "CustomerManagement",
            component: CustomerManagement,
          },
          {
            path: "VillingRules",
            name: "VillingRules",
            component: VillingRules,
          },
        ],
      },
      {
        path: "orderManagement",
        name: "Middle",
        component: Middle,
        children: [
          {
            path: "ChargingRecord",
            name: "ChargingRecord",
            component: ChargingRecord,
          },
          {
            path: "RechargeRecord",
            name: "RechargeRecord",
            component: RechargeRecord,
          },
          {
            path: "TransationFlow",
            name: "TransationFlow",
            component: TransationFlow,
          },
        ],
      },
      {
        path: "alarmManagement",
        name: "Middle",
        component: Middle,
        children: [
          {
            path: "AlarmMessage",
            name: "AlarmMessage",
            component: AlarmMessage,
          },
          {
            path: "AlarmSetting",
            name: "AlarmSetting",
            component: AlarmSetting,
          },
        ],
      },
      {
        path: "operationMaintenanceManagement",
        name: "Middle",
        component: Middle,
        children: [
          {
            path: "OperationMainTenancePersonnel",
            name: "OperationMainTenancePersonnel",
            component: OperationMainTenancePersonnel,
          },
          {
            path: "TaskManagement",
            name: "TaskManagement",
            component: TaskManagement,
          },
        ],
      },
      {
        path: "analysisReports",
        name: "Middle",
        component: Middle,
        children: [
          {
            path: "EnergyConsumptionReport",
            name: "EnergyConsumptionReport",
            component: EnergyConsumptionReport,
          },
          {
            path: "FaultAnalysis",
            name: "FaultAnalysis",
            component: FaultAnalysis,
          },
          {
            path: "FinancialStateMents",
            name: "FinancialStateMents",
            component: FinancialStateMents,
          },
          {
            path: "OperaionAnalysis",
            name: "OperaionAnalysis",
            component: OperaionAnalysis,
          },
        ],
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
