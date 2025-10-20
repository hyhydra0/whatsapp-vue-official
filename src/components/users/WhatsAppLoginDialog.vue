<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加WhatsApp用户"
    width="600px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <div class="whatsapp-login">
      <!-- 登录方式选择 -->
      <el-tabs v-model="loginMethod" v-if="step === 1" class="login-tabs">
        <el-tab-pane label="扫码登录" name="qr">
          <!-- 二维码登录 -->
          <div class="step-qr">
            <div class="step-header">
              <el-icon class="step-icon"><Promotion /></el-icon>
              <h3>扫描二维码</h3>
              <p>使用手机WhatsApp扫描下方二维码完成登录</p>
            </div>

            <div class="qr-container">
              <div v-if="qrCode" class="qr-code">
                <el-image
                  :src="qrCode"
                  alt="WhatsApp登录二维码"
                  style="width: 256px; height: 256px;"
                  fit="contain"
                >
                  <template #error>
                    <div class="qr-error">
                      <el-icon><Picture /></el-icon>
                      <span>二维码加载失败</span>
                    </div>
                  </template>
                </el-image>
              </div>

              <div v-else class="qr-loading">
                <el-skeleton animated>
                  <template #template>
                    <el-skeleton-item variant="rect" style="width: 256px; height: 256px;" />
                  </template>
                </el-skeleton>
              </div>

              <div class="qr-tips">
                <el-alert
                  title="扫码说明"
                  type="info"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ol>
                      <li>打开手机WhatsApp应用</li>
                      <li>点击右上角"⋮"菜单 → 已关联的设备</li>
                      <li>点击"关联设备"</li>
                      <li>扫描上方二维码</li>
                    </ol>
                  </template>
                </el-alert>
              </div>

              <!-- 倒计时 -->
              <div v-if="countdown > 0" class="countdown">
                <el-progress
                  :percentage="(countdown / 120) * 100"
                  :stroke-width="6"
                  status="warning"
                />
                <p>二维码将在 {{ countdown }} 秒后过期</p>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="配对码登录" name="pairing">
          <!-- 配对码登录 -->
          <div class="step-pairing">
            <div v-if="!pairingCode" class="pairing-input">
              <div class="step-header">
                <el-icon class="step-icon"><Phone /></el-icon>
                <h3>输入手机号</h3>
                <p>输入您的WhatsApp手机号获取配对码</p>
              </div>

              <el-form :model="pairingForm" label-width="80px">
                <el-form-item label="手机号">
                  <el-input
                    v-model="pairingForm.phoneNumber"
                    placeholder="请输入完整手机号(含国际区号,如 +8613800138000)"
                    clearable
                    maxlength="20"
                  >
                    <template #prepend>
                      <el-icon><Phone /></el-icon>
                    </template>
                  </el-input>
                </el-form-item>
              </el-form>

              <el-button
                type="primary"
                @click="handleGetPairingCode"
                :loading="loading"
                style="width: 100%"
              >
                获取配对码
              </el-button>
            </div>

            <div v-else class="pairing-code-display">
              <div class="step-header">
                <el-icon class="step-icon"><Key /></el-icon>
                <h3>在手机上输入配对码</h3>
                <p>正在关联 WhatsApp 账户 <strong>{{ pairingForm.phoneNumber }}</strong></p>
              </div>

              <div class="pairing-code-box">
                <div class="code-display">
                  {{ pairingCode }}
                </div>
                <el-tag type="info" size="large">配对码</el-tag>
              </div>

              <div class="pairing-instructions">
                <el-alert
                  title="请按以下步骤操作"
                  type="warning"
                  :closable="false"
                  show-icon
                >
                  <template #default>
                    <ol>
                      <li>在你的手机上打开WhatsApp <el-icon><Phone /></el-icon></li>
                      <li>在 Android 手机上,轻触"菜单"<el-icon>⋮</el-icon>; 在 iPhone 上, 轻触"设置"<el-icon>⚙</el-icon></li>
                      <li>依次轻触"已关联的设备"和"关联设备"</li>
                      <li>轻触"改用电话号码关联",然后在你的手机上输入此验证码</li>
                    </ol>
                  </template>
                </el-alert>
              </div>

              <div v-if="pairingCountdown > 0" class="countdown">
                <el-progress
                  :percentage="(pairingCountdown / 300) * 100"
                  :stroke-width="6"
                  status="warning"
                />
                <p>配对码将在 {{ Math.floor(pairingCountdown / 60) }}:{{ String(pairingCountdown % 60).padStart(2, '0') }} 后过期</p>
              </div>

              <el-button
                type="warning"
                @click="handleResetPairing"
                style="width: 100%; margin-top: 10px;"
              >
                重新获取配对码
              </el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <!-- 步骤2: 登录成功 -->
      <div v-else-if="step === 2" class="step-success">
        <div class="step-header">
          <el-icon class="step-icon success"><SuccessFilled /></el-icon>
          <h3>登录成功</h3>
          <p>WhatsApp用户已成功添加到系统</p>
        </div>

        <div class="user-info">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="WhatsApp ID" v-if="loginResult?.jid">
              {{ loginResult.jid }}
            </el-descriptions-item>
            <el-descriptions-item label="显示名称" v-if="loginResult?.push_name">
              {{ loginResult.push_name }}
            </el-descriptions-item>
            <el-descriptions-item label="平台" v-if="loginResult?.platform">
              {{ loginResult.platform }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose" :disabled="loading">
          {{ step === 2 ? '关闭' : '取消' }}
        </el-button>

        <el-button
          v-if="step === 1"
          type="warning"
          @click="handleRefreshQR"
          :loading="loading"
        >
          刷新二维码
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Phone, Promotion, Picture, SuccessFilled, Key } from '@element-plus/icons-vue'
import { whatsappApi, type QRCodeResponse, type LoginStatusResponse, type PairingCodeResponse } from '@/api/whatsapp'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'success'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const loginMethod = ref('qr') // 'qr' or 'pairing'
const step = ref(1) // 1: 登录中, 2: 登录成功
const qrCode = ref('')
const countdown = ref(0)
const loginResult = ref<LoginStatusResponse | null>(null)
const sessionID = ref('')

