<template>
  <div>
    <div class="header">
      <h1>充电桩管理</h1>
      <span>
        <el-select
          v-model="selectedChargingStationId"
          filterable
          placeholder="选择充电站"
          class="mr-5"
          clearable
          @change="getChargingPileList"
        >
          <el-option
            v-for="(item, index) in chargingStationSimpleList"
            :key="index"
            :label="item.name"
            :value="item.chargingStationId"
          >
          </el-option>
        </el-select>
        <el-button type="primary" @click="addChargingPile"
          >新增充电桩</el-button
        >
      </span>
    </div>
    <el-row>
      <el-col :span="24">
        <el-table :data="chargingPileList" style="width: 100%">
          <el-table-column
            width="320"
            prop="chargingPileId"
            label="充电桩编号"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="名称"
            width="240"
          ></el-table-column>
          <el-table-column label="类别" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.typeC == 0"> 汽车充电桩 </span>
              <span v-if="scope.row.typeC == 1"> 电瓶车充电桩 </span>
              <span v-if="scope.row.typeC == 2"> 大型公交车充电桩 </span>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.typeV == 0"> 混合型(交直流) </span>
              <span v-if="scope.row.typeV == 1"> 直流桩 </span>
              <span v-if="scope.row.typeV == 2"> 交流桩 </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="chargingGunCount"
            label="充电枪数量"
            width="120"
          ></el-table-column>
          <el-table-column
            prop="power"
            label="功率(KW)"
            width="120"
          ></el-table-column>
          <el-table-column label="安装位置">
            <template slot-scope="scope">
              {{ scope.row.inPosition.charAt(0) }}
              区
              {{ scope.row.inPosition.slice(1) }}
            </template>
          </el-table-column>
          <el-table-column label="归属充电站" width="240">
            <template slot-scope="scope">
              {{ fromChrgingStation(scope.row.chargingStationId) }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <TagChargingPileState
                :state="scope.row.state"
              ></TagChargingPileState>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="170">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" size="small" @click="upDelete(scope.row.chargingPileId)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="pt-5">
        <el-pagination
          @current-change="getChargingPileList"
          background
          layout="prev, pager, next"
          :total="total"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <el-dialog
      v-if="dialogInfo.chargingPile"
      :title="dialogInfo.updateOrAdd"
      :visible.sync="dialogInfo.visible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="60%"
    >
      <el-form>
        <el-row>
          <el-col :span="12" class="pr-2">
            <el-form-item label="充电桩名称" required>
              <el-input v-model="dialogInfo.chargingPile.name" />
            </el-form-item>
            <el-form-item label="类别" required>
              <el-select v-model="dialogInfo.chargingPile.typeC">
                <el-option label="汽车充电桩" :value="0"></el-option>
                <el-option label="电瓶车充电桩" :value="1"></el-option>
                <el-option label="大型公交车充电桩" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型" required>
              <el-select v-model="dialogInfo.chargingPile.typeV">
                <el-option label="混合型(交直流)" :value="0"></el-option>
                <el-option label="直流桩" :value="1"></el-option>
                <el-option label="交流桩" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="充电枪数量" required>
              <el-input v-model="dialogInfo.chargingPile.chargingGunCount" />
            </el-form-item>
            <el-form-item label="功率(KW)" required>
              <el-input-number
                v-model="dialogInfo.chargingPile.power"
                controls-position="right"
                :min="0"
                :max="10000"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="归属充电站" required>
              <el-select
                v-model="dialogInfo.chargingPile.chargingStationId"
                filterable
              >
                <el-option
                  v-for="(item, index) in chargingStationSimpleList"
                  :key="index"
                  :label="item.name"
                  :value="item.chargingStationId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" required>
              <el-radio v-model="dialogInfo.chargingPile.state" :label="0">
                <TagChargingPileState :state="0"></TagChargingPileState>
              </el-radio>
              <el-radio v-model="dialogInfo.chargingPile.state" :label="1"
                ><TagChargingPileState :state="1"></TagChargingPileState
              ></el-radio>
              <el-radio v-model="dialogInfo.chargingPile.state" :label="2"
                ><TagChargingPileState :state="2"></TagChargingPileState
              ></el-radio>
              <el-radio v-model="dialogInfo.chargingPile.state" :label="3"
                ><TagChargingPileState :state="3"></TagChargingPileState
              ></el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="安装位置" required>
              <el-input v-model="dialogInfo.chargingPile.inPosition" />
            </el-form-item>
            <el-form-item label="详细">
              <el-input
                autosize
                v-model="dialogInfo.chargingPile.detail"
                type="textarea"
              />
            </el-form-item>
            <el-form-item label="图片">
              <el-input v-model="dialogInfo.chargingPile.picture" />
            </el-form-item>
            <el-form-item label="上传图片">
              <el-upload
                :action="''"
                :http-request="uploadImage"
                :show-file-list="false"
                accept="image/jpeg,image/png"
              >
                <el-button type="primary">点击上传</el-button>
                <template #tip>
                  <div class="el-upload__tip">
                    上传充电桩图片，支持jpg/png格式
                  </div>
                </template>
              </el-upload>
              <img
                v-if="dialogInfo.chargingPile.picture"
                :src="dialogInfo.chargingPile.picture"
                class="preview-image"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogInfo.visible = false">取 消</el-button>
        <el-button type="primary" @click="uphandle">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api";
import utils from "@/utils";
import { number } from "echarts";
import TagChargingPileState from "@/components/TagChargingPileState.vue";
export default {
  components: {
    TagChargingPileState,
  },
  data() {
    return {
      utils,
      chargingStationSimpleList: [],
      selectedChargingStationId: null,
      chargingPileList: [],
      page: 1,
      size: 10,
      total: 0,
      dialogInfo: {
        updateOrAdd: "新增充电桩",
        visible: false,
        chargingPile: null,
      },
    };
  },
  methods: {
    upDelete(id){
        api.chargingPile.delete(id).then(res=>{
            if(res.data.code==200){
                this.$message.success("删除成功")
            }
            this.getChargingPileList(this.page)
        })
    },
    uphandle() {
      // 必填字段不能为空
      if (!this.dialogInfo.chargingPile.name) {
        this.$message.error("充电桩名称不能为空");
        return;
      }
      if (!this.dialogInfo.chargingPile.chargingStationId) {
        this.$message.error("归属充电站不能为空");
        return;
      }
      if (!this.dialogInfo.chargingPile.inPosition) {
        this.$message.error("安装位置不能为空");
        return;
      }
      if (!this.dialogInfo.chargingPile.chargingGunCount) {
        this.$message.error("充电枪数量不能为空");
        return;
      }
      if (!this.dialogInfo.chargingPile.power) {
        this.$message.error("功率不能为空");
        return;
      }
      if (!this.dialogInfo.chargingPile.state) {
        this.$message.error("状态不能为空");
        return;
      }

      api.chargingPile.addOrUpdate(this.dialogInfo.chargingPile).then((res) => {
        if (res.data.code == 200) {
          this.$message.success(res.data.msg);
        }
        this.dialogInfo.visible = false;
        this.getChargingPileList();
      });
    },
    async uploadImage(options) {
      this.dialogInfo.chargingPile.picture = await utils.uploadImage(options);
    },
    handleEdit(row) {
      this.dialogInfo.updateOrAdd = "编辑充电桩";
      this.dialogInfo.chargingPile = row;
      this.dialogInfo.visible = true;
    },
    addChargingPile() {
      this.dialogInfo.updateOrAdd = "新增充电桩";
      this.dialogInfo.chargingPile = {
        chargingStationId: "",
        name: "",
        typeC: 0,
        typeV: 0,
        chargingGunCount: 0,
        power: 0,
        inPosition: "",
        state: 1,
        detail: "",
        picture: "",
      };
      this.dialogInfo.visible = true;
    },
    getChargingPileList(page) {
      if (typeof page != 'number') {
        page = 1;
      }
      this.page = page;
      api.chargingPile
        .listByChargingStationId({
          page: this.page,
          size: this.size,
          chargingStationId: this.selectedChargingStationId,
        })
        .then((res) => {
          if (res.data.code == 200) {
            this.total = res.data.data.total;
            this.chargingPileList = res.data.data.records;
          }
        });
    },
    fromChrgingStation(chargingStationId) {
      return this.chargingStationSimpleList.find(
        (item) => item.chargingStationId == chargingStationId
      ).name;
    },
  },
  mounted() {
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.chargingStationSimpleList = res.data.data;
      }
    });
    this.getChargingPileList();
  },
};
</script>

<style></style>
