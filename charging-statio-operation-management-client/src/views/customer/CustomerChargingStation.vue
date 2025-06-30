<template>
  <div>
    <transition name="fade" @after-leave="handleAfterLeave">
      <div v-if="!chargingModel" class="top-page">已加载{{ finsihed }} MB</div>
    </transition>
    <div ref="contatiner" style="width: 100vw; height: 100vh"></div>
    <div
      style="
        position: absolute;
        top: 0;
        pointer-events: none;
        width: 100vw;
        height: 100vh;
      "
      ref="d2Contatiner"
    >
      <el-button
        type="primary"
        @click="$router.push('/customerHome')"
        style="pointer-events: auto"
        custom-class="mouse-passthrough-drawer"
        >返回</el-button
      >
    </div>
    <el-drawer
      size="60%"
      v-if="drawerInfo.chargingPile"
      :title="drawerInfo.title"
      :visible.sync="drawerInfo.visible"
      direction="ltr"
    >
      <div>
        <el-form class="p-5" disabled>
          <el-row>
            <el-col :span="12" class="pr-2">
              <el-form-item label="充电桩名称" required>
                <el-input v-model="drawerInfo.chargingPile.name" />
              </el-form-item>
              <el-form-item label="类别" required>
                <el-select v-model="drawerInfo.chargingPile.typeC">
                  <el-option label="汽车充电桩" :value="0"></el-option>
                  <el-option label="电瓶车充电桩" :value="1"></el-option>
                  <el-option label="大型公交车充电桩" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="类型" required>
                <el-select v-model="drawerInfo.chargingPile.typeV">
                  <el-option label="混合型(交直流)" :value="0"></el-option>
                  <el-option label="直流桩" :value="1"></el-option>
                  <el-option label="交流桩" :value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="充电枪数量" required>
                <el-input v-model="drawerInfo.chargingPile.chargingGunCount" />
              </el-form-item>
              <el-form-item label="功率(KW)" required>
                <el-input-number
                  v-model="drawerInfo.chargingPile.power"
                  controls-position="right"
                  :min="0"
                  :max="10000"
                ></el-input-number>
              </el-form-item>
              <el-form-item label="归属充电站" required>
                <el-select
                  v-model="drawerInfo.chargingPile.chargingStationId"
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
                <el-radio v-model="drawerInfo.chargingPile.state" :label="0">
                  <TagChargingPileState :state="0"></TagChargingPileState>
                </el-radio>
                <el-radio v-model="drawerInfo.chargingPile.state" :label="1"
                  ><TagChargingPileState :state="1"></TagChargingPileState
                ></el-radio>
                <el-radio v-model="drawerInfo.chargingPile.state" :label="2"
                  ><TagChargingPileState :state="2"></TagChargingPileState
                ></el-radio>
                <el-radio v-model="drawerInfo.chargingPile.state" :label="3"
                  ><TagChargingPileState :state="3"></TagChargingPileState
                ></el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="安装位置" required>
                <el-input v-model="drawerInfo.chargingPile.inPosition" />
              </el-form-item>
              <el-form-item label="详细">
                <el-input
                  autosize
                  v-model="drawerInfo.chargingPile.detail"
                  type="textarea"
                />
              </el-form-item>
              <el-form-item label="图片">
                <el-input v-model="drawerInfo.chargingPile.picture" />
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
                  v-if="drawerInfo.chargingPile.picture"
                  :src="drawerInfo.chargingPile.picture"
                  class="preview-image"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-drawer>
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
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import api from "@/api";
import gsap from "gsap";
import TagChargingPileState from "@/components/TagChargingPileState.vue";

