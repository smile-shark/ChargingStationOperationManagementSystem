<template>
  <div class="charging-station-management">
    <div class="header">
      <h1>充电站管理</h1>
      <el-button type="primary" @click="handleAdd">新增充电站</el-button>
    </div>

    <el-table :data="stations" border style="width: 100%">
      <el-table-column prop="chargingStationId" label="编号" width="320" />
      <el-table-column prop="name" label="名称" width="150" />
      <el-table-column prop="address" label="地址" width="420"/>
      <el-table-column label="负责人" width="100">
        <template slot-scope="{row}">
          {{ operationsPersonnelList.find(p => p.operationsPersonnelId === row.operationsPersonnelId)?.name || '-' }}
        </template>
      </el-table-column>
      <el-table-column label="运营时间" width="180" >
        <template slot-scope="scope">
          {{ scope.row.startTime }} - {{ scope.row.endTime }}
        </template>
      </el-table-column>
      <el-table-column prop="carPileCount" label="汽车桩数" width="100" />
      <el-table-column prop="esPileCount" label="电瓶车桩数" width="100" />
      <el-table-column prop="busPileCount" label="公交车桩数" width="100" />
      <el-table-column prop="state" label="状态" width="100">
        <template slot-scope="{row}">
          <el-tag :type="row.state === 1 ? 'success' : 'danger'">
            {{ row.state === 1 ? '运营中' : '停用中' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right">
        <template slot-scope="{row}">
          <el-button size="small" @click="handleView(row)">详情</el-button>
          <el-button size="small" type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      @current-change="fetchStations"
      @size-change="fetchStations"
    />

    <!-- 编辑/新增对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="isEdit ? '编辑充电站' : '新增充电站'"
      width="50%"
      :append-to-body="true"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      @open="logDialogOpen('EditDialog')"
      @closed="cleanupMaps"
      ref="editDialog"
    >
      <el-form :model="form" label-width="120px">
        <el-form-item label="充电站名称" required>
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="详细地址" required>
          <el-input v-model="form.address" />
        </el-form-item>
        <el-form-item label="坐标位置" required>
          <div class="map-container">
            <div id="map-container" style="height: 300px; width: 100%;"></div>
            <div class="map-controls">
              <div class="coordinate-display">
                经度: {{ form.x }}, 纬度: {{ form.y }}
              </div>
              <el-button 
                type="primary" 
                size="small"
                @click="getCurrentPosition"
                class="location-btn"
              >
                <i class="el-icon-location"></i> 获取当前位置
              </el-button>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="运营时间" required>
          <div class="operation-time">
            <el-time-picker
              v-model="form.startTime"
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="开始时间"
              :disabled="form.is24Hours"
            />
            <span class="separator">至</span>
            <el-time-picker
              v-model="form.endTime"
              format="HH:mm"
              value-format="HH:mm:ss"
              placeholder="结束时间"
              :disabled="form.is24Hours"
            />
            <el-checkbox v-model="form.is24Hours" class="ml-10">24小时营业</el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="状态" required>
          <el-radio-group v-model="form.state">
            <el-radio :label="1">运营中</el-radio>
            <el-radio :label="0">停用中</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="负责人" required>
          <el-select v-model="form.operationsPersonnelId" placeholder="请选择负责人">
            <el-option
              v-for="item in operationsPersonnelList"
              :key="item.operationsPersonnelId"
              :label="item.name"
              :value="item.operationsPersonnelId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="充电站图片">
          <el-upload
            :action="''"
            :http-request="uploadImage"
            :show-file-list="false"
            accept="image/jpeg,image/png"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                上传充电站图片，支持jpg/png格式
              </div>
            </template>
          </el-upload>
          <img v-if="form.picture" :src="form.picture" class="preview-image" />
        </el-form-item>
        <el-form-item label="充电桩配置">
          <div class="pile-config">
            <el-input-number 
              v-model="form.carPileCount" 
              :min="0" 
              :disabled="true"
              controls-position="right"
            />
            <el-input-number 
              v-model="form.esPileCount" 
              :min="0" 
              :disabled="true"
              controls-position="right"
            />
            <el-input-number 
              v-model="form.busPileCount" 
              :min="0" 
              :disabled="true"
              controls-position="right"
            />
          </div>
        </el-form-item>
        <el-form-item label="详细介绍">
          <el-input v-model="form.detail" type="textarea" :rows="3" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>

    <!-- 查看详情对话框 -->
    <el-dialog
      :visible.sync="detailDialogVisible"
      title="充电站详情"
      width="60%"
      :close-on-click-modal="false"
      :append-to-body="true"
      :modal-append-to-body="false"
      :destroy-on-close="true"
      @open="logDialogOpen('DetailDialog')"
      @closed="cleanupMaps"
      ref="detailDialog"
    >
      <el-descriptions v-loading="!currentStation.chargingStationId" :column="1" border>
        <el-descriptions-item label="充电站名称">{{ currentStation.name }}</el-descriptions-item>
        <el-descriptions-item label="详细地址">{{ currentStation.address }}</el-descriptions-item>
        <el-descriptions-item label="负责人">
          {{ operationsPersonnelList.find(p => p.operationsPersonnelId === currentStation.operationsPersonnelId)?.name || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="坐标位置">
          <div class="map-container">
            <div id="detail-map-container" style="height: 300px; width: 100%;"></div>
            <div class="map-controls">
              <div class="coordinate-display">
                经度: {{ currentStation.x }}, 纬度: {{ currentStation.y }}
              </div>
            </div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="运营时间">
          {{ !currentStation.startTime || !currentStation.endTime ? '--' : 
             (currentStation.type === 1 || (currentStation.startTime === '00:00:00' && currentStation.endTime === '00:00:00') ? 
             '24小时营业' : 
             `${currentStation.startTime.substring(0,5)} - ${currentStation.endTime.substring(0,5)}`) }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentStation.state === 1 ? 'success' : 'danger'">
            {{ currentStation.state === 1 ? '运营中' : '停用中' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="充电桩配置">
          <div class="pile-config">
            <div>汽车桩数: {{ currentStation.carPileCount }}</div>
            <div>电瓶车桩数: {{ currentStation.esPileCount }}</div>
            <div>公交车桩数: {{ currentStation.busPileCount }}</div>
          </div>
        </el-descriptions-item>
        <el-descriptions-item label="详细介绍">{{ currentStation.detail }}</el-descriptions-item>
        <el-descriptions-item label="图片">
          <img v-if="currentStation.picture" :src="currentStation.picture" class="preview-image" />
          <span v-else>无图片</span>
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button type="primary" @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import utils from '@/utils'

export default {
  data() {
    return {
      stations: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      dialogVisible: false,
      detailDialogVisible: false,
      isEdit: false,
      currentStation: {},
      operationsPersonnelList: [], // 运营人员列表
      form: {
        name: '',
        address: '',
        startTime: '08:00:00',
        endTime: '18:00:00',
        is24Hours: false,
        state: 1,
        picture: '',
        carPileCount: 0,
        esPileCount: 0,
        busPileCount: 0,
        detail: '',
        x: null,
        y: null,
        operationsPersonnelId: '' // 负责人ID
      },
      map: null,
      marker: null
    }
  },
  methods: {
    async fetchStations() {
      try {
        const response = await api.chargingStation.list(this.currentPage, this.pageSize)
        if (response.data.code === 200) {
          this.stations = response.data.data.records
          this.total = response.data.data.total
        }
      } catch (error) {
        console.error('获取充电站列表失败:', error)
      }
    },
    handleAdd() {
      this.isEdit = false
      this.resetForm()
      this.dialogVisible = true
    },
    handleEdit(station) {
      this.isEdit = true
      this.currentStation = station
      Object.assign(this.form, {
        ...station,
        is24Hours: station.startTime === '00:00:00' && station.endTime === '00:00:00',
        x: station.x,
        y: station.y
      })
      this.dialogVisible = true
    },
    handleView(station) {
      console.log('handleView called with:', station)
      this.currentStation = station
      this.detailDialogVisible = true
      console.log('detailDialogVisible set to:', this.detailDialogVisible)
    },
    async handleDelete(station) {
      try {
        await this.$confirm('确定要删除该充电站吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        
        const response = await api.chargingStation.delete(station.id)
        if (response.data.code === 200) {
          this.$message.success('删除成功')
          this.fetchStations()
        }
      } catch (error) {
        console.error('删除充电站失败:', error)
      }
    },
    async uploadImage(options) {
      this.form.picture = await utils.uploadImage(options)
    },
    async submitForm() {
      // 验证坐标是否已选择
      if (!this.form.x || !this.form.y) {
        this.$message.error('请在地图上选择充电站位置')
        return
      }

      try {
        const submitData = {
          ...this.form,
          startTime: this.form.is24Hours ? '00:00:00' : this.form.startTime,
          endTime: this.form.is24Hours ? '00:00:00' : this.form.endTime,
          x: Number(this.form.x),
          y: Number(this.form.y)
        }
        
        let response
        if (this.isEdit) {
          response = await api.chargingStation.update(submitData)
        } else {
          response = await api.chargingStation.add(submitData)
        }
        
        if (response.data.code === 200) {
          this.$message.success(this.isEdit ? '更新成功' : '添加成功')
          this.dialogVisible = false
          this.fetchStations()
        }
      } catch (error) {
        console.error('提交表单失败:', error)
        this.$message.error(this.isEdit ? '更新失败' : '添加失败')
      }
    },
    resetForm() {
      Object.assign(this.form, {
        name: '',
        address: '',
        startTime: '08:00:00',
        endTime: '18:00:00',
        is24Hours: false,
        state: 1,
        picture: '',
        carPileCount: 0,
        esPileCount: 0,
        busPileCount: 0,
        detail: '',
        x: null,
        y: null,
        operationsPersonnelId: '' // 重置负责人ID
      })
    },
    logDialogOpen(dialogType) {
      console.log(`${dialogType} opened`)
      this.$nextTick(() => {
        if (dialogType === 'EditDialog') {
          this.initMap(true) // 编辑模式，可交互
        } else if (dialogType === 'DetailDialog') {
          this.initDetailMap() // 详情模式，只读
        }
      })
    },

    initDetailMap() {
      if (!window.AMap || !this.currentStation.x || !this.currentStation.y) return
      
      try {
        // 确保容器存在
        const container = document.getElementById('detail-map-container')
        if (!container) return

        // 创建只读地图
        const map = new window.AMap.Map('detail-map-container', {
          zoom: 15,
          center: [this.currentStation.x, this.currentStation.y],
          interactive: false // 禁用交互
        })

        // 添加标记
        new window.AMap.Marker({
          position: [this.currentStation.x, this.currentStation.y],
          map: map,
          title: this.currentStation.name || '充电站位置'
        })
      } catch (error) {
        console.error('初始化详情地图失败:', error)
      }
    },

    getCurrentPosition() {
      if (!window.AMap) {
        this.$message.error('地图API未加载')
        return
      }

      // 显示加载中提示
      const loadingInstance = this.$loading({
        lock: true,
        text: '正在获取位置信息...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })

      // 首先尝试使用浏览器的Geolocation API
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          // 成功回调
          (position) => {
            // 将WGS84坐标转换为高德坐标
            const lng = position.coords.longitude
            const lat = position.coords.latitude
            
            // 使用高德地图的坐标转换接口
            window.AMap.convertFrom([lng, lat], 'gps', (status, result) => {
              loadingInstance.close()
              
              if (status === 'complete' && result.info === 'ok') {
                const lnglat = result.locations[0]
                this.form.x = lnglat.lng
                this.form.y = lnglat.lat
                this.updateMapMarker()
                this.$message.success('定位成功')
              } else {
                // 如果转换失败，直接使用原始坐标
                this.form.x = lng
                this.form.y = lat
                this.updateMapMarker()
                this.$message.success('定位成功（使用原始坐标）')
              }
            })
          },
          // 错误回调
          (error) => {
            loadingInstance.close()
            
            // 如果浏览器定位失败，尝试使用高德定位
            this.fallbackToAMapGeolocation()
            
            // 显示错误信息
            let errorMsg = '浏览器定位失败: '
            switch(error.code) {
              case error.PERMISSION_DENIED:
                errorMsg += '用户拒绝了位置请求。请在浏览器设置中允许位置访问。'
                break
              case error.POSITION_UNAVAILABLE:
                errorMsg += '位置信息不可用。'
                break
              case error.TIMEOUT:
                errorMsg += '获取位置超时。'
                break
              default:
                errorMsg += '未知错误。'
            }
            console.warn(errorMsg)
          },
          // 选项
          {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
          }
        )
      } else {
        loadingInstance.close()
        this.fallbackToAMapGeolocation()
      }
    },
    
    fallbackToAMapGeolocation() {
      this.$message.info('正在使用备选定位方式...')
      
      const geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
        convert: true // 自动偏移坐标
      })

      geolocation.getCurrentPosition((status, result) => {
        if (status === 'complete') {
          this.form.x = result.position.lng
          this.form.y = result.position.lat
          this.updateMapMarker()
          this.$message.success('定位成功')
        } else {
          this.$message({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: `
              <p>定位失败: ${result.message}</p>
              <p>您可以通过以下方式手动设置位置：</p>
              <ul>
                <li>直接在地图上点击选择位置</li>
                <li>确保已允许浏览器获取位置权限</li>
                <li>检查网络连接是否正常</li>
              </ul>
            `
          })
        }
      })
    },
    
    initMap(interactive = true) {
      // 确保高德地图API已加载
      if (!window.AMap) {
        console.error('高德地图API未加载')
        this.$message.error('地图加载失败，请刷新页面重试')
        return
      }

      try {
        // 安全地销毁之前的地图实例
        if (this.map) {
          // 先移除所有覆盖物
          if (this.marker) {
            this.map.remove(this.marker)
            this.marker = null
          }
          // 销毁地图实例
          this.map.destroy()
          this.map = null
        }

        // 确保容器元素存在
        const container = document.getElementById('map-container')
        if (!container) {
          console.error('地图容器元素不存在')
          return
        }

        // 创建新的地图实例
        this.map = new window.AMap.Map('map-container', {
          zoom: 13,
          center: [this.form.x || 104.06, this.form.y || 30.67], // 默认成都中心
          interactive: interactive // 控制是否可交互
        })

        // 如果是可交互模式，添加点击事件
        if (interactive) {
          this.map.on('click', this.handleMapClick)
        }

        // 如果有坐标，添加标记
        if (this.form.x && this.form.y) {
          this.updateMapMarker()
        }
      } catch (error) {
        console.error('初始化地图失败:', error)
        this.$message.error('初始化地图失败，请刷新页面重试')
      }
    },
    
    handleMapClick(e) {
      // 更新坐标
      this.form.x = e.lnglat.getLng()
      this.form.y = e.lnglat.getLat()
      
      // 更新标记
      this.updateMapMarker()
    },
    
    updateMapMarker() {
      // 确保地图实例存在
      if (!this.map || !window.AMap) return
      
      try {
        // 安全地移除之前的标记
        if (this.marker) {
          try {
            this.map.remove(this.marker)
          } catch (e) {
            console.warn('移除标记失败:', e)
          }
          this.marker = null
        }
        
        // 确保坐标有效
        if (!this.form.x || !this.form.y) {
          console.warn('坐标无效，无法创建标记')
          return
        }
        
        // 创建新标记
        this.marker = new window.AMap.Marker({
          position: [this.form.x, this.form.y],
          title: this.form.name || '充电站位置'
        })
        
        // 添加到地图
        this.map.add(this.marker)
        
        // 将视图中心移动到标记位置
        this.map.setCenter([this.form.x, this.form.y])
      } catch (error) {
        console.error('更新地图标记失败:', error)
      }
    },
    
    cleanupMaps() {
      // 清理编辑地图
      if (this.map) {
        if (this.marker) {
          this.map.remove(this.marker)
          this.marker = null
        }
        this.map.destroy()
        this.map = null
      }
      
      // 清理详情地图（如果有）
      const detailMapContainer = document.getElementById('detail-map-container')
      if (detailMapContainer && detailMapContainer.__amap_api_instance) {
        detailMapContainer.__amap_api_instance.destroy()
      }
    },
    
    // 获取运营人员列表
    async fetchOperationsPersonnel() {
      try {
        const response = await api.operationsPersonnel.simpleList()
        if (response.data.code === 200) {
          this.operationsPersonnelList = response.data.data
        } else {
          console.error('获取运营人员列表失败:', response.data.msg)
        }
      } catch (error) {
        console.error('获取运营人员列表失败:', error)
      }
    }
  },
  mounted() {
    this.fetchStations()
    this.fetchOperationsPersonnel()
  },
  
  beforeDestroy() {
    // 清理地图实例
    this.cleanupMaps()
  },
  
  watch: {
    'form.is24Hours': {
      handler(newValue) {
        if (newValue) {
          // 如果勾选了24小时营业，设置为00:00:00
          this.form.startTime = '00:00:00'
          this.form.endTime = '00:00:00'
        } else {
          // 如果取消勾选，恢复默认时间
          this.form.startTime = '08:00:00'
          this.form.endTime = '18:00:00'
        }
      },
      immediate: false
    }
  }
}
</script>

<style>
@import '@/css/charging-station-management.css';
</style>