// 配对码相关
const pairingCode = ref('')
const pairingCountdown = ref(0)
const pairingForm = ref({
  phoneNumber: ''
})
let pairingCountdownTimer: NodeJS.Timeout | null = null

// 计算属性
const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

// 定时器
let countdownTimer: NodeJS.Timeout | null = null
let statusCheckTimer: NodeJS.Timeout | null = null

// 生成二维码
const handleGenerateQR = async () => {
  try {
    loading.value = true

    // 生成二维码
    const qrResponse: QRCodeResponse = await whatsappApi.generateQR()

    // 转换二维码文本为二维码图片
    qrCode.value = generateQRCodeImage(qrResponse.qr_code)

    // 使用后端返回的会话ID
    sessionID.value = qrResponse.session_id

    // 开始倒计时
    startCountdown(qrResponse.timeout)

    // 开始检查登录状态
    startStatusCheck()

    ElMessage.success('二维码生成成功，请使用手机WhatsApp扫描')
  } catch (error: any) {
    console.error('Generate QR error:', error)
    ElMessage.error(error.response?.data?.message || '生成二维码失败')
  } finally {
    loading.value = false
  }
}

// 刷新二维码
const handleRefreshQR = () => {
  clearTimers()
  qrCode.value = ''
  handleGenerateQR()
}

// 开始倒计时
const startCountdown = (timeout: number) => {
  countdown.value = timeout
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer!)
      ElMessage.warning('二维码已过期，请刷新二维码')
    }
  }, 1000)
}

// 开始检查登录状态
const startStatusCheck = () => {
  statusCheckTimer = setInterval(async () => {
    try {
      const status = await whatsappApi.checkStatus(sessionID.value)

      if (status.connected) {
        // 登录成功
        loginResult.value = status
        step.value = 2
        clearTimers()

        ElMessage.success('WhatsApp登录成功!')

        // 通知父组件刷新用户列表
        setTimeout(() => {
          emit('success')
        }, 1500)
      }
    } catch (error) {
      // 静默处理状态检查错误
      console.debug('Status check error:', error)
    }
  }, 3000) // 每3秒检查一次
}

// 清理定时器
const clearTimers = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
  if (statusCheckTimer) {
    clearInterval(statusCheckTimer)
    statusCheckTimer = null
  }
  if (pairingCountdownTimer) {
    clearInterval(pairingCountdownTimer)
    pairingCountdownTimer = null
  }
}

// 获取配对码
const handleGetPairingCode = async () => {
  if (!pairingForm.value.phoneNumber) {
    ElMessage.error('请输入手机号')
    return
  }

  try {
    loading.value = true

    const response: PairingCodeResponse = await whatsappApi.getPairingCode(pairingForm.value.phoneNumber)

    console.log('API Response:', response)
    console.log('Pairing Code:', response.pairing_code)

    pairingCode.value = response.pairing_code
    sessionID.value = response.session_id

    console.log('pairingCode.value after assignment:', pairingCode.value)

    // 开始倒计时
    startPairingCountdown(response.timeout)

    // 开始检查登录状态
    startStatusCheck()

    ElMessage.success('配对码获取成功，请在手机上输入')
  } catch (error: any) {
    console.error('Get pairing code error:', error)

    // 检查是否是速率限制错误 (429)
    const errorMsg = error.response?.data?.message || error.message || '获取配对码失败'
    const httpStatus = error.response?.status
    const errorCode = error.response?.data?.code

    if (httpStatus === 429 || errorCode === 2004 || errorMsg.includes('rate') || errorMsg.includes('速率限制')) {
      ElMessage({
        type: 'warning',
        duration: 6000,
        message: '🚫 WhatsApp API 请求过于频繁，请等待 1-2 分钟后重试',
        showClose: true
      })
    } else {
      ElMessage.error(errorMsg)
    }
  } finally {
    loading.value = false
  }
}

