<template>
  <div>
    <div class="header">
      <h1>节假日特殊费率设置</h1>
      <el-button type="primary" @click="addVillingRules"
        >新增节假日模板</el-button
      >
    </div>
    <el-row>
      <el-col :span="24" v-for="(item, index) in rules" :key="index">
        <BillingRulesMovieCard
          :rules="item"
          :remove-list="removeList"
        ></BillingRulesMovieCard>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import BillingRulesMovieCard from "@/components/BillingRulesMovieCard.vue";
import api from "@/api";
export default {
  components: {
    BillingRulesMovieCard,
  },
  data() {
    return {
      rules: [],
    };
  },
  methods: {    
    removeList(id) {
      this.rules = this.rules.filter(
        (item) => item.billingRulesId !== id
      );
    },
    addVillingRules() {
      // 1. 创建一个模板添加到list中
      let newRule = {
        billingRulesId: "",
        startDate:'2025-01-01',
        startDate:'2025-01-05',
        name: "新假日模板" + (this.rules.length + 1),
        timeRange: 9,
      };

      api.billingRules.add(newRule).then((res) => {
        if (res.data.code == 200) {
          this.rules.push(res.data.data);
          this.rules.sort((a, b) => {
            return b.order - a.order;
          });
        }
      });
    },
    getRules() {
      api.billingRules.detailList([9]).then((res) => {
        if (res.data.code == 200) {
          this.rules = res.data.data;
        }
      });
    },
  },
  mounted(){
    this.getRules()
  }
};
</script>

<style></style>
