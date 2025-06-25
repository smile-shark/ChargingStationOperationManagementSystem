<template>
  <div class="dashboard-container">
    <!-- 顶部概览卡片 -->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日收益</span>
          </div>
          <div class="stat-card">
            <div class="stat-value">¥12,580</div>
            <div class="stat-desc">较昨日 <span class="text-success">+12.5%</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>充电订单</span>
          </div>
          <div class="stat-card">
            <div class="stat-value">286</div>
            <div class="stat-desc">较昨日 <span class="text-success">+8.3%</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>设备在线率</span>
          </div>
          <div class="stat-card">
            <div class="stat-value">96.8%</div>
            <div class="stat-desc">较昨日 <span class="text-danger">-1.2%</span></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>充电时长</span>
          </div>
          <div class="stat-card">
            <div class="stat-value">1,245h</div>
            <div class="stat-desc">较昨日 <span class="text-success">+5.2%</span></div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 收益趋势 折线图 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>收益趋势分析</span>
             
          </div>
          <div id="incomeTrendChart" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
      
      <!-- 设备利用率 柱状图 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>设备利用率分析</span>
             
          </div>
          <div id="deviceUtilChart" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 站点对比分析 雷达图 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>站点对比分析</span>
             
          </div>
          <div id="siteCompareChart" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
      
      <!-- 告警统计 饼图 -->
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>告警统计</span>
             
          </div>
          <div id="alarmChart" style="width: 100%; height: 300px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'

