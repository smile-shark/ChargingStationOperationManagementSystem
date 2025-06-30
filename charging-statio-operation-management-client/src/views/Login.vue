<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-600 flex items-center justify-center p-4"
  >
    <!-- 背景装饰元素 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/3 -right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-20 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl"
      ></div>
    </div>

    <!-- 登录卡片 -->
    <div
      class="relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
    >
      <!-- 卡片头部 -->
      <div class="p-8 border-b border-white/10">
        <h1
          class="text-[clamp(1.8rem,3vw,2.5rem)] font-bold text-white text-center"
        >
          充电桩管理系统
        </h1>
        <p class="text-white/70 text-center mt-2">请登录以访问系统</p>
      </div>

      <!-- 登录表单 -->
      <div class="p-8">
        <el-form
          :model="loginForm"
          :rules="loginRules"
          ref="loginFormRef"
          class="space-y-6"
        >
          <!-- 用户名/手机号 -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="el-icon-user"
              placeholder="请输入用户名或手机号"
              v-model="loginForm.username"
              clearable
              class="bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              :style="{
                '--el-input-bg-color': 'transparent',
                '--el-input-text-color': '#fff',
                '--el-input-placeholder-color': 'rgba(255, 255, 255, 0.5)',
                '--el-input-border-color': 'rgba(255, 255, 255, 0.2)',
                '--el-input-focus-border-color': '#409EFF',
              }"
            />
          </el-form-item>

          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
              v-model="loginForm.password"
              type="password"
              show-password
              clearable
              class="bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50"
              :style="{
                '--el-input-bg-color': 'transparent',
                '--el-input-text-color': '#fff',
                '--el-input-placeholder-color': 'rgba(255, 255, 255, 0.5)',
                '--el-input-border-color': 'rgba(255, 255, 255, 0.2)',
                '--el-input-focus-border-color': '#409EFF',
              }"
            />
          </el-form-item>

          <!-- 验证码 -->
          <el-form-item prop="captcha">
            <div class="flex gap-3">
              <el-input
                prefix-icon="el-icon-picture"
                placeholder="请输入验证码"
                v-model="loginForm.captcha"
                clearable
                class="bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 flex-1 h-12"
                :style="{
                  '--el-input-bg-color': 'transparent',
                  '--el-input-text-color': '#fff',
                  '--el-input-placeholder-color': 'rgba(255, 255, 255, 0.5)',
                  '--el-input-border-color': 'rgba(255, 255, 255, 0.2)',
                  '--el-input-focus-border-color': '#409EFF',
                }"
                style="width: 100%; height: 100%"
              />
              <div
                class="bg-white/10 border border-white/20 rounded-lg h-12 flex items-center justify-center w-32 cursor-pointer"
                @click="refreshCaptcha"
              >
                <span
                  class="text-white font-bold text-lg tracking-wider px-2"
                  ref="captchaRef"
                  >{{ captchaText }}</span
                >
              </div>
            </div>
          </el-form-item>

          <!-- 记住密码 -->
          <el-form-item>
            <el-checkbox v-model="loginForm.remember" class="text-white/80"
              >记住密码</el-checkbox
            >
          </el-form-item>

          <!-- 登录按钮 -->
          <el-form-item>
            <el-button
              type="primary"
              :loading="loading"
              class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 底部链接 -->
        <div class="flex justify-between mt-6">
          <a
            href="#"
            class="text-white/70 hover:text-white transition-colors text-sm"
            >忘记密码?</a
          >
          <a
            href="#"
            class="text-white/70 hover:text-white transition-colors text-sm"
            >注册账号</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api";
export default {
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        captcha: "",
        remember: false,
      },
      loginRules: {
        username: [
          { required: true, message: "请输入用户名或手机号", trigger: "blur" },
          {
            min: 3,
            max: 20,
            message: "长度在 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "密码长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        captcha: [
          { required: true, message: "请输入验证码", trigger: "blur" },
          { validator: this.validateCaptcha, trigger: "blur" },
        ],
      },
      loading: false,
      captchaText: this.generateCaptcha(),
    };
  },
  methods: {
    // 生成随机验证码
    generateCaptcha() {
      const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < 4; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    },

    // 刷新验证码
    refreshCaptcha() {
      this.captchaText = this.generateCaptcha();
      // 添加动画效果
      const captchaEl = this.$refs.captchaRef;
      captchaEl.classList.add("animate-[fadeIn_0.5s_ease-in-out]");
      setTimeout(() => {
        captchaEl.classList.remove("animate-[fadeIn_0.5s_ease-in-out]");
      }, 500);
    },

    // 验证验证码
    validateCaptcha(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (value.toUpperCase() !== this.captchaText) {
        callback(new Error("验证码不正确"));
      } else {
        callback();
      }
    },

    // 处理登录
    handleLogin() {
      this.$refs.loginFormRef.validate((valid) => {
        if (valid) {
          this.loading = true;
          api.admin
            .login({
              account: this.loginForm.username,
              password: this.loginForm.password,
            })
            .then((res) => {
              if (res.data.code == 200) {
                localStorage.setItem("token", res.data.data.token);
                localStorage.setItem("account", res.data.data.account);
                if (this.loginForm.remember) {
                  localStorage.setItem("remember", true);
                  localStorage.setItem("password", this.loginForm.password);
                } else {
                  localStorage.removeItem("remember");
                  localStorage.removeItem("password");
                }
                this.$router.push("/");
              } else {
                this.refreshCaptcha(); // 刷新验证码
              }
              this.loading = false;
            });
        } else {
          console.log("验证失败");
          return false;
        }
      });
    },
  },
  mounted() {
    if (localStorage.getItem("remember")) {
      this.loginForm.username = localStorage.getItem("account");
      this.loginForm.password = localStorage.getItem("password");
      this.loginForm.remember = true;
    }
  },
};
</script>

<style scoped>
/* 导入 Tailwind CSS */
@tailwind utilities;

/* 自定义动画 */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 全局样式 */
::v-deep .el-form-item__error {
  color: #ff6b6b;
}

::v-deep .el-checkbox__input.is-checked .el-checkbox__inner,
::v-deep .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  background-color: #409eff;
  border-color: #409eff;
}

::v-deep .el-checkbox__inner {
  background-color: transparent;
  border-color: rgba(255, 255, 255, 0.5);
}

::v-deep .el-checkbox__label {
  color: rgba(255, 255, 255, 0.8);
}

::v-deep .el-input__prefix {
  color: rgba(255, 255, 255, 0.7);
}

/* 修复验证码区域布局 */
::v-deep .el-form-item__content {
  display: flex;
  flex-direction: column;
}

::v-deep .el-form-item__error {
  margin-top: 4px;
}
</style>
