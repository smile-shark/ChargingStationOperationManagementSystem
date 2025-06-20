<template>
  <div>
    <div class="header">
      <h1>动态计费规则</h1>
    </div>
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="分时计价模板" name="TimeOfUsePricingTemplate">
          <TimeOfUsePricingTemplate></TimeOfUsePricingTemplate>
        </el-tab-pane>
        <el-tab-pane label="节假日费率" name="HolidayRates"
          >
           <HolidayRates></HolidayRates>
          </el-tab-pane
        >
        <!-- <el-tab-pane label="规则模拟试算" name="RuleSimulationTrialCalculation"
          ><div class="header">
            <h1>规则模拟试算</h1>
          </div></el-tab-pane
        > -->
      </el-tabs>
    </div>
  </div>
</template>

<script>
import TimeOfUsePricingTemplate from "./villing-rules-child/TimeOfUsePricingTemplate.vue";
import HolidayRates from "./villing-rules-child/HolidayRates.vue";
import RuleSimulationTrialCalculation from "./villing-rules-child/RuleSimulationTrialCalculation.vue";
export default {
  components: {
    TimeOfUsePricingTemplate,
    HolidayRates,
    RuleSimulationTrialCalculation,
  },
  data() {
    return {
      activeName: "TimeOfUsePricingTemplate",
    };
  },
  methods: {
    handleClick(tab) {
      
    }
  },
  mounted() {},
};
</script>

<style></style>