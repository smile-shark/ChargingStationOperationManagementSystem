<template>
  <div>
    <div class="header">
      <h1>报警阈值设置</h1>
    </div>
    <el-row>
      <el-col :span="24">
        <el-tabs v-model="activeName">
          <el-tab-pane label="电压参数" name="电压参数">
            <el-row>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">A相电压 (V)</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (V)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.A.warning"
                        :min="0"
                        :max="300"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.A.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (V)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.A.danger"
                        :min="0"
                        :max="300"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.A.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.A.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.A.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">B相电压 (V)</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (V)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.B.warning"
                        :min="0"
                        :max="300"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.B.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (V)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.B.danger"
                        :min="0"
                        :max="300"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.B.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.B.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.B.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">C相电压 (V)</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (V)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.C.warning"
                        :min="0"
                        :max="300"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.C.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (V)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.C.danger"
                        :min="0"
                        :max="300"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.C.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.V.C.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.V.C.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="电流参数" name="电流参数">
            <el-row>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">A相电流（A）</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (A)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.A.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.A.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (A)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.A.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.A.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.A.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.A.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">B相电流（A）</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (A)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.B.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.B.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (A)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.B.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.B.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.B.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.B.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">C相电流（A）</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (A)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.C.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.C.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (A)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.C.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.C.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.A.C.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.A.C.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="温度参数" name="温度参数">
            <el-row>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">环境温度（°C）</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (°C)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.ambient.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.ambient.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (°C)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.ambient.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.ambient.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.ambient.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.ambient.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">充电枪温度（°C）</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (°C)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.chargingGun.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.chargingGun.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (°C)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.chargingGun.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.chargingGun.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.chargingGun.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.chargingGun.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">充电模块温度（°C）</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (°C)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.chargingModule.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.chargingModule.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (°C)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.chargingModule.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.chargingModule.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.C.chargingModule.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.C.chargingModule.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="其他参数" name="其他参数">
            <el-row>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">绝缘电阻 (MΩ)</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (MΩ)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="
                          param.another.insulationResistance.warning
                        "
                        :min="0"
                        :max="10"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="
                          param.another.insulationResistance.warning
                        "
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (MΩ)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="
                          param.another.insulationResistance.danger
                        "
                        :min="0"
                        :max="10"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="
                          param.another.insulationResistance.danger
                        "
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.another.insulationResistance.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.another.insulationResistance.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
              <el-col class="p-5" :span="8">
                <el-card class="p-2">
                  <div class="header">
                    <h1 style="font-size: 1rem">漏电流 (mA)</h1>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">警告阈值 (mA)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.another.leakageCurrent.warning"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.another.leakageCurrent.warning"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">严重阈值 (mA)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.another.leakageCurrent.danger"
                        :min="0"
                        :max="100"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.another.leakageCurrent.danger"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                  <div>
                    <div style="font-size: 0.875rem">报警延迟 (秒)</div>
                    <el-col :span="18" class="pl-1">
                      <el-slider
                        v-model.number="param.another.leakageCurrent.time"
                        :min="0"
                        :max="30"
                      ></el-slider>
                    </el-col>
                    <el-col :span="6" class="pl-3">
                      <el-input
                        v-model.number="param.another.leakageCurrent.time"
                        type="number"
                      ></el-input>
                    </el-col>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <p>批量应用到充电桩</p>
        <p style="color: #6b72a1; font-size: 0.875rem">
          选择需要应用设置的充电桩
        </p>
      </el-col>
      <el-col :span="4">
        <el-select
          v-model="selected"
          multiple
          filterable
          placeholder="请选择充电站"
        >
          <el-option
            v-for="(item, index) in chargingStationList"
            :key="index"
            :label="item.name"
            :value="item.chargingStationId"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="apply">批量应用</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      activeName: "电压参数",
      param: {
        V: {
          A: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          B: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          C: {
            warning: 0,
            danger: 0,
            time: 0,
          },
        },
        A: {
          A: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          B: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          C: {
            warning: 0,
            danger: 0,
            time: 0,
          },
        },
        C: {
          ambient: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          chargingGun: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          chargingModule: {
            warning: 0,
            danger: 0,
            time: 0,
          },
        },
        another: {
          insulationResistance: {
            warning: 0,
            danger: 0,
            time: 0,
          },
          leakageCurrent: {
            warning: 0,
            danger: 0,
            time: 0,
          },
        },
      },
      chargingStationList: [],
      selected: [],
    };
  },
  methods: {
    async apply() {
      if (this.selected.length == 0) {
        this.$message.error("请选择充电站");
        return;
      }
      let params = [];
      for (let selected of this.selected) {
        if (this.activeName == "电压参数") {
          params.push({
            chargingStationId: selected,
            type: 0,
            warning: this.param.V.A.warning,
            serious: this.param.V.A.danger,
            alarmDelay: this.param.V.A.time,
          });
          params.push({
            chargingStationId: selected,
            type: 1,
            warning: this.param.V.B.warning,
            serious: this.param.V.B.danger,
            alarmDelay: this.param.V.B.time,
          });
          params.push({
            chargingStationId: selected,
            type: 2,
            warning: this.param.V.C.warning,
            serious: this.param.V.C.danger,
            alarmDelay: this.param.V.C.time,
          });
        } else if (this.activeName == "电流参数") {
          params.push({
            chargingStationId: selected,
            type: 3,
            warning: this.param.A.A.warning,
            serious: this.param.A.A.danger,
            alarmDelay: this.param.A.A.time,
          });
          params.push({
            chargingStationId: selected,
            type: 4,
            warning: this.param.A.B.warning,
            serious: this.param.A.B.danger,
            alarmDelay: this.param.A.B.time,
          });
          params.push({
            chargingStationId: selected,
            type: 5,
            warning: this.param.A.C.warning,
            serious: this.param.A.C.danger,
            alarmDelay: this.param.A.C.time,
          });
        } else if (this.activeName == "温度参数") {
          params.push({
            chargingStationId: selected,
            type: 0,
            warning: this.param.C.ambient.warning,
            serious: this.param.C.ambient.danger,
            alarmDelay: this.param.C.ambient.time,
          });
          params.push({
            chargingStationId: selected,
            type: 1,
            warning: this.param.C.chargingGun.warning,
            serious: this.param.C.chargingGun.danger,
            alarmDelay: this.param.C.chargingGun.time,
          });
          params.push({
            chargingStationId: selected,
            type: 2,
            warning: this.param.C.chargingModule.warning,
            serious: this.param.C.chargingModule.danger,
            alarmDelay: this.param.C.chargingModule.time,
          });
        } else if (this.activeName == "其他参数") {
          params.push({
            chargingStationId: selected,
            type: 0,
            warning: this.param.another.insulationResistance.warning,
            serious: this.param.another.insulationResistance.danger,
            alarmDelay: this.param.another.insulationResistance.time,
          });
          params.push({
            chargingStationId: selected,
            type: 1,
            warning: this.param.another.leakageCurrent.warning,
            serious: this.param.another.leakageCurrent.danger,
            alarmDelay: this.param.another.leakageCurrent.time,
          });
        }
      }
      const requests = params.map((param) => api.alarmSet.saveOrUpdate(param));
      try {
        const results = await Promise.all(requests);
        const isAllSuccess = results.every((res) => res.data.code == 200);
        if (isAllSuccess) {
          this.$message.success("设置成功");
        }
      } catch (_) {}
    },
  },
  mounted() {
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.chargingStationList = res.data.data;
      }
    });
  },
};
</script>

<style></style>