// 开始配对码倒计时
const startPairingCountdown = (timeout: number) => {
  pairingCountdown.value = timeout
  pairingCountdownTimer = setInterval(() => {
    pairingCountdown.value--
    if (pairingCountdown.value <= 0) {
      clearInterval(pairingCountdownTimer!)
      ElMessage.warning('配对码已过期，请重新获取')
    }
  }, 1000)
}

// 重置配对码
const handleResetPairing = () => {
  pairingCode.value = ''
  pairingCountdown.value = 0
  if (pairingCountdownTimer) {
    clearInterval(pairingCountdownTimer)
    pairingCountdownTimer = null
  }
  if (statusCheckTimer) {
    clearInterval(statusCheckTimer)
    statusCheckTimer = null
  }
}

// 生成二维码图片 (使用在线服务)
const generateQRCodeImage = (text: string): string => {
  // WhatsApp的二维码字符串很长，使用qr-server.com API，它对长文本支持更好
  const encodedText = encodeURIComponent(text)
  return `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodedText}&format=png&margin=10`
}

// 关闭对话框
const handleClose = () => {
  clearTimers()

  // 重置状态
  step.value = 1
  loginMethod.value = 'qr'
  qrCode.value = ''
  countdown.value = 0
  pairingCode.value = ''
  pairingCountdown.value = 0
  pairingForm.value.phoneNumber = ''
  loginResult.value = null
  sessionID.value = ''

  emit('update:visible', false)
}

// 监听对话框开关
watch(dialogVisible, (newValue) => {
  if (newValue) {
    // 对话框打开时,如果是二维码模式则自动生成二维码
    if (loginMethod.value === 'qr') {
      handleGenerateQR()
    }
  } else {
    // 对话框关闭时清理定时器
    clearTimers()
  }
})

// 监听登录方式切换
watch(loginMethod, (newValue) => {
  // 切换登录方式时清理之前的状态
  clearTimers()
  qrCode.value = ''
  countdown.value = 0
  pairingCode.value = ''
  pairingCountdown.value = 0
  sessionID.value = ''

  // 如果切换到二维码模式,自动生成二维码
  if (newValue === 'qr' && dialogVisible.value) {
    handleGenerateQR()
  }
})
</script>

<style scoped>
.whatsapp-login {
  min-height: 300px;
}

.step-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-icon {
  font-size: 48px;
  color: #25D366; /* WhatsApp绿色 */
  margin-bottom: 15px;
}

.step-icon.success {
  color: #67C23A;
}

.step-header h3 {
  margin: 10px 0;
  color: #2c3e50;
}

.step-header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.step-phone {
  padding: 20px 0;
}

.step-qr {
  padding: 20px 0;
}

.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-code {
  padding: 20px;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  background: white;
}

.qr-loading {
  padding: 20px;
}

.qr-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #909399;
  padding: 40px;
}

.qr-tips {
  width: 100%;
  max-width: 350px;
}

.qr-tips ol {
  margin: 10px 0 0 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.6;
}

.qr-tips ol li {
  margin-bottom: 5px;
}

.countdown {
  text-align: center;
  width: 200px;
}

.countdown p {
  margin: 10px 0 0 0;
  font-size: 14px;
  color: #E6A23C;
}

.step-success {
  padding: 20px 0;
}

.user-info {
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.el-dialog__body) {
  padding: 20px 30px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-descriptions__label) {
  font-weight: 500;
}

/* 配对码相关样式 */
.step-pairing {
  padding: 20px 0;
  min-height: 400px;
}

.pairing-input,
.pairing-code-display {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pairing-code-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  margin: 20px 0;
}

.code-display {
  font-size: 48px;
  font-weight: bold;
  letter-spacing: 8px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Courier New', monospace;
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
}

.pairing-instructions {
  width: 100%;
}

.pairing-instructions ol {
  margin: 10px 0 0 0;
  padding-left: 20px;
  font-size: 14px;
  line-height: 1.8;
}

.pairing-instructions ol li {
  margin-bottom: 8px;
}

/* Tab样式优化 */
.login-tabs {
  margin-top: -10px;
}

:deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 500;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}
</style>