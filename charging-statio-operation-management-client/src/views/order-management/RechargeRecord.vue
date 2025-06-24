<template>
  <div>
    <div class="header">
      <h1>充值记录</h1>
      <div style="width: 400px">
        <el-row>
          <el-col :span="18" class="pr-3">
            <el-input
              v-model="param"
              placeholder="搜索订单号、客户名或电话"
              class="mr-5"
              @keydown.enter.native="getRechargeRecords"
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
        <el-table :data="rechargeRecordList" border ref="table">
          <el-table-column
            width="320"
            prop="rechargeRecordId"
            label="充电单号"
          ></el-table-column>
          <el-table-column prop="userName" label="客户名称"></el-table-column>
          <el-table-column
            prop="userPhone"
            label="联系电话"
            width="120"
          ></el-table-column>
          <el-table-column prop="balance" label="交易金额(￥)"></el-table-column>
          <el-table-column prop="time" label="交易时间"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.state == 0"> 失败 </el-tag>
              <el-tag type="success" v-if="scope.row.state == 1"> 成功 </el-tag>
              <el-tag type="warning" v-if="scope.row.state == 2">
                待支付
              </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="mt-2">
        <el-pagination
          @current-change="getRechargeRecords"
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
      rechargeRecordList: [],
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
        "充值记录",
        title,
        this.rechargeRecordList.map((item) => {
          return [
            item.rechargeRecordId,
            item.userName,
            item.userPhone,
            item.balance,
            item.time,
            item.state==0?"失败":item.state==1?"成功":"待支付",
          ];
        }),
        width
      );
    },
    getRechargeRecords(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.rechargeRecord
        .detailList(this.page, this.size, this.param)
        .then((res) => {
          if (res.data.code == 200) {
            this.rechargeRecordList = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
  },
  mounted() {
    this.getRechargeRecords();
  },
};
</script>

<style></style>
