<template>
  <div>
    <div class="header">
      <h1>报警消息</h1>
      <div>
        <el-input
          placeholder="搜索充电桩、充电站"
          v-model="param"
          clearable
          @keydown.enter.native="getAlarmMsg"
        >
        </el-input>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="alarmMsgList" border>
          <el-table-column
            prop="chargingPileName"
            label="充电桩名称"
            width="240"
          ></el-table-column>
          <el-table-column
            prop="chargingStationName"
            label="归属充电站"
            width="120"
          ></el-table-column>
          <el-table-column label="报警类型">
            <template slot-scope="scope">
              {{
                scope.row.type == 0
                  ? "电压异常"
                  : scope.row.type == 1
                  ? "电流异常"
                  : scope.row.type == 2
                  ? "温度过高"
                  : scope.row.type == 3
                  ? "绝缘故障"
                  : scope.row.type == 4
                  ? "漏电流"
                  : "通信中断"
              }}
            </template>
          </el-table-column>
          <el-table-column label="等级程度">
            <template slot-scope="scope">
              <el-tag type="info" v-if="scope.row.level == 0">一般</el-tag>
              <el-tag type="warning" v-if="scope.row.level == 1">紧急</el-tag>
              <el-tag type="danger" v-if="scope.row.level == 2">严重</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="alarmTime"
            label="报警时间"
            width="240"
          ></el-table-column>
          <el-table-column
            prop="detail"
            label="报警详情"
            width="240"
          ></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="danger" v-if="scope.row.state == 0">未读</el-tag>
              <el-tag type="primary" v-if="scope.row.state == 1">已读</el-tag>
              <el-tag type="success" v-if="scope.row.state == 2">已处理</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.state"
                size="small"
                @change="updateAlarmMsg(scope.row)"
              >
                <el-option label="未读" :value="0"></el-option>
                <el-option label="已读" :value="1"></el-option>
                <el-option label="已处理" :value="2"></el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="pt-2">
        <el-pagination
          background
          @current-change="getAlarmMsg"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      param: "",
      page: 1,
      size: 10,
      total: 0,
      alarmMsgList: [],
    };
  },
  methods: {
    updateAlarmMsg(row) {
      api.alarmMsg.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("修改成功");
        }
      });
    },
    getAlarmMsg(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.alarmMsg.detailList(this.page, this.size, this.param).then((res) => {
        if (res.data.code == 200) {
          this.alarmMsgList = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
  },
  mounted() {
    this.getAlarmMsg();
  },
};
</script>

<style></style>
