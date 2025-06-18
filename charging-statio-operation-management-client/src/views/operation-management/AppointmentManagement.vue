<template>
  <div>
    <div class="header">
      <h1>预约管理</h1>
      <div style="width: 400px">
        <el-row>
          <el-col :span="18" class="pr-3">
            <el-input
              v-model="param"
              placeholder="搜索充电桩编号、名称、充电站名称或客户"
              class="mr-5"
              @keydown.enter.native="getReservations"
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addReservation"
              >新增预约</el-button
            >
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="reservations" style="width: 100%" :border="true">
          <el-table-column
            width="320"
            prop="reservationId"
            label="预约编号"
          ></el-table-column>
          <el-table-column
            width="200"
            prop="chargingPileName"
            label="充电桩名称"
          ></el-table-column>
          <el-table-column
            width="200"
            prop="chargingStationName"
            label="所在充电站"
          ></el-table-column>
          <el-table-column
            width="200"
            prop="range"
            label="预约时长（分钟）"
          ></el-table-column>
          <el-table-column
            width="200"
            prop="startTime"
            label="预约开始时间"
          ></el-table-column>
          <el-table-column
            prop="username"
            label="预约客户"
            width="120"
          ></el-table-column>
          <el-table-column label="状态" width="120">
            <template slot-scope="scope">
              <TagReservationState
                :state="scope.row.state"
              ></TagReservationState>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="warning"
                size="small"
                @click="handleCancel(scope.row)"
                v-if="scope.row.state == 2"
                >取消</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="mt-2">
        <el-pagination
          @current-change="getReservations"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      v-if="dialogInfo.reservation != null"
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      width="30%"
    >
      <el-form :model="dialogInfo.reservation">
        <el-form-item label="充电站" required>
          <el-select
            v-model="dialogInfo.reservation.chargingStationId"
            filterable
            :disabled="dialogInfo.title == '编辑预约'"
            @change="
              getsimpleListByChargingStationId(
                dialogInfo.reservation.chargingStationId
              )
            "
          >
            <el-option
              v-for="(item, index) in simpleChargingStations"
              :key="index"
              :label="item.name"
              :value="item.chargingStationId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="充电桩" required>
          <el-select
            v-model="dialogInfo.reservation.chargingPileId"
            filterable
            :disabled="dialogInfo.title == '编辑预约'"
          >
            <el-option
              v-for="(item, index) in simpleChargingPiles"
              :key="index"
              :label="item.name"
              :value="item.chargingPileId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预约时间" required>
          <el-date-picker
            v-model="dialogInfo.reservation.startTime"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="预约时长（分钟）" required>
          <el-input-number
            :min="10"
            :max="10000"
            v-model="dialogInfo.reservation.range"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="预约客户" required>
          <el-select
            v-model="dialogInfo.reservation.userId"
            filterable
            :disabled="dialogInfo.title == '编辑预约'"
          >
            <el-option
              v-for="(item, index) in simpleUsers"
              :key="index"
              :label="item.name"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio v-model="dialogInfo.reservation.state" :label="0"
            >已取消
          </el-radio>
          <el-radio v-model="dialogInfo.reservation.state" :label="1"
            >已完成
          </el-radio>
          <el-radio v-model="dialogInfo.reservation.state" :label="2"
            >已预约
          </el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="dialogInfo.visible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateReservation"
          >确 定
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import utils from "@/utils";
import TagReservationState from "@/components/TagReservationState.vue";
export default {
  components: {
    TagReservationState,
  },
  data() {
    return {
      param: "",
      page: 1,
      size: 10,
      total: 0,
      reservations: [],
      dialogInfo: {
        title: "新增预约",
        visible: false,
        reservation: null,
      },
      simpleUsers: [],
      simpleChargingStations: [],
      simpleChargingPiles: [],
    };
  },
  methods: {
    saveOrUpdateReservation() {
      // 判断非空
      if (!this.dialogInfo.reservation.chargingPileId) {
        this.$message.error("请选择充电桩");
        return;
      }
      if (!this.dialogInfo.reservation.range) {
        this.$message.error("请选择预约时长");
        return;
      }
      if (!this.dialogInfo.reservation.startTime) {
        this.$message.error("请选择预约时间");
        return;
      }
      if (!this.dialogInfo.reservation.userId) {
        this.$message.error("请选择预约客户");
        return;
      }
      if (this.dialogInfo.title == "编辑预约") {
        api.reservation.update(this.dialogInfo.reservation).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("修改成功");
          }
          this.dialogInfo.visible = false;
          this.getReservations();
        });
      } else {
        api.reservation.add(this.dialogInfo.reservation).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("添加成功");
          }
          this.dialogInfo.visible = false;
          this.getReservations();
        });
      }
    },
    addReservation() {
      this.dialogInfo.title = "新增预约";
      this.dialogInfo.reservation = {
        chargingPileId: "",
        chargingStationId: "",
        range: 10,
        startTime: "",
        state: 2,
        userId: "",
      };
      this.dialogInfo.visible = true;
    },
    handleEdit(row) {
      this.getsimpleListByChargingStationId(row.chargingStationId);
      this.dialogInfo.title = "编辑预约";
      this.dialogInfo.reservation = row;
      this.dialogInfo.visible = true;
    },
    handleCancel(row) {
      api.reservation
        .update({ reservationId: row.reservationId, state: 0 })
        .then((res) => {
          if (res.data.code == 200) {
            this.$message.success("取消成功");
          }
          this.getReservations();
        });
    },
    handleDelete(row) {
      api.reservation.delete(row.reservationId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
        }
        this.getReservations();
      });
    },
    getReservations(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.reservation.list(this.page, this.size, this.param).then((res) => {
        if (res.data.code == 200) {
          this.reservations = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    getsimpleListByChargingStationId(chargingStationId) {
      if(this.dialogInfo.reservation){
        this.dialogInfo.reservation.chargingPileId = "";
      }
      api.chargingPile
        .simpleListByChargingStationId(chargingStationId)
        .then((res) => {
          if (res.data.code == 200) {
            this.simpleChargingPiles = res.data.data;
          }
        });
    },
  },
  mounted() {
    this.getReservations();
    api.user.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.simpleUsers = res.data.data;
      }
    });
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.simpleChargingStations = res.data.data;
      }
    });
  },
};
</script>

<style></style>
