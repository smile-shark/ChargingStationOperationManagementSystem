<template>
  <div>
    <div class="header">
      <h1>运维人员管理</h1>
      <div>
        <el-col :span="10" class="p-1">
          <el-input
            placeholder="搜索姓名、工号或电话"
            v-model="param"
            clearable
            @keydown.enter.native="getOperationsPersonnels"
          >
          </el-input>
        </el-col>
        <el-col :span="6" class="p-1">
          <el-select
            v-model="filterState"
            placeholder="请选择状态"
            @change="getOperationsPersonnels(1)"
          >
            <el-option label="全部" :value="null"></el-option>
            <el-option label="在线" :value="1"></el-option>
            <el-option label="离线" :value="0"></el-option> </el-select
        ></el-col>
        <el-col :span="4" class="p-1">
          <el-button type="primary" @click="addOperationsPersonnel"
            >新增人员</el-button
          ></el-col
        >
        <el-col :span="4" class="p-1">
          <el-button type="success" @click="updateExcel">导出Excel</el-button></el-col
        >
      </div>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="operationsPersonnelList" border ref="table">
          <el-table-column
            prop="operationsPersonnelId"
            width="320"
            label="员工编号"
          ></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="电话"></el-table-column>
          <el-table-column prop="password" label="密码"></el-table-column>
          <el-table-column label="职位">
            <template slot-scope="scope">
              {{
                scope.row.position == 0
                  ? "运维工程师"
                  : scope.row.position == 1
                  ? "高级运工程师"
                  : "运维主管"
              }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{ scope.row.state == 1 ? "在线" : "离线" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="operationPersonnelId"
            label="操作"
            fixed="right"
            width="240"
          >
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                @click="editOperationsPersonnel(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="warning"
                size="small"
                @click="setOffline(scope.row)"
                v-if="scope.row.state == 1"
                >设为离线</el-button
              >
              <el-button
                v-else
                type="primary"
                size="small"
                @click="setOnline(scope.row)"
              >
                设为在线
              </el-button>
              <el-button
                type="danger"
                size="small"
                @click="
                  deleteOperationsPersonnel(scope.row.operationsPersonnelId)
                "
                >删除</el-button
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
          @current-change="getOperationsPersonnels"
          :total="total"
        ></el-pagination>
      </el-col>
    </el-row>

    <el-dialog
      :visible.sync="dialogInfo.visible"
      v-if="dialogInfo.operationsPersonnel"
      :title="dialogInfo.title"
      width="20%"
    >
      <el-form :model="dialogInfo.operationsPersonnel">
        <el-form-item label="姓名" required>
          <el-input v-model="dialogInfo.operationsPersonnel.name"></el-input>
        </el-form-item>
        <el-form-item label="电话" required>
          <el-input v-model="dialogInfo.operationsPersonnel.phone"></el-input>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input
            v-model="dialogInfo.operationsPersonnel.password"
          ></el-input>
        </el-form-item>
        <el-form-item label="职位" required>
          <el-select v-model="dialogInfo.operationsPersonnel.position">
            <el-option label="运维工程师" :value="0"></el-option>
            <el-option label="高级运工程师" :value="1"></el-option>
            <el-option label="运维主管" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio v-model="dialogInfo.operationsPersonnel.state" :label="1"
            >在线</el-radio
          >
          <el-radio v-model="dialogInfo.operationsPersonnel.state" :label="0"
            >离线</el-radio
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.visible = false">取 消</el-button>
        <el-button
          type="primary"
          @click.native="saveOrUpdateOperationsPersonnel"
          >确 定</el-button
        >
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
      page: 1,
      size: 10,
      total: 0,
      param: "",
      filterState: null,
      operationsPersonnelList: [],
      dialogInfo: {
        title: "新增人员",
        visible: false,
        operationsPersonnel: null,
      },
    };
  },
  methods: {
    updateExcel() {
      // 获取表头
      let title = this.$refs.table.columns.map((item) => {
        return item.label;
      });
      title.pop()
      let width = this.$refs.table.columns.map((item) => {
        return { wch: Number.isNaN(Math.max(item.width / 8, 8))? 8 : Math.max(item.width / 8, 8) };
      });
      utils.exportExcel(
        "运维人员",
        title,
        this.operationsPersonnelList.map((item) => {
          return [
            item.operationsPersonnelId,
            item.userName,
            item.userPhone,
            item.password,
            item.position == 0 ? "运维工程师" : item.position == 1 ? "高级运工程师" : "运维主管",
            item.state ? "在线" : "离线",
          ];
        }),
        width
      );
    },
    saveOrUpdateOperationsPersonnel() {
      console.log("test");
      // 判断非空
      if (!this.dialogInfo.operationsPersonnel.name) {
        this.$message.error("姓名不能为空");
        return;
      }
      if (!this.dialogInfo.operationsPersonnel.phone) {
        this.$message.error("电话不能为空");
        return;
      }
      if (!this.dialogInfo.operationsPersonnel.password) {
        this.$message.error("密码不能为空");
        return;
      }
      if (this.dialogInfo.operationsPersonnel.position == null) {
        this.$message.error("职位不能为空");
        return;
      }
      if (this.dialogInfo.operationsPersonnel.state == null) {
        this.$message.error("状态不能为空");
        return;
      }
      if (this.dialogInfo.title == "新增人员") {
        api.operationsPersonnel
          .add(this.dialogInfo.operationsPersonnel)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("新增成功");
              this.dialogInfo.visible = false;
              this.getOperationsPersonnels();
            }
          });
      } else {
        api.operationsPersonnel
          .update(this.dialogInfo.operationsPersonnel)
          .then((res) => {
            if (res.data.code == 200) {
              this.$message.success("编辑成功");
              this.dialogInfo.visible = false;
            }
          });
      }
    },
    addOperationsPersonnel() {
      this.dialogInfo.title = "新增人员";
      this.dialogInfo.visible = true;
      this.dialogInfo.operationsPersonnel = {
        name: "",
        phone: "",
        password: "",
        position: 0,
        state: 1,
      };
    },
    editOperationsPersonnel(row) {
      this.dialogInfo.title = "编辑人员";
      this.dialogInfo.visible = true;
      this.dialogInfo.operationsPersonnel = row;
    },
    setOffline(row) {
      row.state = 0;
      api.operationsPersonnel.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("操作成功");
        }
      });
    },
    setOnline(row) {
      row.state = 1;
      api.operationsPersonnel.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("操作成功");    
        }
      });
    },
    deleteOperationsPersonnel(id) {
      api.operationsPersonnel.delete(id).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.getOperationsPersonnels();
        }
      });
    },
    getOperationsPersonnels(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.operationsPersonnel
        .detailList(this.page, this.size, this.param, this.filterState)
        .then((res) => {
          if (res.data.code == 200) {
            this.operationsPersonnelList = res.data.data.records;
            this.total = res.data.data.total;
          }
        });
    },
  },
  mounted() {
    this.getOperationsPersonnels();
  },
};
</script>

<style scoped></style>
