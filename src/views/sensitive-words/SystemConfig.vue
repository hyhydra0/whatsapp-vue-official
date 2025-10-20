<template>
  <div class="system-config-container">
    <!-- Header -->
    <div class="page-header">
      <h1>系统配置</h1>
      <div class="header-actions">
        <el-button type="primary" @click="handleSave" :loading="saving">
          <el-icon><Check /></el-icon>
          保存配置
        </el-button>
      </div>
    </div>

    <!-- Sensitive Word Config -->
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>敏感词监控配置</span>
        </div>
      </template>

      <el-form
        ref="sensitiveFormRef"
        :model="sensitiveConfig"
        label-width="150px"
      >
        <el-form-item label="启用监控">
          <el-switch v-model="sensitiveConfig.enabled" />
          <span class="form-item-tip">开启后将自动检测接收到的消息中的敏感词</span>
        </el-form-item>

        <el-form-item label="检测模式">
          <el-radio-group v-model="sensitiveConfig.mode">
            <el-radio label="realtime">实时检测</el-radio>
            <el-radio label="batch">批量检测</el-radio>
          </el-radio-group>
          <div class="form-item-tip">
            实时检测:收到消息立即检测<br>
            批量检测:定时批量处理,降低系统负载
          </div>
        </el-form-item>

        <el-form-item label="批量检测间隔" v-if="sensitiveConfig.mode === 'batch'">
          <el-input-number
            v-model="sensitiveConfig.batchInterval"
            :min="10"
            :max="300"
            :step="10"
          />
          <span class="form-item-tip">秒,建议30-60秒</span>
        </el-form-item>

        <el-form-item label="告警阈值">
          <el-input-number
            v-model="sensitiveConfig.alertThreshold"
            :min="1"
            :max="100"
          />
          <span class="form-item-tip">单个用户单日触发次数超过此值将发送汇总告警</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Telegram Config -->
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>Telegram 告警配置</span>
          <el-button size="small" @click="handleTestTelegram" :loading="testing">测试连接</el-button>
        </div>
      </template>

      <el-form
        ref="telegramFormRef"
        :model="telegramConfig"
        :rules="telegramRules"
        label-width="150px"
      >
        <el-form-item label="Bot Token" prop="botToken">
          <el-input
            v-model="telegramConfig.botToken"
            placeholder="请输入 Telegram Bot Token"
            show-password
          />
          <div class="form-item-tip">
            从 @BotFather 获取,格式: 1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
          </div>
        </el-form-item>

        <el-form-item label="Chat ID" prop="chatID">
          <el-input
            v-model="telegramConfig.chatID"
            placeholder="请输入 Chat ID"
          />
          <div class="form-item-tip">
            可以是用户ID或群组ID,从 @userinfobot 或 @getidsbot 获取
          </div>
        </el-form-item>

        <el-form-item label="启用告警">
          <el-switch v-model="telegramConfig.enabled" />
          <span class="form-item-tip">开启后将通过 Telegram 发送告警通知</span>
        </el-form-item>

        <el-form-item label="告警模板">
          <el-input
            v-model="telegramConfig.template"
            type="textarea"
            :rows="6"
            placeholder="自定义告警消息模板"
          />
          <div class="form-item-tip">
            可用变量: {sender}, {word}, {content}, {time}<br>
            示例: 🚨 敏感词告警\n发送者: {sender}\n敏感词: {word}\n消息: {content}\n时间: {time}
          </div>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Advanced Config -->
    <el-card class="config-card" shadow="never">
      <template #header>
        <div class="card-header">
          <span>高级配置</span>
        </div>
      </template>

      <el-form
        ref="advancedFormRef"
        :model="advancedConfig"
        label-width="150px"
      >
        <el-form-item label="缓存更新频率">
          <el-input-number
            v-model="advancedConfig.cacheRefreshInterval"
            :min="60"
            :max="3600"
            :step="60"
          />
          <span class="form-item-tip">秒,敏感词缓存自动刷新间隔</span>
        </el-form-item>

        <el-form-item label="告警去重时间">
          <el-input-number
            v-model="advancedConfig.alertDedupeWindow"
            :min="60"
            :max="3600"
            :step="60"
          />
          <span class="form-item-tip">秒,同一用户同一敏感词在此时间窗口内只告警一次</span>
        </el-form-item>

        <el-form-item label="最大告警频率">
          <el-input-number
            v-model="advancedConfig.maxAlertRate"
            :min="1"
            :max="100"
          />
          <span class="form-item-tip">每分钟最多发送的告警数量</span>
        </el-form-item>

        <el-form-item label="日志保留天数">
          <el-input-number
            v-model="advancedConfig.logRetentionDays"
            :min="7"
            :max="365"
          />
          <span class="form-item-tip">告警日志自动清理,保留最近N天的记录</span>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- Test Result Dialog -->
    <el-dialog v-model="showTestResult" title="连接测试结果" width="500px">
      <el-result
        :icon="testResult.success ? 'success' : 'error'"
        :title="testResult.success ? '连接成功' : '连接失败'"
        :sub-title="testResult.message"
      />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Check } from '@element-plus/icons-vue'
