<template>
  <div class="home-container">
    <!-- 顶部统计信息 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-title">充电次数</div>
          <div class="stat-value">128</div>
          <div class="stat-rate">+12.5%</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-title">充电电量(kWh)</div>
          <div class="stat-value">2560</div>
          <div class="stat-rate">+8.2%</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="stat-card">
          <div class="stat-title">充电金额(元)</div>
          <div class="stat-value">5120</div>
          <div class="stat-rate">+15.3%</div>
        </div>
      </el-col>
    </el-row>
    <!-- 趋势图表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-title">充电金额趋势</div>
          <div class="chart-container" id="amountChart"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-title">充电电量趋势</div>
          <div class="chart-container" id="powerChart"></div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="chart-card">
          <div class="chart-title">充电次数趋势</div>
          <div class="chart-container" id="countChart"></div>
        </div>
      </el-col>
    </el-row>
    <!-- 新增客户环比分析（双柱状图） -->
    <div class="chart-card" style="margin-top: 20px;">
      <div class="chart-title">新增客户环比分析</div>
      <div class="chart-container" id="customerChart"></div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'; 
export default {
  data() {
    return {
      charts: [] // 存储图表实例
    }
  },
  mounted() {
    this.initCharts();
    window.addEventListener('resize', this.resizeCharts);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeCharts);
    this.disposeCharts();
  },
  methods: {
    initCharts() {
      // 初始化所有图表
      this.initAmountChart();
      this.initPowerChart();
      this.initCountChart();
      this.initCustomerChart();
    },
    // 初始化充电金额趋势图表
    initAmountChart() {
      const chartDom = document.getElementById('amountChart');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          textStyle: { color: '#333' },
          borderColor: '#eee'
        },
        xAxis: {
          type: 'category',
          data: ['0:00','2:00','4:00','6:00','8:00','11:00','14:00','17:00','20:00','23:00'],
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            data: [1200,1000,800,1400,400,1100,1000,1000,900,800], 
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#409EFF'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(64, 158, 255, 0.3)' 
                }, {
                  offset: 1, color: 'rgba(64, 158, 255, 0)' 
                }]
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      this.charts.push(myChart);
    },
    // 初始化充电电量趋势图表
    initPowerChart() {
      const chartDom = document.getElementById('powerChart');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          textStyle: { color: '#333' },
          borderColor: '#eee'
        },
        xAxis: {
          type: 'category',
          data: ['0:00','2:00','4:00','6:00','8:00','11:00','14:00','17:00','20:00','23:00'],
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            data: [400,500,300,700,200,600,300,300,250,300], 
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#67C23A'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(103, 194, 58, 0.3)' 
                }, {
                  offset: 1, color: 'rgba(103, 194, 58, 0)' 
                }]
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      this.charts.push(myChart);
    },
    // 初始化充电次数趋势图表
    initCountChart() {
      const chartDom = document.getElementById('countChart');
      const myChart = echarts.init(chartDom);
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          textStyle: { color: '#333' },
          borderColor: '#eee'
        },
        xAxis: {
          type: 'category',
          data: ['0:00','2:00','4:00','6:00','8:00','11:00','14:00','17:00','20:00','23:00'],
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            data: [50,20,40,60,20,50,30,30,40,60], 
            type: 'line',
            smooth: true,
            itemStyle: {
              color: '#E6A23C'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0, y: 0, x2: 0, y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(230, 162, 60, 0.3)' 
                }, {
                  offset: 1, color: 'rgba(230, 162, 60, 0)' 
                }]
              }
            }
          }
        ]
      };
      myChart.setOption(option);
      this.charts.push(myChart);
    },
    // 初始化新增客户环比分析图表（双柱状图）
    initCustomerChart() {
      const chartDom = document.getElementById('customerChart');
      const myChart = echarts.init(chartDom);
      
      // 使用合法的变量名
      const growthRateData = [70,10,10,80,5,70,60,45,60,30,40,5,10,40,25,70,55,65,50,45,0,50,50,20];
      
      // 计算实际增长值（假设基值为100）
      const actualGrowthData = growthRateData.map(value => 100 * (value / 100));
      
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.9)',
          textStyle: { color: '#333' },
          borderColor: '#eee',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          },
          formatter: function(params) {
            let result = `<div style="font-weight:bold">${params[0].name}</div>`;
            params.forEach(item => {
              if (item.seriesName === '环比增长率') {
                result += `<div>${item.seriesName}: ${item.value}%</div>`;
              } else {
                result += `<div>${item.seriesName}: ${item.value}</div>`;
              }
            });
            return result;
          }
        },
        legend: {
          data: ['新增用户', '环比增长率'],
          top: '5%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['0:00','1:00','2:00','3:00','4:00','5:00','6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
        },
        yAxis: {
          type: 'value',
          name: '用户数量',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            name: '新增用户',
            type: 'bar',
            data: [45,40,40,45,38,70,62,55,58,45,45,45,30,22,58,28,50,52,50,32,25,30,25,40],
            color: '#409EFF',
            barWidth: '35%',
            label: {
              show: true,
              position: 'top'
            }
          },
          {
            name: '环比增长率',
            type: 'bar',
            data: actualGrowthData,
            color: '#F56C6C',
            barWidth: '35%',
            label: {
              show: true,
              position: 'top',
              formatter: function(params) {
                return `${growthRateData[params.dataIndex]}%`;
              }
            }
          }
        ]
      };
      
      myChart.setOption(option);
      this.charts.push(myChart);
    },
    // 调整图表大小
    resizeCharts() {
      this.charts.forEach(chart => {
        chart.resize();
      });
    },
    // 销毁图表实例
    disposeCharts() {
      this.charts.forEach(chart => {
        chart.dispose();
      });
      this.charts = [];
    }
  }
}
</script>

<style scoped lang="scss">
@import '@/css/home.scss';
</style>