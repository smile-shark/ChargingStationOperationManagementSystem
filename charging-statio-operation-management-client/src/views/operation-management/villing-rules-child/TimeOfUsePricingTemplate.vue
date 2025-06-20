<template>
  <div class="time-of-use-pricing" :class="{ 'dialog-open': isDialogOpen }">
    <div class="header">
      <h1>分时计价模板</h1>
      <el-button type="primary" @click="addVillingRules">新增模板</el-button>
    </div>
    <el-row :gutter="20">
      <VueDraggable
        @end="reOrder"
        v-model="billingRulesList"
        :animation="300"
        ghost-class="ghost-card"
        drag-class="dragging-card"
        class="draggable-container"
        :disabled="isDialogOpen"
      >
        <el-col
          :span="8"
          v-for="(item, index) in billingRulesList"
          :key="index"
          class="card-wrapper"
          @mouseenter.native="handleCardMouseEnter($event)"
          @mouseleave.native="handleCardMouseLeave($event)"
        >
          <el-card
            shadow="hover"
            class="draggable-card"
            :class="{ 'no-hover': isDialogOpen }"
          >
            <div class="card-content">
              <i class="el-icon-rank drag-icon"></i>
              <div class="card-text">
                <BillingRulesMovieCard
                  :remove-list="removeList"
                  @dialog-open="handleDialogOpen"
                  @dialog-close="handleDialogClose"
                  :rules="item"
                ></BillingRulesMovieCard>
              </div>
            </div>
          </el-card>
        </el-col>
      </VueDraggable>
    </el-row>
  </div>
</template>

<script>
import api from "@/api";
import { VueDraggable } from "vue-draggable-plus";
import BillingRulesMovieCard from "@/components/BillingRulesMovieCard.vue";

