<template>
  <div>
    <div class="header">
      <h1>车辆管理</h1>
      <div style="width: 400px">
        <el-row>
          <el-col :span="18" class="pr-3">
            <el-input
              v-model="param"
              placeholder="搜索车牌、品牌或客户"
              class="mr-5"
              @keydown.enter.native="getCars"
            >
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addCar">新增车辆</el-button>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="cars" border style="width: 100%">
          <el-table-column prop="carPlate" label="车牌号码"></el-table-column>
          <el-table-column prop="model" label="品牌型号"></el-table-column>
          <el-table-column label="车辆类型">
            <template slot-scope="scope">
              {{ scope.row.type == 1 ? "混合动力" : "纯电" }}
            </template>
          </el-table-column>
          <el-table-column prop="color" label="颜色"></el-table-column>
          <el-table-column
            prop="batteryCapacity"
            label="电池容量(KWH)"
          ></el-table-column>
          <el-table-column prop="range" label="续航里程(KM)"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state == 1">启用</el-tag>
              <el-tag type="info" v-if="scope.row.state == 0">停用</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="所属用户" prop="username"> </el-table-column>
          <el-table-column label="操作" fixed="right" width="240">
            <template slot-scope="scope">
              <el-button type="primary" @click="editCar(scope.row)" size="small"
                >编辑</el-button
              >
              <el-button
                type="warning"
                @click="disableCar(scope.row)"
                v-if="scope.row.state == 1"
                size="small"
                >停用</el-button
              >
              <el-button
                type="success"
                @click="enableCar(scope.row)"
                v-if="scope.row.state == 0"
                size="small"
                >启用</el-button
              >
              <el-button
                type="danger"
                @click="deleteCar(scope.row)"
                size="small"
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
          @current-change="getCars"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogInfo.visible"
      :title="dialogInfo.title"
      v-if="dialogInfo.car"
    >
      <el-form :data="dialogInfo.car">
        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号码" required>
              <el-input v-model="dialogInfo.car.carPlate"></el-input>
            </el-form-item>
            <el-form-item label="品牌型号">
              <el-input v-model="dialogInfo.car.model"></el-input>
            </el-form-item>
            <el-form-item label="颜色">
              <el-input v-model="dialogInfo.car.color"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="pl-3">
            <el-form-item label="电池容量(KWH)">
              <el-input-number
                v-model="dialogInfo.car.batteryCapacity"
                :min="10"
                :max="10000"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="续航里程(KM)">
              <el-input-number
                v-model="dialogInfo.car.range"
                :min="10"
                :max="10000"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="所属用户">
              <el-select v-model="dialogInfo.car.userIds" multiple filterable>
                <el-option
                  v-for="(item, index) in simpleUsers"
                  :key="index"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车辆类型">
              <el-radio v-model="dialogInfo.car.type" :label="0">纯电</el-radio>
              <el-radio v-model="dialogInfo.car.type" :label="1"
                >混合动力</el-radio
              >
            </el-form-item>
            <el-form-item label="状态" required>
              <el-radio v-model="dialogInfo.car.state" :label="0"
                >停用</el-radio
              >
              <el-radio v-model="dialogInfo.car.state" :label="1"
                >启用</el-radio
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.visible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      param: "",
      cars: [],
      page: 1,
      size: 10,
      total: 0,
      dialogInfo: {
        title: "新增车辆",
        visible: false,
        car: null,
      },
      simpleUsers: [],
    };
  },
  methods: {
    addOrUpdate() {
      // 判断非空
      if (!this.dialogInfo.car.carPlate) {
        this.$message.error("车牌号码不能为空");
        return;
      }
      if (!this.dialogInfo.car.userIds.length) {
        this.$message.error("请选择所属用户");
        return;
      }
      if (this.dialogInfo.title == "新增车辆") {
        api.car.add(this.dialogInfo.car).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("新增成功");
          }
          this.getCars();
          this.dialogInfo.visible = false;
        });
      } else {
        api.car.update(this.dialogInfo.car).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("修改成功");
          }
          this.getCars();
          this.dialogInfo.visible = false;
        });
      }
    },
    addCar() {
      this.dialogInfo.title = "新增车辆";
      this.dialogInfo.visible = true;
      this.dialogInfo.car = {
        carPlate: "",
        model: "",
        color: "",
        batteryCapacity: "",
        range: "",
        type: 0,
        state: 1,
        userIds: [],
      };
    },
    editCar(row) {
      api.carM.userIdListByCarId(row.carId).then((res) => {
        if (res.data.code == 200) {
          this.dialogInfo.car.userIds = res.data.data;
        }
      });
      this.dialogInfo.title = "编辑车辆";
      this.dialogInfo.visible = true;
      this.dialogInfo.car = row;
    },
    disableCar(row) {
      api.car.update({ carId: row.carId, state: 0 }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("停用成功");
        }
        this.getCars();
      });
    },
    enableCar(row) {
      api.car.update({ carId: row.carId, state: 1 }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("启用成功");
        }
        this.getCars();
      });
    },
    deleteCar(row) {
      api.car.delete(row.carId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
        }
        this.getCars();
      });
    },
    getCars(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.car.list(this.page, this.size, this.param).then((res) => {
        if (res.data.code == 200) {
          this.cars = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
  },
  mounted() {
    this.getCars();
    api.user.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.simpleUsers = res.data.data;
      }
    });
  },
};
</script>

<style></style>