export default {
  data() {
    return {
      // 模拟数据
      chartData: {
        incomeTrend: {
          xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
          data: [42000, 52000, 45000, 52000, 48000, 58000]
        },
        deviceUtil: {
          xAxis: ['站点A', '站点B', '站点C', '站点D', '站点E', '站点F'],
          data: [85, 92, 78, 96, 88, 90]
        },
        siteCompare: {
          indicators: [
            { name: '充电效率', max: 100 },
            { name: '设备稳定性', max: 100 },
            { name: '用户满意度', max: 100 },
            { name: '能源利用率', max: 100 },
            { name: '维护成本', max: 100 }
          ],
          sites: [
            { name: '站点A', value: [85, 92, 88, 86, 75] },
            { name: '站点B', value: [92, 88, 95, 82, 80] },
            { name: '站点C', value: [78, 90, 85, 90, 88] }
          ]
        },
        alarm: {
          data: [
            { value: 65, name: '正常' },
            { value: 20, name: '警告' },
            { value: 10, name: '故障' },
            { value: 5, name: '严重故障' }
          ]
        }
      }
    }
  },
  mounted() {
    // 等待DOM渲染完成后初始化图表
    this.$nextTick(() => {
      this.initIncomeTrendChart()
      this.initDeviceUtilChart()
      this.initSiteCompareChart()
      this.initAlarmChart()
      
      // 监听窗口大小变化，调整图表尺寸
      window.addEventListener('resize', () => {
        this.resizeCharts()
      })
    })
  },
  beforeDestroy() {
    // 组件销毁前释放图表资源
    window.removeEventListener('resize', this.resizeCharts)
    this.disposeCharts()
  },
  methods: {
    // 初始化收益趋势折线图
    initIncomeTrendChart() {
      const chart = echarts.init(document.getElementById('incomeTrendChart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          textStyle: {
            fontSize: 12,
            color: '#fff' // 设置tooltip文字为白色
          },
          formatter: function (params) {
            const month = params[0].axisValue
            const income = params[0].data
            return `${month}<br/>收益: ${income.toLocaleString()} 元`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%', // 增加底部间距，避免数据与底边太近
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.chartData.incomeTrend.xAxis,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#e6e6e6'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          },
          axisLabel: {
            formatter: function (value) {
              if (value >= 10000) {
                return (value / 10000).toFixed(1) + '万';
              }
              return value;
            }
          }
        },
        series: [
          {
            name: '收益',
            type: 'line',
            data: this.chartData.incomeTrend.data,
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            itemStyle: {
              color: '#409EFF'
            },
            lineStyle: {
              width: 3,
              color: '#409EFF'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: 'rgba(64, 158, 255, 0.4)' },
                  { offset: 1, color: 'rgba(64, 158, 255, 0)' }
                ]
              }
            }
          }
        ]
      }
      
      chart.setOption(option)
      this.incomeTrendChart = chart
    },
    
    // 初始化设备利用率柱状图
    initDeviceUtilChart() {
      const chart = echarts.init(document.getElementById('deviceUtilChart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          textStyle: {
            fontSize: 12,
            color: '#fff' // 设置tooltip文字为白色
          },
          formatter: function (params) {
            const site = params[0].axisValue
            const util = params[0].data
            return `${site}<br/>利用率: ${util}%`
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%', // 增加底部间距
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: this.chartData.deviceUtil.xAxis,
          axisTick: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#e6e6e6'
            }
          }
        },
        yAxis: {
          type: 'value',
          min: 0,
          max: 100,
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          splitLine: {
            lineStyle: {
              color: '#f0f0f0'
            }
          },
          axisLabel: {
            formatter: '{value}%'
          }
        },
        series: [
          {
            name: '设备利用率',
            type: 'bar',
            barWidth: '40%',
            data: this.chartData.deviceUtil.data,
            itemStyle: {
              borderRadius: [4, 4, 0, 0],
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  { offset: 0, color: '#67C23A' },
                  { offset: 1, color: '#4CAF50' }
                ]
              }
            }
          }
        ]
      }
      
      chart.setOption(option)
      this.deviceUtilChart = chart
    },
    
    // 初始化站点对比雷达图
    initSiteCompareChart() {
      const chart = echarts.init(document.getElementById('siteCompareChart'))
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          textStyle: {
            fontSize: 12,
            color: '#fff' // 设置tooltip文字为白色
          }
        },
        radar: {
          indicator: this.chartData.siteCompare.indicators,
          shape: 'circle',
          radius: '70%',
          axisName: {
            color: '#606266',
            fontSize: 12
          },
          splitLine: {
            lineStyle: {
              color: '#e6e6e6'
            }
          },
          splitArea: {
            show: true,
            areaStyle: {
              color: ['rgba(255, 255, 255, 0.1)', 'rgba(240, 240, 240, 0.1)']
            }
          }
        },
        series: [
          {
            name: '站点对比',
            type: 'radar',
            data: this.chartData.siteCompare.sites.map(site => ({
              value: site.value,
              name: site.name,
              areaStyle: {
                opacity: 0.2
              }
            })),
            itemStyle: {
              emphasis: {
                opacity: 1
              }
            },
            lineStyle: {
              width: 2
            },
            symbol: 'circle',
            symbolSize: 6
          }
        ]
      }
      
      chart.setOption(option)
      this.siteCompareChart = chart
    },
    
    // 初始化告警统计饼图
    initAlarmChart() {
      const chart = echarts.init(document.getElementById('alarmChart'))
      const option = {
        tooltip: {
          trigger: 'item',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: 10,
          textStyle: {
            fontSize: 12,
            color: '#fff' // 设置tooltip文字为白色
          },
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: '10%',
          top: 'center',
          itemWidth: 10,
          itemHeight: 10,
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '告警分布',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['35%', '50%'],
            data: this.chartData.alarm.data,
            itemStyle: {
              borderRadius: 4,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              formatter: '{b}: {d}%'
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      
      chart.setOption(option)
      this.alarmChart = chart
    },
    
    // 调整所有图表尺寸
    resizeCharts() {
      if (this.incomeTrendChart) this.incomeTrendChart.resize()
      if (this.deviceUtilChart) this.deviceUtilChart.resize()
      if (this.siteCompareChart) this.siteCompareChart.resize()
      if (this.alarmChart) this.alarmChart.resize()
    },
    
    // 释放图表资源
    disposeCharts() {
      if (this.incomeTrendChart) this.incomeTrendChart.dispose()
      if (this.deviceUtilChart) this.deviceUtilChart.dispose()
      if (this.siteCompareChart) this.siteCompareChart.dispose()
      if (this.alarmChart) this.alarmChart.dispose()
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: #f5f7fa;
}

.box-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.stat-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding-left: 20px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}

.stat-desc {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

.text-success {
  color: #67C23A;
}

.text-danger {
  color: #F56C6C;
}
</style>  