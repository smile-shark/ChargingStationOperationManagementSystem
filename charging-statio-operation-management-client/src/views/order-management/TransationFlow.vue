<template>
  <div>
    <div class="header">
      <h1>交易流水</h1>
      <div style="width: 400px">
        <el-row>
          <el-col :span="18" class="pr-3">
            <el-input
              v-model="param"
              placeholder="搜索订单号、客户名或电话"
              class="mr-5"
              @keydown.enter.native="getTransactionFlows"
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="success" @click="updateExcel">导出Excel</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="transactionFlowList" border ref="table">
          <el-table-column
            width="320"
            prop="transactionFlowId"
            label="订单号"
          ></el-table-column>
          <el-table-column prop="userName" label="客户名称"></el-table-column>
          <el-table-column
            prop="userPhone"
            label="联系电话"
            width="120"
          ></el-table-column>
          <el-table-column label="交易类型">
            <template slot-scope="scope">
              {{
                scope.row.transactionType == 0
                  ? "退款"
                  : scope.row.transactionType == 1
                  ? "充电"
                  : "充值"
              }}
            </template>
          </el-table-column>
          <el-table-column label="支付方式">
            <template slot-scope="scope">
              {{
                scope.row.payType == 0
                  ? "充电开"
                  : scope.row.payType == 1
                  ? "微信支付"
                  : "支付宝支付"
              }}
            </template>
          </el-table-column>
          <el-table-column prop="amouont" label="金额">
            <template slot-scope="scope">
              {{ scope.row.amount.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingStationName"
            label="所在充电站"
            width="140"
          ></el-table-column>
          <el-table-column
            width="320"
            prop="chargingPileId"
            label="充电桩编号"
          ></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="warning" v-if="scope.row.state == 0">
                待支付
              </el-tag>
              <el-tag type="success" v-if="scope.row.state == 1">
                已完成
              </el-tag>
              <el-tag type="primary" v-if="scope.row.state == 2">
                进行中
              </el-tag>
              <el-tag type="danger" v-if="scope.row.state == 3">
                已取消
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="mt-2">
        <el-pagination
          @current-change="getTransactionFlows"
          :total="total"
          background
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/api";
import utils from "@/utils";
export default {
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      transactionFlowList: [],
      param: "",
    };
  },
  methods: {
    updateExcel() {
      // 获取表头
      let title = this.$refs.table.columns.map((item) => {
        return item.label;
      });
      let width = this.$refs.table.columns.map((item) => {
        return {
          wch: Number.isNaN(Math.max(item.width / 8, 8))
            ? 8
            : Math.max(item.width / 8, 8),
        };
      });
      utils.exportExcel(
        "交易流水",
        title,
        this.transactionFlowList.map((item) => {
          return [
            item.transactionFlowId,
            item.userName,
            item.userPhone,
            item.transactionType == 0
              ? "退款"
              : item.transactionType == 1
              ? "充电"
              : "充值",
            item.payType == 0
              ? "充电开"
              : item.payType == 1
              ? "微信支付"
              : "支付宝支付",
            item.amount.toFixed(2),
            item.chargingStationName,
            item.chargingPileId,
            item.state == 0
              ? "待支付"
              : item.state == 1
              ? "已完成"
              : item.state == 2
              ? "进行中"
              : "已取消",
          ];
        }),
        width
      );
    },
    getTransactionFlows(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.transactionFlow
        .detailList(this.page, this.size, this.param)
        .then((res) => {
          if (res.data.code == 200) {
            this.transactionFlowList = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
  },
  mounted() {
    this.getTransactionFlows();
  },
};
</script>

<style></style>
