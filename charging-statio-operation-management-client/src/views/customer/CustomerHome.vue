<template>
  <div>
    <transition name="fade" @after-leave="handleAfterLeave">
      <div v-if="!main.earth.data" class="top-page">
        已加载{{ main.earth.finsihed }} MB
      </div>
    </transition>
    <transition name="fade" @after-enter="handleAfterEnter">
      <div v-if="toChild" class="top-page"></div>
    </transition>
    <div ref="mainCanvas" style="height: 100vh; width: 100vw"></div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  CSS2DRenderer,
  CSS2DObject,
} from "three/examples/jsm/renderers/CSS2DRenderer";
import api from "@/api";
import gsap from "gsap";
export default {
  data() {
    return {
      toChild: false,
      clickedChargingStationId: null,
      chargingStationList: [],
      backgroundMesh: null,
      modelLoader: null,
      loader: null,
      main: {
        camera: null,
        scene: null,
        renderer: null,
        background: null,
        controls: null,
        earth: {
          data: null,
          finsihed: 0,
        },
        light: null,
      },
      labelRenderer: null,
      markers: [], // 标记点数组
    };
  },
  methods: {
    animation() {
      requestAnimationFrame(this.animation);

      // 旋转背景球体（如果已加载）
      if (this.backgroundMesh) {
        this.backgroundMesh.rotation.y += 0.0005; // 调整这个值可以改变旋转速度
      }
      // 更新光源位置，使其始终位于相机的右上方（相机局部坐标系）
      // 计算相机的右向量和上向量
      const cameraRight = new THREE.Vector3(1, 0, 0).applyQuaternion(
        this.main.camera.quaternion
      );
      const cameraUp = new THREE.Vector3(0, 1, 0).applyQuaternion(
        this.main.camera.quaternion
      );
      // 将光源位置设置为相机位置加上右向量和上向量的组合
      this.main.light.position
        .copy(this.main.camera.position)
        .add(cameraRight.multiplyScalar(200)) // 向右偏移
        .add(cameraUp.multiplyScalar(150)); // 向上偏移

      if (this.main.earth.data) {
        this.renderer.render(this.scene, this.main.camera);
        this.labelRenderer.render(this.scene, this.main.camera);
        this.main.controls.update();
      }
    },
    geoToCartesian(lat, lng, radius) {
      const latRad = THREE.MathUtils.degToRad(lat);
      const lngRad = THREE.MathUtils.degToRad(lng);

      // 修正：将经度取反（-lngRad）以匹配地理坐标方向
      const x = radius * Math.cos(latRad) * Math.cos(-lngRad); // 注意：-lngRad
      const y = radius * Math.sin(latRad);
      const z = radius * Math.cos(latRad) * Math.sin(-lngRad); // 注意：-lngRad

      return new THREE.Vector3(x, y, z);
    },
    animateCamera() {
      gsap.to(this.main.camera.position, {
        x: -3.92921191836185,
        y: 10.014774975749047,
        z: -15.374228787393745,
        duration: 2,
        ease: "power1.inOut",
      });
    },
    createLabel(data) {
      const position = this.geoToCartesian(data.y, data.x, 11);
      // 创建标签
      const container = document.createElement("div");
      container.style.pointerEvents = "none"; // 容器不拦截事件

      const point = document.createElement("div");
      point.style.width = "10px";
      point.style.height = "10px";
      point.style.backgroundColor = "red";
      point.style.borderRadius = "50%";
      point.style.margin = "5px";
      point.style.marginLeft = "49%";
      point.style.pointerEvents = "auto"; // 允许点击

      const div = document.createElement("div");
      div.textContent = data.name;
      div.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
      div.style.color = "white";
      div.style.padding = "5px 10px";
      div.style.borderRadius = "5px";
      div.style.fontSize = ".6rem";
      div.style.whiteSpace = "nowrap";
      div.style.pointerEvents = "auto"; // 允许点击
      container.appendChild(div);
      container.appendChild(point);

      // 事件
      div.addEventListener("click", () => {
        console.log(data.name);
        this.clickedChargingStationId = data.chargingStationId;
        this.moveToTarget(position);
      });
      point.addEventListener("click", () => {
        console.log(data.name);
        this.clickedChargingStationId = data.chargingStationId;
        this.moveToTarget(position);
      });

      // 创建CSS2D
      const label = new CSS2DObject(container);
      label.position.copy(position);
      label.position.multiplyScalar(1.05);
      this.scene.add(label);
      this.markers.push(label);
    },
    init3D() {
      this.modelLoader = new GLTFLoader();
      this.loader = new THREE.TextureLoader();

      const container = this.$refs.mainCanvas;
      // 初始化
      this.main.camera = new THREE.PerspectiveCamera(
        45,
        container.clientWidth / container.clientHeight,
        0.1,
        1000
      );
      this.main.camera.position.set(0, 20, 20);

      this.scene = new THREE.Scene();

      // 创建一个巨大的球体作为背景
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      // 球体需要从内部渲染
      geometry.scale(-1, 1, 1);

      // 光源 - 设置为平行光，模拟太阳光
      this.main.light = new THREE.DirectionalLight(0xffffff, 2); // 降低强度为2
      this.main.light.position.copy(this.main.camera.position);
      this.main.light.position.add(new THREE.Vector3(20, 10, 0)); // 设置在相机右上方

      // 创建光源目标点，确保光线始终指向地球中心
      this.main.light.target = new THREE.Object3D();
      this.main.light.target.position.set(0, 0, 0); // 目标点设置在原点（地球中心）
      this.scene.add(this.main.light.target);
      this.scene.add(this.main.light);

      const loader = new EXRLoader();
      loader.load("./images/space.exr", (background) => {
        background.mapping = THREE.EquirectangularReflectionMapping;
        this.background = background;

        // 创建背景球体材质和网格
        const material = new THREE.MeshBasicMaterial({
          map: background,
        });
        this.backgroundMesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.backgroundMesh);

        // 设置环境贴图
        this.scene.environment = this.background;
      });

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
      });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(this.renderer.domElement);

      // 加载地球(半径11-12之间更趋近11)
      this.modelLoader.load(
        "./model/earth.glb",
        (earth) => {
          earth.scene.scale.set(10, 10, 10);
          earth.scene.rotation.set(-0.02, 179.078, 0);
          this.main.earth.data = earth.scene;
          this.scene.add(this.main.earth.data);
          // const eartGeo=new THREE.SphereGeometry(11, 60, 40)
          // const eartTexture=this.loader.load('./images/earth.jpg')
          // console.log(eartTexture)
          // const material=new THREE.MeshStandardMaterial({
          //       map:eartTexture,
          // })
          // const earthMesh=new THREE.Mesh(eartGeo,material)
          // this.scene.add(earthMesh)
          // this.main.earth.data=earthMesh
        },
        (xhr) => {
          // 即使total为0，我们仍然可以显示已加载的字节数
          const loadedMB = (xhr.loaded / (1024 * 1024)).toFixed(2);
          this.main.earth.finsihed = loadedMB;
        },
        (error) => {
          console.error("地球模型加载出错:", error);
        }
      );

      this.main.controls = new OrbitControls(
        this.main.camera,
        this.renderer.domElement
      );

      // 添加一个辅助坐标
      // const axesHelper = new THREE.AxesHelper(200);
      // this.scene.add(axesHelper);
      // 初始化CSS2D渲染器
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(container.clientWidth, container.clientHeight);
      this.labelRenderer.domElement.style.position = "absolute";
      this.labelRenderer.domElement.style.top = 0;
      this.labelRenderer.domElement.style.pointerEvents = "none"; // 父容器不拦截事件
      container.appendChild(this.labelRenderer.domElement);
      this.animation();
    },
    handleAfterLeave() {
      this.animateCamera();
    },
    handleAfterEnter() {
      this.$router.push({
        name: "CustomerChargingStation",
        params: {
          chargingStationId: this.clickedChargingStationId,
        },
      });
    },
    moveToTarget(position) {
      gsap.to(this.main.camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 0.5,
        ease: "power1.inOut",
      });
      this.toChild = true;
    },
  },
  mounted() {
    this.init3D();
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.chargingStationList = res.data.data;
        for (let chargingStation of this.chargingStationList) {
          this.createLabel(chargingStation);
        }
      }
    });
  },
};
</script>

<style scoped>
.top-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: black;
  color: white;
  font-weight: bold;
  font-size: 2rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 定义淡入淡出过渡类 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 0;
}
</style>
