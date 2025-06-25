<template>
  <div>
    <div class="header">
      <h1>任务管理</h1>
      <div>
        <el-col :span="4" class="p-1"> &nbsp; </el-col>
        <el-col :span="6" class="p-1">
          <el-select
            v-model="state"
            placeholder="请选择状态"
            @change="getTasks(1)"
          >
            <el-option label="全部状态" :value="null"></el-option>
            <el-option label="待处理" :value="0"></el-option>
            <el-option label="处理中" :value="1"></el-option>
            <el-option label="已完成" :value="2"></el-option>
            <el-option label="已退回" :value="3"></el-option> </el-select
        ></el-col>
        <el-col :span="6" class="p-1">
          <el-select
            v-model="type"
            placeholder="请选择状态"
            @change="getTasks(1)"
          >
            <el-option label="全部类型" :value="null"></el-option>
            <el-option label="抢修任务" :value="0"></el-option>
            <el-option label="维修任务" :value="1"></el-option>
            <el-option label="消警任务" :value="2"></el-option> </el-select
        ></el-col>
        <el-col :span="4" class="p-1">
          <el-button type="primary" @click="addTask"
            >新增任务</el-button
          ></el-col
        >
        <el-col :span="4" class="p-1">
          <el-button type="success" @click="updateExcel"
            >导出Excel</el-button
          ></el-col
        >
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table ref="table" :data="taskList">
          <el-table-column
            label="任务编号"
            width="320"
            prop="taskId"
          ></el-table-column>
          <el-table-column
            label="任务名称"
            prop="name"
            width="140"
          ></el-table-column>
          <el-table-column label="任务类型">
            <template slot-scope="scope">
              {{
                scope.row.type == 0
                  ? "抢修任务"
                  : scope.row.type == 1
                  ? "维修任务"
                  : "消警任务"
              }}
            </template>
          </el-table-column>
          <el-table-column label="计划时间" width="340">
            <template slot-scope="scope">
              {{
                scope.row.planStartTime
                  ? scope.row.planStartTime +
                    (scope.row.planEndTime
                      ? " ~ " + scope.row.planEndTime
                      : " ~ 进行中")
                  : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column label="实际时间" width="340">
            <template slot-scope="scope">
              {{
                scope.row.factStartTime
                  ? scope.row.factStartTime +
                    (scope.row.factEndTime
                      ? " ~ " + scope.row.factEndTime
                      : " ~ 进行中")
                  : "-"
              }}
            </template>
          </el-table-column>
          <el-table-column
            label="充电站编号"
            width="320"
            prop="chargingStationId"
          ></el-table-column>
          <el-table-column label="状态" fixed="right">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == 0" type="warning">待处理</el-tag>
              <el-tag v-if="scope.row.state == 1" type="primary">处理中</el-tag>
              <el-tag v-if="scope.row.state == 2" type="success">已完成</el-tag>
              <el-tag v-if="scope.row.state == 3" type="info">已退回</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="editTask(scope.row)"
                >查看</el-button
              >
              <el-button
                type="success"
                size="small"
                v-if="scope.row.state == 1"
                @click="finishTask(scope.row)"
                >完成</el-button
              >
              <el-button
                type="success"
                size="small"
                v-if="scope.row.state == 0"
                @click="startTask(scope.row)"
                >开始处理</el-button
              >
              <el-button
                type="danger"
                size="small"
                v-if="scope.row.state != 3"
                @click="rejectTask(scope.row)"
                >退回</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="pt-2">
        <el-pagination
          background
          @current-change="getTasks"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      v-if="dialogInfo.task"
      :visible.sync="dialogInfo.visible"
      :title="dialogInfo.title"
    >
      <el-form :disabled="dialogInfo.title == '查看任务'">
        <el-form-item label="任务编号">
          <el-input
            v-model="dialogInfo.task.taskId"
            v-if="dialogInfo.title == '查看任务'"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务名称" required>
          <el-input v-model="dialogInfo.task.name"></el-input>
        </el-form-item>
        <el-form-item label="任务类型" required>
          <el-select v-model="dialogInfo.task.type">
            <el-option label="抢修任务" :value="0"></el-option>
            <el-option label="维修任务" :value="1"></el-option>
            <el-option label="消警任务" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计划时间">
          <el-date-picker
            v-model="dialogInfo.task.planStartTime"
            type="datetime"
          ></el-date-picker>
          ~
          <el-date-picker
            v-model="dialogInfo.task.planEndTime"
            type="datetime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="充电站">
          <el-select v-model="dialogInfo.task.chargingStationId">
            <el-option
              v-for="item in chargingStationList"
              :key="item.chargingStationId"
              :label="item.name"
              :value="item.chargingStationId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细描述">
          <el-input
            type="textarea"
            autosize
            v-model="dialogInfo.task.details"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        v-if="dialogInfo.title != '查看任务'"
      >
        <el-button @click="dialogInfo.visible = false">取 消</el-button>
        <el-button type="primary" @click="addTaskEnd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import utils from "@/utils";
export default {
  data() {
    return {
      type: null,
      state: null,
      page: 1,
      size: 10,
      total: 0,
      taskList: [],
      dialogInfo: {
        title: "新增任务",
        visible: false,
        task: null,
      },
      chargingStationList: [],
    };
  },
  methods: {
    addTaskEnd() {
      // 判断非空
      if (!this.dialogInfo.task.name) {
        this.$message.error("任务名称不能为空");
        return;
      }
      if (!this.dialogInfo.task.planStartTime) {
        this.$message.error("计划开始时间不能为空");
        return;
      }
      if (!this.dialogInfo.task.planEndTime) {
        this.$message.error("计划结束时间不能为空");
        return;
      }
      if (!this.dialogInfo.task.chargingStationId) {
        this.$message.error("充电站不能为空");
        return;
      }
      api.task.add(this.dialogInfo.task).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("新增任务成功");
          this.getTasks();
          this.dialogInfo.visible = false;
        }
      });
    },
    editTask(row) {
      this.dialogInfo.title = "查看任务";
      this.dialogInfo.task = row;
      this.dialogInfo.visible = true;
    },
    finishTask(row) {
      row.state = 2;
      row.factEndTime = new Date();
      api.task.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("任务已完成");
        }
      });
    },
    startTask(row) {
      row.state = 1;
      row.factStartTime = new Date();
      api.task.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("任务处理成功");
        }
      });
    },
    rejectTask(row) {
      row.state = 3;
      api.task.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("任务退回成功");
        }
      });
    },
    addTask() {
      this.dialogInfo.title = "新增任务";
      this.dialogInfo.visible = true;
      this.dialogInfo.task = {
        taskId: "",
        name: "",
        type: 0,
        planStartTime: "",
        planEndTime: "",
        chargingStationId: "",
        details: "",
        state: 0,
      };
    },
    getTasks(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.task
        .detailList(this.page, this.size, this.state, this.type)
        .then((res) => {
          if (res.data.code == 200) {
            this.taskList = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
    updateExcel() {
      // 获取表头
      let title = this.$refs.table.columns.map((item) => {
        return item.label;
      });
      title.pop();
      title.push("描述");
      let width = this.$refs.table.columns.map((item) => {
        return {
          wch: Number.isNaN(Math.max(item.width / 8, 8))
            ? 8
            : Math.max(item.width / 8, 8),
        };
      });
      utils.exportExcel(
        "任务管理",
        title,
        this.taskList.map((item) => {
          return [
            item.taskId,
            item.name,
            item.type == 0
              ? "抢修任务"
              : item.type == 1
              ? "维修任务"
              : "消警任务",
            item.planStartTime
              ? item.planStartTime +
                (item.planEndTime ? " ~ " + item.planEndTime : " ~ 进行中")
              : "-",
            item.factStartTime
              ? item.factStartTime +
                (item.factEndTime ? " ~ " + item.factEndTime : " ~ 进行中")
              : "-",
            item.chargingStationId,
            item.state == 0
              ? "待处理"
              : item.state == 1
              ? "处理中"
              : item.state == 2
              ? "已完成"
              : "已退回",
            item.details,
          ];
        }),
        width
      );
    },
  },
  mounted() {
    this.getTasks();
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.chargingStationList = res.data.data;
      }
    });
  },
};
</script>

<style></style>
