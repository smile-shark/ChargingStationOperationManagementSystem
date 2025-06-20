<template>
  <div class="bg-white rounded p-4">
    <!-- 标题及操作按钮 -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-lg font-bold" v-if="!isEditingTitle">{{ rules.name }}</h2>
      <el-input
        ref="titleInput"
        type="text"
        v-model="rules.name"
        v-else
        @blur="handlerBlur"
      ></el-input>
      <div>
        <el-button
          icon="el-icon-edit"
          type="primary"
          size="mini"
          @click="handleEditTitle"
          v-if="!isEditingTitle"
        >
        </el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          size="mini"
          class="ml-2"
          @click="handleDelete"
        >
        </el-button>
      </div>
    </div>
    <div
      v-if="rules.startDate && rules.endDate"
      class="text-gray-500 text-sm flex justify-between items-center"
    >
      <div v-if="!isEditingDate">
        {{ rules.startDate }} 至 {{ rules.endDate }}
      </div>
      <div v-else>
        <el-date-picker
          type="date"
          placeholder="选择开始日期"
          v-model="rules.startDate"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
        至
        <el-date-picker
          type="date"
          placeholder="选择结束日期"
          v-model="rules.endDate"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </div>
      <div>
        <el-button
          icon="el-icon-check"
          type="success"
          size="mini"
          @click="handleEditDate"
          v-if="isEditingDate"
        >
        </el-button>
        <el-button
          icon="el-icon-edit"
          type="primary"
          size="mini"
          @click="isEditingDate = true"
          v-else
        ></el-button>
        <el-button
          icon="el-icon-delete"
          type="danger"
          size="mini"
          class="ml-2"
          @click="handleDelete"
        >
        </el-button>
      </div>
    </div>

    <div class="p-1">
      <el-select
        v-if="rules.timeRange != 9"
        v-model="rules.timeRange"
        style="width: 100%"
        @change="updateBillingRules"
      >
        <el-option label="工作日" :value="0"></el-option>
        <el-option label="星期一" :value="1"></el-option>
        <el-option label="星期二" :value="2"></el-option>
        <el-option label="星期三" :value="3"></el-option>
        <el-option label="星期四" :value="4"></el-option>
        <el-option label="星期五" :value="5"></el-option>
        <el-option label="星期六" :value="6"></el-option>
        <el-option label="星期日" :value="7"></el-option>
        <el-option label="周末" :value="8"></el-option>
      </el-select>
    </div>
    <!-- 折线图区域 -->
    <div class="mb-4" style="height: 200px">
      <canvas :id="`chart-${_uid}`" class="w-full h-48"></canvas>
    </div>

    <!-- 时段规则列表 -->
    <div>
      <div
        v-for="(item, index) in rules.billingRulesDetails"
        :key="index"
        class="flex items-center justify-between pb-1 pt-1 border-b"
      >
        <div class="flex-1 text-xs">
          <template>
            {{ item.startTime }}-{{ item.endTime }}：¥{{ item.price }}/kWh
          </template>
        </div>
        <div>
          <el-button
            icon="el-icon-edit"
            type="primary"
            size="mini"
            @click="handleEditItem(item)"
          >
          </el-button>

          <el-button
            icon="el-icon-delete"
            type="danger"
            size="mini"
            class="ml-1"
            @click="handleDeleteItem(index)"
          >
          </el-button>
        </div>
      </div>
      <el-button
        type="primary"
        size="mini"
        class="mt-2"
        @click="addRule"
        style="width: 100%"
      >
        添加规则
      </el-button>
    </div>

    <!-- 规则编译 -->
    <el-dialog
      :close-on-click-modal="false"
      v-if="dialogInfo.time"
      title="规则编辑"
      :visible.sync="dialogInfo.visible"
      width="20%"
      @close="updateBillingRules"
    >
      <el-form>
        <el-form-item label="开始时间" required>
          <el-time-select
            v-model="dialogInfo.time.startTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30',
            }"
            class="mr-2"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="结束时间" required>
          <el-time-select
            v-model="dialogInfo.time.endTime"
            :picker-options="{
              start: '00:00',
              step: '00:30',
              end: '23:30',
            }"
            class="mr-2"
          ></el-time-select>
        </el-form-item>
        <el-form-item label="价格(￥?/kWh)" required>
          <el-input v-model="dialogInfo.time.price"></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import api from "@/api";