export default {
  name: "TimeOfUsePricingTemplate",
  components: {
    VueDraggable,
    BillingRulesMovieCard,
  },
  data() {
    return {
      billingRulesList: [],
      isDialogOpen: false,
      activeCardIndex: null,
      modalObserver: null,
      _initialLoadComplete: false,
    };
  },
  methods: {
    removeList(id) {
      this.billingRulesList = this.billingRulesList.filter(
        (item) => item.billingRulesId !== id
      );
    },
    reOrder(event) {
      // 获取到所有的排序编号
      let order = this.billingRulesList.length;
      for (let i = 0; i < this.billingRulesList.length; i++) {
        this.billingRulesList[i].order = order;
        api.billingRules.update(this.billingRulesList[i]);
        order--;
      }
      console.log(this.billingRulesList);
    },
    addVillingRules() {
      // 添加模板的同时像后端发送请求创建一个模板，后端返回id，返回后赋给前端模板
      // 1. 创建一个模板添加到list中
      let newRule = {
        billingRulesId: "",
        name: "新模板" + (this.billingRulesList.length + 1),
        timeRange: 0,
      };

      api.billingRules.add(newRule).then((res) => {
        if (res.data.code == 200) {
          this.billingRulesList.push(res.data.data);
          this.billingRulesList.sort((a, b) => {
            return b.order - a.order;
          });
        }
      });
    },
    getBillingRulesList() {
      api.billingRules
        .detailList([0, 1, 2, 3, 4, 5, 6, 7, 8])
        .then((res) => {
          if (res.data.code == 200) {
            this.billingRulesList = res.data.data.map((rule) => {
              return {
                ...rule,
                billingRulesDetails: rule.billingRulesDetails.map((item) => {
                  return {
                    ...item,
                    startTime: item.startTime.slice(0, 5),
                    endTime: item.endTime.slice(0, 5),
                  };
                }),
              };
            });

            // 标记初始数据加载完成
            this.$nextTick(() => {
              this._initialLoadComplete = true;
            });
          }
        })
        .catch((error) => {
          console.error("获取计费规则列表失败:", error);
          this.$message.error("获取计费规则列表失败");
        });
    },
    handleDialogOpen() {
      this.isDialogOpen = true;
      // 确保在dialog打开时禁用底层交互
      this.$nextTick(() => {
        this.checkDialogState();
      });
    },
    handleDialogClose() {
      // 使用nextTick确保DOM更新后再检查状态
      this.$nextTick(() => {
        this.checkDialogState();
      });
    },
    handleCardMouseEnter(event) {
      // 只有当没有对话框打开时，才应用hover效果
      if (!this.isDialogOpen && !document.querySelector(".v-modal")) {
        // 确保只有直接在el-col上的hover事件才会触发效果
        if (event.target.classList.contains("card-wrapper")) {
          const card = event.target.querySelector(".draggable-card");
          if (card) {
            card.classList.add("card-hover");
          }
        }
      }
    },
    handleCardMouseLeave(event) {
      // 移除hover效果
      if (event.target.classList.contains("card-wrapper")) {
        const card = event.target.querySelector(".draggable-card");
        if (card) {
          card.classList.remove("card-hover");
        }
      }
    },
    // 检测黑色背景层的出现和消失
    setupModalObserver() {
      // 使用MutationObserver监听body的子元素变化
      this.modalObserver = new MutationObserver(() => {
        // 简化检测逻辑，只检查是否存在v-modal或可见的dialog
        this.checkDialogState();
      });

      // 开始观察body元素的子元素变化
      this.modalObserver.observe(document.body, {
        childList: true,
        subtree: true, // 监听子树变化，以捕获所有dialog相关变化
        attributes: true, // 监听属性变化，如display: none
        attributeFilter: ["style", "class"], // 只监听style和class属性变化
      });
    },

    // 检查dialog状态
    checkDialogState() {
      const hasModal = document.querySelector(".v-modal");
      const hasVisibleDialog = document.querySelector(
        '.el-dialog__wrapper:not([style*="display: none"])'
      );

      // 如果存在modal或可见的dialog，则设置为打开状态
      this.isDialogOpen = !!(hasModal || hasVisibleDialog);
    },

    // 更新计费规则排序
    updateBillingRulesOrder(newList) {
      // 防止初始加载时触发
      if (!this._initialLoadComplete) {
        this._initialLoadComplete = true;
        return;
      }

      console.log(
        "排序已更新，新顺序为:",
        newList.map((item) => item.id)
      );

      // 构建排序数据
      const orderData = newList.map((item, index) => ({
        id: item.id,
        sortOrder: index + 1,
      }));

      // 调用API更新排序
      // 注意：这里需要根据实际API接口进行调整
      try {
        // 示例API调用，实际实现需要根据后端API进行调整
        // api.billingRules.updateOrder(orderData).then(res => {
        //   if (res.data.code === 200) {
        //     this.$message.success('排序已保存');
        //   } else {
        //     this.$message.error('保存排序失败');
        //   }
        // });

        // 临时注释掉API调用，仅打印日志
        console.log("将发送以下数据到后端保存排序:", orderData);
        this.$message({
          type: "success",
          message: "排序已更新（前端已处理，等待后端API实现）",
          duration: 2000,
        });
      } catch (error) {
        console.error("更新排序出错:", error);
        this.$message.error("更新排序失败");
      }
    },

    // 添加全局点击事件监听器
    setupGlobalClickListener() {
      document.addEventListener("mousedown", this.handleGlobalMouseDown);
    },

    handleGlobalMouseDown(event) {
      // 检查是否点击了v-modal
      if (event.target.classList.contains("v-modal")) {
        this.isDialogOpen = true;
      }
    },
  },
  mounted() {
    try {
      // 获取列表数据
      this.getBillingRulesList();

      // 设置事件监听和观察器
      this.setupModalObserver();
      this.setupGlobalClickListener();

      // 使用新的方法进行初始状态检查
      this.$nextTick(() => {
        this.checkDialogState();
      });
    } catch (error) {
      console.error("Error in mounted hook:", error);
    }
  },

  beforeDestroy() {
    try {
      // 清理观察器
      if (this.modalObserver) {
        this.modalObserver.disconnect();
        this.modalObserver = null;
      }

      // 清理事件监听器
      document.removeEventListener("mousedown", this.handleGlobalMouseDown);

      // 确保在组件销毁时重置状态
      this.isDialogOpen = false;
    } catch (error) {
      console.error("Error in beforeDestroy hook:", error);
    }
  },
};
</script>

<style scoped>
.time-of-use-pricing {
  padding: 20px;
}

.draggable-container {
  width: 100%;
  margin-bottom: 20px;
}

.card-wrapper {
  margin-bottom: 20px;
  position: relative;
}

.draggable-card {
  cursor: move;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
  height: 100%;
}

/* 使用类来控制hover效果 */
.card-hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Dialog打开时的状态控制 */
.dialog-open .draggable-container,
.dialog-open .draggable-card {
  pointer-events: none;
}

.dialog-open .draggable-card {
  cursor: default;
  transform: none;
  box-shadow: none;
  transition: none;
}

/* 确保dialog和其内部元素可以正常交互 */
.dialog-open :deep(.el-dialog),
.dialog-open :deep(.el-dialog__wrapper) {
  pointer-events: auto !important;
}

/* 确保dialog内部所有元素都可以交互 */
.dialog-open :deep(.el-dialog__wrapper *) {
  pointer-events: auto !important;
}

.card-content {
  display: flex;
  align-items: center;
  padding: 10px;
}

.drag-icon {
  color: #909399;
  margin-right: 10px;
  font-size: 16px;
}

.ghost-card {
  opacity: 0.5;
  background: #f0f9ff;
  border: 2px dashed #409eff;
}

.dragging-card {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-text {
  flex: 1;
}

/* Grid布局样式 */
.el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}

.el-col {
  padding-left: 10px !important;
  padding-right: 10px !important;
}
</style>