import { systemConfigApi } from '@/api/sensitive-word'

// 响应式数据
const sensitiveFormRef = ref<FormInstance>()
const telegramFormRef = ref<FormInstance>()
const advancedFormRef = ref<FormInstance>()
const saving = ref(false)
const testing = ref(false)
const showTestResult = ref(false)

// 配置数据
const sensitiveConfig = reactive({
  enabled: true,
  mode: 'realtime',
  batchInterval: 30,
  alertThreshold: 10
})

const telegramConfig = reactive({
  botToken: '',
  chatID: '',
  enabled: true,
  template: '🚨 敏感词告警\n\n发送者: {sender}\n敏感词: {word}\n消息内容: {content}\n时间: {time}'
})

const advancedConfig = reactive({
  cacheRefreshInterval: 300,
  alertDedupeWindow: 300,
  maxAlertRate: 10,
  logRetentionDays: 30
})

const testResult = reactive({
  success: false,
  message: ''
})

// 验证规则
const telegramRules: FormRules = {
  botToken: [
    { required: true, message: '请输入 Bot Token', trigger: 'blur' },
    { pattern: /^\d+:[A-Za-z0-9_-]{35}$/, message: 'Bot Token 格式不正确', trigger: 'blur' }
  ],
  chatID: [
    { required: true, message: '请输入 Chat ID', trigger: 'blur' }
  ]
}

// 加载配置
const loadConfig = async () => {
  try {
    // 加载敏感词配置
    const sensitiveRes = await systemConfigApi.getConfig('sensitive_word.enabled')
    if (sensitiveRes.code === 200 && sensitiveRes.data) {
      sensitiveConfig.enabled = sensitiveRes.data.value === 'true'
    }

    // 加载 Telegram 配置
    const telegramRes = await systemConfigApi.getTelegramConfig()
    if (telegramRes.code === 200 && telegramRes.data) {
      telegramConfig.botToken = telegramRes.data.botToken || ''
      telegramConfig.chatID = telegramRes.data.chatID || ''
      telegramConfig.enabled = telegramRes.data.enabled || false
    }

    // 可以加载更多配置...
  } catch (error: any) {
    ElMessage.error(error.message || '加载配置失败')
  }
}

// 保存配置
const handleSave = async () => {
  // 验证 Telegram 表单
  if (!telegramFormRef.value) return

  await telegramFormRef.value.validate(async (valid) => {
    if (!valid) return

    saving.value = true
    try {
      // 保存敏感词配置
      await systemConfigApi.setConfig('sensitive_word.enabled', String(sensitiveConfig.enabled))
      await systemConfigApi.setConfig('sensitive_word.mode', sensitiveConfig.mode)
      await systemConfigApi.setConfig('sensitive_word.batch_interval', String(sensitiveConfig.batchInterval))
      await systemConfigApi.setConfig('sensitive_word.alert_threshold', String(sensitiveConfig.alertThreshold))

      // 保存 Telegram 配置
      await systemConfigApi.setConfig('telegram.bot_token', telegramConfig.botToken)
      await systemConfigApi.setConfig('telegram.chat_id', telegramConfig.chatID)
      await systemConfigApi.setConfig('telegram.enabled', String(telegramConfig.enabled))
      await systemConfigApi.setConfig('telegram.template', telegramConfig.template)

      // 保存高级配置
      await systemConfigApi.setConfig('cache.refresh_interval', String(advancedConfig.cacheRefreshInterval))
      await systemConfigApi.setConfig('alert.dedupe_window', String(advancedConfig.alertDedupeWindow))
      await systemConfigApi.setConfig('alert.max_rate', String(advancedConfig.maxAlertRate))
      await systemConfigApi.setConfig('log.retention_days', String(advancedConfig.logRetentionDays))

      ElMessage.success('配置保存成功')
    } catch (error: any) {
      ElMessage.error(error.message || '保存配置失败')
    } finally {
      saving.value = false
    }
  })
}

// 测试 Telegram 连接
const handleTestTelegram = async () => {
  if (!telegramFormRef.value) return

  await telegramFormRef.value.validate(async (valid) => {
    if (!valid) return

    testing.value = true
    try {
      const res = await systemConfigApi.testTelegram({
        botToken: telegramConfig.botToken,
        chatID: telegramConfig.chatID
      })

      if (res.code === 0) {
        testResult.success = true
        testResult.message = '成功发送测试消息到 Telegram'
      } else {
        testResult.success = false
        testResult.message = res.message || '连接失败'
      }
    } catch (error: any) {
      testResult.success = false
      testResult.message = error.message || '连接失败'
    } finally {
      testing.value = false
      showTestResult.value = true
    }
  })
}

// 生命周期
onMounted(() => {
  loadConfig()
})
</script>

<style scoped lang="scss">
.system-config-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
  }

  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.config-card {
  margin-bottom: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 600;
    font-size: 16px;
  }

  .form-item-tip {
    display: block;
    margin-top: 5px;
    font-size: 12px;
    color: #909399;
    line-height: 1.5;
  }
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}
</style>
