<template>
  <div style="width: 100%; height: 100%; position: relative">
    <el-amap ref="amap" :center="center" :zoom="13" class="amap">
      <el-amap-marker
        v-for="(chargingStation, index) in chargingStationList"
        :key="index"
        :position="utils.pointToAry(chargingStation)"
        :icon="utils.point"
        :events="{
          click: (e) => handleMarkerClick(chargingStation),
        }"
      >
      </el-amap-marker>
    </el-amap>
    <div class="left-search">
      <div class="g-title">充电站搜索</div>
      <el-input
        placeholder="搜索充电站..."
        v-model="name"
        clearable
        class="g-t-b"
      >
      </el-input>
      <!-- 遍历渲染充电站列表 -->
      <div
        class="charging-station-item"
        v-for="(chargingStation, index) in chargingStationList"
        :key="index"
        @click="toPoint(chargingStation)"
      >
        <span class="dot"></span>
        <span class="station-name">{{ chargingStation.name }}</span>
      </div>
    </div>
    <div
      class="right-info-1 p-4 bg-white rounded-lg shadow-md"
      @click="
        $router.push('/stationaryPostureManagement/ChargingStationManagement')
      "
    >
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
        <div class="ml-4">
          <p class="text-gray-500">充电站总数</p>
          <p class="text-2xl font-bold">{{ chargingStationCount }}</p>
        </div>
      </div>
    </div>
    <div
      class="right-info-2 p-4 bg-white rounded-lg shadow-md mt-4"
      @click="
        $router.push('/stationaryPostureManagement/ChargingPileManagement')
      "
    >
      <div class="flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8 text-green-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <div class="ml-4">
          <p class="text-gray-500">充电桩总数</p>
          <p class="text-2xl font-bold">{{ chargingPileCount }}</p>
        </div>
      </div>
    </div>
    <!-- 充电站详情卡片 -->
    <div
      v-if="chargingStation"
      class="right-info-3 p-4 bg-white rounded-lg shadow-md mt-4"
      style="position: absolute; top: 8rem; right: 1rem; width: 300px"
    >
      <h3 class="text-lg font-bold mb-2">{{ chargingStation.name }}</h3>
      <div class="space-y-2">
        <div v-if="chargingStation.address" class="flex items-start">
          <span class="text-gray-500 w-20">地址:</span>
          <span>{{ chargingStation.address }}</span>
        </div>
        <div v-if="chargingStation.state !== null" class="flex items-start">
          <span class="text-gray-500 w-20">状态:</span>
          <span>{{ chargingStation.state === 1 ? "运营中" : "维护中" }}</span>
        </div>
        <div
          v-if="chargingStation.carPileCount !== null"
          class="flex items-start"
        >
          <span class="text-gray-500 w-20">汽车桩:</span>
          <span>{{ chargingStation.carPileCount }}</span>
        </div>
        <div
          v-if="chargingStation.esPileCount !== null"
          class="flex items-start"
        >
          <span class="text-gray-500 w-20">电动车桩:</span>
          <span>{{ chargingStation.esPileCount }}</span>
        </div>
        <div
          v-if="chargingStation.busPileCount !== null"
          class="flex items-start"
        >
          <span class="text-gray-500 w-20">公交桩:</span>
          <span>{{ chargingStation.busPileCount }}</span>
        </div>
        <div v-if="chargingStation.startTime" class="flex items-start">
          <span class="text-gray-500 w-20">营业时间:</span>
          <span
            >{{ chargingStation.startTime }} -
            {{ chargingStation.endTime }}</span
          >
        </div>
        <div
          v-if="chargingStation.x && chargingStation.y"
          class="flex items-start"
        >
          <span class="text-gray-500 w-20">坐标:</span>
          <span
            >{{ chargingStation.x.toFixed(6) }},
            {{ chargingStation.y.toFixed(6) }}</span
          >
        </div>
        <div class="mt-4 text-right">
          <el-link
            type="primary"
            :underline="false"
            @click="showChargingPileDialog"
          >
            查看详情 &gt;
          </el-link>
        </div>

        <el-dialog
          title="充电桩列表"
          :visible.sync="dialogVisible"
          width="70%"
          top="5vh"
        >
          <div class="status-stats grid grid-cols-5 gap-4 mb-4">
            <div
              v-for="(stat, index) in statusStats"
              :key="index"
              class="bg-white p-4 rounded-lg shadow-sm"
            >
              <div class="flex items-center">
                <div
                  :class="`w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mr-4`"
                >
                  <i :class="`${stat.icon} text-white text-xl`"></i>
                </div>
                <div>
                  <p class="text-gray-500 text-sm">{{ stat.label }}</p>
                  <p class="text-2xl font-bold">{{ stat.count }}</p>
                </div>
              </div>
            </div>
          </div>

          <el-table
            :data="chargingPileList"
            v-loading="loading"
            style="width: 100%"
          >
            <el-table-column prop="name" label="充电桩名称"></el-table-column>
            <el-table-column prop="inPosition" label="位置"></el-table-column>
            <el-table-column prop="power" label="功率(kW)"></el-table-column>
            <el-table-column
              prop="chargingGunCount"
              label="枪数量"
            ></el-table-column>
            <el-table-column prop="state" label="状态">
              <template slot-scope="scope">
                <el-tag :type="scope.row.state === 1 ? 'success' : 'danger'">
                  {{ scope.row.state === 1 ? "正常" : "故障" }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>

          <div class="pagination-container">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="pagination.page"
              :page-size="pagination.size"
              layout="total, prev, pager, next"
              :total="pagination.total"
            ></el-pagination>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import utils from "@/utils";
import api from "@/api";
import { number } from "echarts";
export default {
  data() {
    return {
      // 统计数据
      utils,
      name: "",
      center: [116.397428, 40],
      chargingStationList: null,
      chargingStation: null,
      chargingStationCount: 0,
      chargingPileCount: 0,
      chargingPileList: [],
      dialogVisible: false,
      loading: false,
      pagination: {
        page: 1,
        size: 10,
        total: 0,
      },
      statusStats: [
        {
          label: "充电中",
          count: 0,
          color: "bg-blue-500",
          icon: "el-icon-lightning",
        },
        {
          label: "空闲",
          count: 0,
          color: "bg-green-500",
          icon: "el-icon-success",
        },
        {
          label: "离线",
          count: 0,
          color: "bg-gray-500",
          icon: "el-icon-connection",
        },
        {
          label: "故障",
          count: 0,
          color: "bg-red-500",
          icon: "el-icon-warning",
        },
        {
          label: "总计",
          count: 0,
          color: "bg-purple-500",
          icon: "el-icon-office-building",
        },
      ],
    };
  },
  methods: {
    toPoint(chargingStation) {
      this.center = utils.pointToAry(chargingStation);
    },
    handleMarkerClick(chargingStation) {
      this.chargingStation = chargingStation;
    },
    getchargingPileList(page) {
      if (typeof page !== "number") {
        this.pagination.page = 1;
      } else {
        this.pagination.page = page;
      }

      if (!this.chargingStation) return;

      this.loading = true;
      api.chargingPile
        .listByChargingStationId({
          page: this.pagination.page,
          size: this.pagination.size,
          chargingStationId: this.chargingStation.chargingStationId,
        })
        .then((res) => {
          if (res.data.code === 200) {
            this.chargingPileList = res.data.data.records;
            this.pagination.total = res.data.data.total;
            this.updateStatusStats();
          }
        })
        .catch((err) => {
          this.$message.error("获取充电桩列表失败");
          console.error(err);
        })
        .finally(() => {
          this.loading = false;
        });
    },

    showChargingPileDialog() {
      this.dialogVisible = true;
      this.getchargingPileList();
    },

    handleCurrentChange(page) {
      this.pagination.page = page;
      this.getchargingPileList(page);
    },

    updateStatusStats() {
      const stats = [0, 0, 0, 0];
      this.chargingPileList.forEach((item) => {
        if (item.state >= 0 && item.state <= 3) {
          stats[item.state]++;
        }
      });

      const total = stats.reduce((sum, count) => sum + count, 0);

      this.statusStats = [
        {
          label: "充电中",
          count: stats[0],
          color: "bg-blue-500",
          icon: "el-icon-lightning",
        },
        {
          label: "空闲",
          count: stats[1],
          color: "bg-green-500",
          icon: "el-icon-success",
        },
        {
          label: "离线",
          count: stats[2],
          color: "bg-gray-500",
          icon: "el-icon-connection",
        },
        {
          label: "故障",
          count: stats[3],
          color: "bg-red-500",
          icon: "el-icon-warning",
        },
        {
          label: "总计",
          count: total,
          color: "bg-purple-500",
          icon: "el-icon-office-building",
        },
      ];
    },
  },
  mounted() {
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.chargingStationList = res.data.data;
        this.chargingStationCount = this.chargingStationList.length;
        if (this.chargingStationCount > 0) {
          this.center = utils.pointToAry(this.chargingStationList[0]);
        }
      }
    });
    api.chargingPile.count().then((res) => {
      if (res.data.code == 200) {
        this.chargingPileCount = res.data.data;
      }
    });
  },
};
</script>

<style scoped lang="scss">
@import "@/css/global.scss";

.status-stats {
  &.grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .bg-white {
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  }

  .bg-blue-500 {
    background-color: #3b82f6;
  }
  .bg-green-500 {
    background-color: #10b981;
  }
  .bg-gray-500 {
    background-color: #6b7280;
  }
  .bg-red-500 {
    background-color: #ef4444;
  }
  .bg-purple-500 {
    background-color: #8b5cf6;
  }
}
.left-search {
  padding: 1rem;
  border-radius: 0.5rem;
  // width: 12rem;
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: rgb(255 255 255 / 0.8);
}
.right-info-1 {
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 3rem;
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: white;
  cursor: pointer;
}
.right-info-2 {
  padding: 1rem;
  border-radius: 0.5rem;
  min-width: 3rem;
  position: absolute;
  top: 0rem;
  right: 12rem;
  background-color: white;
  cursor: pointer;
}
/* 充电站列表项样式 */
.charging-station-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
.charging-station-item:hover {
  background-color: #f8f9fa;
}
/* 绿色小圆点 */
.dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #4caf50;
  margin-right: 8px;
}
/* 充电站名称样式 */
.station-name {
  color: #333;
  font-size: 1rem;
}
</style>