export default {
  components: {
    TagChargingPileState,
  },
  data() {
    return {
      chargingStationSimpleList: [],
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      drawerInfo: {
        title: "xxx充电桩",
        visible: false,
        chargingPile: null,
      },
      finsihed: 0,
      chargingModel: null,
      chargingPileList: [],
      scene: null,
      camera: null,
      renderer: null,
      labelRenderer: null,
      controls: null,
      composer: null,
      outlinePass: null,
      selectedObjects: [],
      uploadImage: null,
    };
  },
  methods: {
    handleAfterLeave() {},
    init3D() {
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        45,
        this.$refs.contatiner.clientWidth / this.$refs.contatiner.clientHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 40, 100);
      //   this.camera.position.set(0, 40, 0);
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(
        this.$refs.contatiner.clientWidth,
        this.$refs.contatiner.clientHeight
      );
      this.renderer.shadowMap.enabled = true;
      this.$refs.contatiner.appendChild(this.renderer.domElement);
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true; // 启用阻尼效果（更平滑）
      this.controls.dampingFactor = 0.05; // 阻尼系数
      this.controls.screenSpacePanning = true; // 允许横向拖动
      this.controls.autoRotate = false; // 禁用自动旋转（默认已禁用）
      this.controls.enablePan = true; // 确保平移启用

      const gridHelper = new THREE.GridHelper(1000, 100);
      gridHelper.position.y = -8;
      this.scene.add(gridHelper);

      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        "/model/chargingPile.glb",
        (pile) => {
          pile.scene.traverse((child) => {
            if (child.name == "_0") {
              child.scale.set(7, 7, 7);
              child.rotation.set(-0.03, 0, -0.03);
              this.chargingModel = child;
              let width = 24;
              let initPositionX = 0;

              // 根据你的布局需求调整以下逻辑
              for (let i = 0; i < this.chargingPileList.length; i++) {
                const chargingPile = this.chargingPileList[i];
                const clonedModel = this.chargingModel.clone();
                clonedModel.visible = true;
                clonedModel.userData.isChargingPile = true; // 添加标识

                const position = new THREE.Vector3(
                  initPositionX + i * width,
                  0,
                  0
                );
                // 计算新位置 - 例如水平排列
                clonedModel.position.copy(position);

                // 添加标签
                const label = new CSS2DObject(document.createElement("div"));
                label.element.textContent = chargingPile.name;
                label.element.style.color = "white";
                label.element.style.backgroundColor = "rgba(0,0,0,0.3)";
                label.element.style.padding = "0.5rem";
                label.element.style.borderRadius = "0.5rem";
                label.position.y = 1.5;
                clonedModel.add(label);

                this.scene.add(clonedModel);
                chargingPile.model = clonedModel;
              }
              // 在所有模型加载完成后添加事件
              this.$nextTick(() => {
                this.addMouseEvents();
              });
            }
          });
        },
        (xhr) => {
          this.finsihed = (xhr.loaded / (1024 * 1024)).toFixed(2);
        }
      );

      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(24, 24),
        new THREE.MeshStandardMaterial({
          color: 0x888888,
          metalness: 0.2,
          roughness: 0.1,
          side: THREE.DoubleSide,
        })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -8;
      this.scene.add(plane);

      // 2D渲染器
      // 正确初始化 CSS2DRenderer
      this.labelRenderer = new CSS2DRenderer();
      this.labelRenderer.setSize(
        this.$refs.contatiner.clientWidth,
        this.$refs.contatiner.clientHeight
      );
      this.labelRenderer.domElement.style.position = "absolute";
      this.labelRenderer.domElement.style.top = "0";
      this.labelRenderer.domElement.style.pointerEvents = "none"; // 避免标签阻挡鼠标事件
      this.$refs.contatiner.appendChild(this.labelRenderer.domElement); // 添加到主容器

      // 初始化后期处理
      this.initPostProcessing();
    },
    animation() {
      requestAnimationFrame(this.animation);
      if (this.chargingModel) {
        this.composer.render();
        this.labelRenderer.render(this.scene, this.camera);
        this.controls.update();
      }
    },
    initPostProcessing() {
      // 创建效果组合器
      this.composer = new EffectComposer(this.renderer);

      // 添加渲染通道
      const renderPass = new RenderPass(this.scene, this.camera);
      this.composer.addPass(renderPass);

      // 添加轮廓描边通道
      this.outlinePass = new OutlinePass(
        new THREE.Vector2(
          this.$refs.contatiner.clientWidth,
          this.$refs.contatiner.clientHeight
        ),
        this.scene,
        this.camera
      );
      this.outlinePass.edgeStrength = 3.0; // 边框强度
      this.outlinePass.edgeGlow = 0.5; // 发光效果
      this.outlinePass.edgeThickness = 1.0; // 边框厚度
      this.outlinePass.pulsePeriod = 1.0; // 脉冲效果周期
      this.outlinePass.visibleEdgeColor.set("#ffffff"); // 边框颜色
      this.composer.addPass(this.outlinePass);

      this.animation();
    },
    addMouseEvents() {
      this.$refs.contatiner.addEventListener("click", (event) => {
        // 计算鼠标位置归一化坐标
        this.mouse.x =
          (event.clientX / this.$refs.contatiner.clientWidth) * 2 - 1;
        this.mouse.y =
          -(event.clientY / this.$refs.contatiner.clientHeight) * 2 + 1;

        // 检测相交物体
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(
          this.chargingPileList.map((pile) => pile.model)
        );

        // 更新选中物体
        this.selectedObjects =
          intersects.length > 0 ? [intersects[0].object.parent] : [];
        // 找到物体对应的数据
        if (this.selectedObjects.length > 0) {
          const chargingPile = this.chargingPileList.find(
            (pile) => pile.model == this.selectedObjects[0]
          );
          console.log(chargingPile);
          this.drawerInfo.visible = true;
          this.drawerInfo.title = chargingPile.name;
          this.drawerInfo.chargingPile = chargingPile;
        }

        this.outlinePass.selectedObjects = this.selectedObjects;
      });
    },
  },
  mounted() {
    api.chargingPile
      .allListByChargingStationId(this.$route.params.chargingStationId)
      .then((res) => {
        if (res.data.code == 200) {
          this.chargingPileList = res.data.data;
        }
      });
    api.chargingStation.simpleList().then((res) => {
      if (res.data.code == 200) {
        this.chargingStationSimpleList = res.data.data;
      }
    });
    this.init3D();
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
