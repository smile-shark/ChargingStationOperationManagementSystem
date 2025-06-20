<template>
  <div>
    <div class="header">
      <h1>充电卡管理</h1>
      <el-button type="primary" @click="addChargingCard">新增充电卡</el-button>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="chargingCards" border style="width: 100%">
          <el-table-column
            prop="chargingCardId"
            label="充电卡编号"
            width="320"
          ></el-table-column>
          <el-table-column label="归属客户" width="180" fixed>
            <template slot-scope="scope">
              {{ scope.row.user.name }}
            </template>
          </el-table-column>
          <el-table-column label="联系电话" width="180">
            <template slot-scope="scope">
              {{ scope.row.user.phone }}
            </template>
          </el-table-column>
          <el-table-column label="身份证号码" width="320">
            <template slot-scope="scope">
              {{ scope.row.user.idCard }}
            </template>
          </el-table-column>
          <el-table-column label="会员等级">
            <template slot-scope="scope">
              <TagChargingCardLevel
                :level="scope.row.level"
              ></TagChargingCardLevel>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="开卡时间"
            width="240"
          ></el-table-column>
          <el-table-column label="卡内金额" width="120">
            <template slot-scope="scope">
              ￥{{ scope.row.balance.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.state == 1">已激活</el-tag>
              <el-tag type="waring" v-if="scope.row.state == 0">未激活</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="small"
                @click="editChargingCard(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="primary"
                size="small"
                @click="rechargeChargingCard(scope.row)"
                >充值</el-button
              >
              <el-button
                v-if="scope.row.state == 1"
                type="warning"
                size="small"
                @click="disableChargingCard(scope.row)"
                >停用</el-button
              >
              <el-button
                type="success"
                size="small"
                v-if="scope.row.state == 0"
                @click="enableChargingCard(scope.row)"
                >启用</el-button
              >
              <el-button
                type="danger"
                size="small"
                @click="deleteChargingCard(scope.row)"
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
          @current-change="getChargingCards"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <!-- 添加或编辑 ，充值只显示充值框 -->
    <el-dialog
      v-if="dialogInfo.chargingCard"
      :visible.sync="dialogInfo.visible"
      :title="dialogInfo.title"
      width="20%"
    >
      <el-form :model="dialogInfo.chargingCard">
        <div v-if="dialogInfo.title == '添加充电卡'">
          <el-form-item label="归属客户" required>
            <el-select v-model="dialogInfo.chargingCard.userId">
              <el-option
                v-for="(item, index) in simpleUsers"
                :key="index"
                :label="item.name"
                :value="item.userId"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="dialogInfo.title == '编辑充电卡'">
          <el-form-item label="会员等级" required>
            <el-select v-model="dialogInfo.chargingCard.level">
              <el-option label="VIP1" :value="0"></el-option>
              <el-option label="VIP2" :value="1"></el-option>
              <el-option label="VIP3" :value="2"></el-option>
              <el-option label="VIP4" :value="3"></el-option>
              <el-option label="VIP5" :value="4"></el-option>
              <el-option label="VIP6" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="金额" required>
            <el-input-number
              v-model="dialogInfo.chargingCard.balance"
              :min="0"
              :max="99999999"
            ></el-input-number>
          </el-form-item>
        </div>
        <div v-if="dialogInfo.title == '充值'">
          <el-form-item label="充值金额">
            <el-input-number
              v-model="dialogInfo.rechargeAmount"
              :min="0"
              :max="99999999"
            ></el-input-number>
          </el-form-item>
        </div>
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
import TagChargingCardLevel from "@/components/TagChargingCardLevel.vue";
export default {
  components: {
    TagChargingCardLevel,
  },
  data() {
    return {
      page: 1,
      size: 10,
      total: 0,
      chargingCards: [],
      dialogInfo: {
        title: "添加充电卡",
        visible: false,
        chargingCard: null,
        rechargeAmount: 0,
      },
      simpleUsers: [],
    };
  },
  methods: {
    addOrUpdate() {
      if (this.dialogInfo.title == "充值") {
        // 判断不为负数
        if (this.dialogInfo.rechargeAmount < 0) {
          this.$message.error("充值金额不能为负数");
          return;
        }
        this.dialogInfo.chargingCard.balance += this.dialogInfo.rechargeAmount;
        api.chargingCard.update(this.dialogInfo.chargingCard).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("充值成功");
            this.dialogInfo.visible = false;
            this.getChargingCards();
          }
        });
      }
      if (this.dialogInfo.title == "编辑充电卡") {
        // 判断金额不为负数
        if (this.dialogInfo.chargingCard.balance < 0) {
          this.$message.error("充值金额不能为负数");
          return;
        }
        // VIP等级只能在0-5之间
        if (
          this.dialogInfo.chargingCard.level < 0 ||
          this.dialogInfo.chargingCard.level > 5
        ) {
          this.$message.error("会员等级错误");
          return;
        }
        api.chargingCard.update(this.dialogInfo.chargingCard).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("编辑成功");
            this.dialogInfo.visible = false;
            this.getChargingCards();
          }
        });
      }
      if (this.dialogInfo.title == "添加充电卡") {
        // 用户不能为空
        if (!this.dialogInfo.chargingCard.userId) {
          this.$message.error("请选择归属客户");
          return;
        }
        api.chargingCard.add(this.dialogInfo.chargingCard).then((res) => {
          if (res.data.code == 200) {
            this.$message.success("添加成功");
            this.dialogInfo.visible = false;
            this.getChargingCards();
            this.getsimpleListNotHaveChargingCard();
          }
        });
      }
    },
    addChargingCard() {
      this.dialogInfo.title = "添加充电卡";
      this.dialogInfo.visible = true;
      this.dialogInfo.chargingCard = {
        userId: "",
      };
    },
    editChargingCard(row) {
      this.dialogInfo.title = "编辑充电卡";
      this.dialogInfo.visible = true;
      this.dialogInfo.chargingCard = row;
    },
    rechargeChargingCard(row) {
      this.dialogInfo.title = "充值";
      this.dialogInfo.visible = true;
      this.dialogInfo.chargingCard = row;
      this.dialogInfo.rechargeAmount = 0;
    },
    disableChargingCard(row) {
      row.state = 0;
      api.chargingCard.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("停用成功");
          this.getChargingCards();
        }
      });
    },
    enableChargingCard(row) {
      row.state = 1;
      api.chargingCard.update(row).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("启用成功");
          this.getChargingCards();
        }
      });
    },
    deleteChargingCard(row) {
      api.chargingCard.delete(row.chargingCardId).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.getChargingCards();
          this.getsimpleListNotHaveChargingCard();  
        }
      });
    },
    getChargingCards(page) {
      if (typeof page != "number") {
        page = 1;
      }
      this.page = page;
      api.chargingCard.list(this.page, this.size).then((res) => {
        if (res.data.code == 200) {
          this.chargingCards = res.data.data.records;
          this.total = res.data.data.total;
        }
      });
    },
    getsimpleListNotHaveChargingCard() {
      api.user.simpleListNotHaveChargingCard().then((res) => {
        if (res.data.code == 200) {
          this.simpleUsers = res.data.data;
        }
      });
    },
  },
  mounted() {
    this.getChargingCards();
    this.getsimpleListNotHaveChargingCard();
  },
};
</script>

<style></style>
