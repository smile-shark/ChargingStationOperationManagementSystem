import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import VueAMap from 'vue-amap';
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/tailwind.css'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  key: '7d9bb88bd5808bcd3a8c81baf595340b',
  plugin: [
    'AMap.Autocomplete', // 输入提示插件
    'AMap.PlaceSearch', // POI搜索插件
    'AMap.Scale', // 右下角缩略图插件 比例尺
    'AMap.OverView', // 地图鹰眼插件
    'AMap.ToolBar', // 地图工具条
    'AMap.MapType', // 类别切换控件，实现默认图层与卫星图、实施交通图层之间切换的控制
    'AMap.PolyEditor', // 多边形编辑器插件
    'AMap.CircleEditor', // 圆形编辑器插件
    'AMap.Geolocation' // 定位控件，用来获取和展示用户主机所在的经纬度位置
  ],
  v: '1.4.15', // 高德地图版本号
  uiVersion: '1.0.11' // 地图UI组件库版本号
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