export default {
  props: {
    rules: {
      default: {
        name: "default",
        billingRulesDetails: [],
      },
    },
    removeList: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      dialogInfo: {
        visible: false,
        time: null,
      },
      isEditingTitle: false,
      isEditingDate: false,
      chartInstance: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.renderChart();
    });
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
  watch: {
    "rules.billingRulesDetails": {
      handler() {
        this.$nextTick(() => {
          this.updateChart();
        });
      },
      deep: true,
    },
  },
  methods: {
    handleEditDate() {
      this.isEditingDate = false;
      this.updateBillingRules();
    },
    handleDeleteItem(index) {
      this.rules.billingRulesDetails.splice(index, 1);
      this.updateBillingRules();
    },
    handlerBlur() {
      this.isEditingTitle = false;
      this.updateBillingRules();
    },
    updateBillingRules() {
      api.billingRules.update(this.rules);
    },
    handleEditTitle() {
      this.isEditingTitle = true;
      this.$nextTick(() => {
        this.$refs.titleInput.focus();
      });
    },
    handleEditItem(item) {
      this.dialogInfo.visible = true;
      this.dialogInfo.time = item;
    },
    addRule() {
      this.rules.billingRulesDetails.push({
        billingRulesId: this.rules.billingRulesId,
        startTime: "00:00",
        endTime: "00:00",
        price: 0,
      });
      this.updateBillingRules();
    },
    handleDelete() {
      api.billingRules.delete(this.rules.billingRulesId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.removeList(this.rules.billingRulesId);
        }
      });
    },
    processChartData() {
      if (
        !this.rules.billingRulesDetails ||
        this.rules.billingRulesDetails.length === 0
      ) {
        return { labels: [], prices: [] };
      }

      const sortedRules = [...this.rules.billingRulesDetails].sort((a, b) => {
        return (
          this.timeToMinutes(a.startTime) - this.timeToMinutes(b.startTime)
        );
      });

      const labels = sortedRules.map((rule) => rule.startTime.substring(0, 5));
      if (sortedRules.length > 0) {
        labels.push(
          sortedRules[sortedRules.length - 1].endTime.substring(0, 5)
        );
      }

      const prices = sortedRules.map((rule) => rule.price);
      if (
        sortedRules.length > 0 &&
        sortedRules[sortedRules.length - 1].endTime === "00:00:00"
      ) {
        prices.push(sortedRules[0].price);
      } else if (sortedRules.length > 0) {
        prices.push(sortedRules[sortedRules.length - 1].price);
      }

      return { labels, prices };
    },
    timeToMinutes(timeStr) {
      const parts = timeStr.split(":");
      return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    },
    renderChart() {
      // 确保旧的图表实例被销毁
      if (this.chartInstance) {
        this.chartInstance.destroy();
        this.chartInstance = null;
      }

      // 使用动态ID避免冲突
      const canvasId = `chart-${this._uid}`;
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      const { labels, prices } = this.processChartData();

      // 创建新的图表实例
      this.chartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "电价 (¥/kWh)",
              data: prices,
              borderColor: "#409EFF",
              backgroundColor: "rgba(64, 158, 255, 0.2)",
              borderWidth: 2,
              pointBackgroundColor: "#409EFF",
              pointBorderColor: "#fff",
              pointBorderWidth: 1,
              pointRadius: 4,
              tension: 0.1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "价格 (¥/kWh)",
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `¥${context.parsed.y}/kWh`;
                },
              },
            },
          },
        },
      });
    },
    updateChart() {
      if (!this.chartInstance) {
        this.renderChart();
        return;
      }

      const { labels, prices } = this.processChartData();
      this.chartInstance.data.labels = labels;
      this.chartInstance.data.datasets[0].data = prices;
      this.chartInstance.update();
    },
  },
};
</script>

<style scoped>
/* 可根据需要补充样式 */
</style>
