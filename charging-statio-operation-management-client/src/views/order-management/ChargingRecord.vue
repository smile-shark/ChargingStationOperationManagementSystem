<template>
  <div>
    <div class="header">
      <h1>充电记录</h1>
      <div style="width: 400px">
        <el-row>
          <el-col :span="18" class="pr-3">
            <el-input
              v-model="param"
              placeholder="搜索订单号、电站名、客户名或客户电话"
              class="mr-5"
              @keydown.enter.native="getChargingRecord"
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
        <el-table :data="chargingRecordList" border ref="table">
          <el-table-column
            width="320"
            prop="chargingRecordId"
            label="充电单号"
          ></el-table-column>
          <el-table-column prop="userName" label="客户名称"></el-table-column>
          <el-table-column
            prop="userPhone"
            label="联系电话"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="startTime"
            label="开始时间"
            width="200"
          ></el-table-column>
          <el-table-column
            prop="chargingCurrent"
            label="充电电量(KWH)"
            width="140"
          ></el-table-column>
          <el-table-column
            prop="chargingLong"
            label="充电时长(分钟)"
            width="120"
          ></el-table-column>
          <el-table-column label="充电类型">
            <template slot-scope="scope">
              {{
                scope.row.chargingPileTypeC == 0
                  ? "汽车充电"
                  : scope.row.chargingPileTypeC == 1
                  ? "电瓶车充电"
                  : "公交车充电"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingStationName"
            label="所在充电站"
            width="120"
          ></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state"> 已结束 </el-tag>
              <el-tag type="primary" v-else> 充电中 </el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="mt-2">
        <el-pagination
          @current-change="getChargingRecord"
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
      chargingRecordList: [],
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
        return { wch: Number.isNaN(Math.max(item.width / 8, 8))? 8 : Math.max(item.width / 8, 8) };
      });
      utils.exportExcel(
        "充电记录",
        title,
        this.chargingRecordList.map((item) => {
          return [
            item.chargingRecordId,
            item.userName,
            item.userPhone,
            item.startTime,
            item.chargingCurrent,
            item.chargingLong,
            item.chargingPileTypeC == 0
              ? "汽车充电"
              : item.chargingPileTypeC == 1
              ? "电瓶车充电"
              : "公交车充电",
            item.chargingStationName,
            item.state ? "已结束" : "充电中",
          ];
        }),
        width
      );
    },
    getChargingRecord(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.chargingRecord
        .detailList(this.page, this.size, this.param)
        .then((res) => {
          if (res.data.code == 200) {
            this.chargingRecordList = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
  },
  mounted() {
    this.getChargingRecord();
  },
};
</script>

<style></style>
