<template>
  <div>
    <div class="header">
      <h1>客户管理</h1>
      <el-button type="primary" @click="addUser">新增客户</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="users" border style="width: 100%">
          <el-table-column label="客户名称" prop="name"></el-table-column>
          <el-table-column
            label="登录账户"
            prop="account"
            width="140"
          ></el-table-column>
          <el-table-column
            label="联系电话"
            prop="phone"
            width="120"
          ></el-table-column>
          <el-table-column
            label="身份证号码"
            prop="idCard"
            width="240"
          ></el-table-column>
          <el-table-column label="客户类型" width="120">
            <template slot-scope="scope">
              {{ scope.row.userType ? "公司合作用户" : "个人普通用户" }}
            </template>
          </el-table-column>
          <el-table-column
            label="关联车辆数"
            prop="carCount"
            width="120"
          ></el-table-column>
          <el-table-column label="是否开充电卡" width="120">
            <template slot-scope="scope">
              {{ scope.row.chargingCardId ? "已开卡" : "未开卡" }}
            </template>
          </el-table-column>
          <el-table-column label="账户类型">
            <template slot-scope="scope">
              {{
                scope.row.accountType == 0
                  ? "预付费"
                  : scope.row.accountType == 1
                  ? "后付费"
                  : scope.row.accountType == 2
                  ? "月结"
                  : scope.row.accountType == 3
                  ? "年节"
                  : "类型错误"
              }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state"> 正常 </el-tag>
              <el-tag type="warning" v-else> 停用 </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240" fixed="right">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="editUser(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="warning"
                size="mini"
                @click="disableUser(scope.row)"
                v-if="scope.row.state"
                >停用</el-button
              >
              <el-button
                type="warning"
                size="mini"
                @click="enableUser(scope.row)"
                v-else
                >启用</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="deleteUser(scope.row)"
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
          @current-change="getUsers"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 编辑或新增 -->
    <el-dialog
      :title="dialogInfo.title"
      :visible.sync="dialogInfo.visible"
      v-if="dialogInfo.user"
    >
      <el-form :v-model="dialogInfo.user">
        <el-row>
          <el-col :span="12">
            <el-form-item label="客户名称" required>
              <el-input v-model="dialogInfo.user.name"></el-input>
            </el-form-item>
            <el-form-item label="登录账户" required>
              <el-input v-model="dialogInfo.user.account"></el-input>
            </el-form-item>
            <el-form-item label="账户密码" required>
              <el-input v-model="dialogInfo.user.password"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="dialogInfo.user.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="pl-4">
            <el-form-item label="身份证号">
              <el-input v-model="dialogInfo.user.idCard"></el-input>
            </el-form-item>
            <el-form-item label="客户类型" required>
              <el-radio v-model="dialogInfo.user.userType" :label="0"
                >个人普通用户</el-radio
              >
              <el-radio v-model="dialogInfo.user.userType" :label="1"
                >公司合作用户</el-radio
              >
            </el-form-item>
            <el-form-item label="账户类型" required>
              <el-select
                v-model="dialogInfo.user.accountType"
                placeholder="请选择账户类型"
              >
                <el-option label="预付费" :value="0"></el-option>
                <el-option label="后付费" :value="1"></el-option>
                <el-option label="月结" :value="2"></el-option>
                <el-option label="年结" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-radio v-model="dialogInfo.user.state" :label="0">
                <el-tag type="warning">停用</el-tag>
              </el-radio>
              <el-radio v-model="dialogInfo.user.state" :label="1">
                <el-tag type="success">正常</el-tag>
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.visible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdate">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      users: [],
      dialogInfo: {
        title: "新增客户",
        visible: false,
        user: null,
      },
    };
  },
  methods: {
    addOrUpdate() {
      // 判断必填字段非空
      if (!this.dialogInfo.user.name) {
        this.$message.error("客户名称不能为空");
        return;
      }
      if (!this.dialogInfo.user.account) {
        this.$message.error("登录账户不能为空");
        return;
      }
      if (!this.dialogInfo.user.password) {
        this.$message.error("账户密码不能为空");
        return;
      }
      if (this.dialogInfo.title == "新增客户") {
        api.user.add(this.dialogInfo.user).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("新增成功");
            this.dialogInfo.visible = false;
            this.getUsers();
          }
        });
      } else {
        api.user.update(this.dialogInfo.user).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("编辑成功");
            this.dialogInfo.visible = false;
            this.getUsers();
          }
        });
      }
    },
    addUser() {
      this.dialogInfo.title = "新增客户";
      this.dialogInfo.visible = true;
      this.dialogInfo.user = {
        name: "",
        account: "",
        idCard: "",
        phone: "",
        password: "",
        userType: 0,
        accountType: 1,
        state: 1,
      };
    },
    editUser(row) {
      this.dialogInfo.title = "编辑客户";
      this.dialogInfo.visible = true;
      this.dialogInfo.user = row;
    },
    disableUser(row) {
      row.state = 0;
      api.user.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("停用成功");
          this.getUsers();
        }
      });
    },
    enableUser(row) {
      row.state = 1;
      api.user.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("启用成功");
          this.getUsers();
        }
      });
    },
    deleteUser(row) {
      api.user.delete(row.userId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.getUsers();
        }
      });
    },
    getUsers(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.user.list(this.page, this.size).then((res) => {
        if (res.data.code == 200) {
          this.users = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
  },
  mounted() {
    this.getUsers();
  },
};
</script>

<style></style>
