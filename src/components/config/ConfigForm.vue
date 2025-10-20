<template>
  <div class="config-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="200px"
      label-position="left"
    >
      <div class="config-section" v-for="section in configSections" :key="section.title">
        <div class="section-header">
          <h3>{{ section.title }}</h3>
          <p v-if="section.description">{{ section.description }}</p>
        </div>

        <div class="config-items">
          <el-form-item
            v-for="config in section.configs"
            :key="config.configKey"
            :label="getConfigLabel(config)"
            :prop="config.configKey"
            :class="getConfigItemClass(config)"
          >
            <template #label>
              <div class="config-label">
                <span class="label-text">{{ getConfigLabel(config) }}</span>
                <el-tag
                  v-if="config.isRequired"
                  size="small"
                  type="danger"
                  effect="plain"
                >
                  必填
                </el-tag>
                <el-tag
                  v-if="config.isEncrypted"
                  size="small"
                  type="warning"
                  effect="plain"
                >
                  加密
                </el-tag>
              </div>
              <div class="config-description" v-if="config.description">
                {{ config.description }}
              </div>
            </template>

            <!-- 字符串类型输入 -->
            <el-input
              v-if="getInputType(config) === 'text'"
              v-model="formData[config.configKey]"
              :placeholder="config.defaultValue || `请输入${getConfigLabel(config)}`"
              :show-password="config.isEncrypted"
              :disabled="!hasWritePermission"
              clearable
              @change="handleConfigChange(config.configKey, $event)"
            />

            <!-- 密码类型输入 -->
            <el-input
              v-else-if="getInputType(config) === 'password'"
              v-model="formData[config.configKey]"
              type="password"
              :placeholder="config.defaultValue || `请输入${getConfigLabel(config)}`"
              :disabled="!hasWritePermission"
              show-password
              clearable
              @change="handleConfigChange(config.configKey, $event)"
            />

            <!-- 数字类型输入 -->
            <el-input-number
              v-else-if="getInputType(config) === 'number'"
              v-model="formData[config.configKey]"
              :placeholder="config.defaultValue || `请输入${getConfigLabel(config)}`"
              :disabled="!hasWritePermission"
              style="width: 100%"
              @change="handleConfigChange(config.configKey, $event)"
            />

            <!-- 布尔类型开关 -->
            <el-switch
              v-else-if="getInputType(config) === 'switch'"
              v-model="formData[config.configKey]"
              :disabled="!hasWritePermission"
              @change="handleConfigChange(config.configKey, $event)"
            />

            <!-- JSON 类型文本域 -->
            <el-input
              v-else-if="getInputType(config) === 'textarea'"
              v-model="formData[config.configKey]"
              type="textarea"
              :rows="6"
              :placeholder="config.defaultValue || `请输入${getConfigLabel(config)}`"
              :disabled="!hasWritePermission"
              @change="handleConfigChange(config.configKey, $event)"
            />

            <!-- 选择类型 -->
            <el-select
              v-else-if="getInputType(config) === 'select'"
              v-model="formData[config.configKey]"
              :placeholder="config.defaultValue || `请选择${getConfigLabel(config)}`"
              :disabled="!hasWritePermission"
              style="width: 100%"
              @change="handleConfigChange(config.configKey, $event)"
            >
              <el-option
                v-for="option in getSelectOptions(config)"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>

            <!-- 配置操作按钮 -->
            <template #append v-if="showConfigActions(config)">
              <div class="config-actions">
                <el-button
                  v-if="canTestConnection(config)"
                  size="small"
                  type="primary"
                  :icon="Connection"
                  @click="testConnection(config.configKey)"
                  :loading="testingConnections[config.configKey]"
                >
                  测试连接
                </el-button>
                <el-button
                  v-if="hasChanges(config.configKey)"
                  size="small"
                  type="success"
                  :icon="Check"
                  @click="saveConfig(config)"
                  :loading="savingConfigs[config.configKey]"
                >
                  保存
                </el-button>
                <el-button
                  v-if="hasChanges(config.configKey)"
                  size="small"
                  :icon="RefreshOne"
                  @click="resetConfig(config.configKey)"
                >
                  重置
                </el-button>
                <el-button
                  size="small"
                  :icon="Time"
                  @click="showHistory(config)"
                >
                  历史
                </el-button>
              </div>
            </template>

            <!-- 验证错误提示 -->
            <div
              v-if="validationErrors[config.configKey]"
              class="validation-errors"
            >
              <el-alert
                v-for="error in validationErrors[config.configKey]"
                :key="error"
                :title="error"
                type="error"
                size="small"
                :closable="false"
              />
            </div>

            <!-- 验证警告提示 -->
            <div
              v-if="validationWarnings[config.configKey]"
              class="validation-warnings"
            >
              <el-alert
                v-for="warning in validationWarnings[config.configKey]"
                :key="warning"
                :title="warning"
                type="warning"
                size="small"
                :closable="false"
              />
            </div>
          </el-form-item>
        </div>
      </div>

      <!-- 批量操作区域 -->
      <div class="batch-actions" v-if="hasAnyChanges && hasWritePermission">
        <el-divider />
        <div class="actions-content">
          <div class="changes-summary">
            <el-tag type="info">{{ changeCount }} 项配置已修改</el-tag>
          </div>
          <div class="actions-buttons">
            <el-button @click="resetAllChanges">重置所有</el-button>
            <el-button
              type="primary"
              :loading="batchSaving"
              @click="batchSaveConfigs"
            >
              批量保存
            </el-button>
          </div>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Check,
  RefreshOne,
  Time,
  Connection
} from '@element-plus/icons-vue'
import { useConfig } from '@/composables/useConfig'
import { useConfigStore } from '@/stores/config'
import type { SystemConfig } from '@/types/config'

// ============= Props =============
interface Props {
  configs: SystemConfig[]
  category: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// ============= Emits =============
interface Emits {
  update: [configKey: string, value: string]
  testConnection: [configKey: string]
  batchSave: [changes: Array<{ configKey: string; configValue: string; description?: string }>]
}

const emit = defineEmits<Emits>()

// ============= 响应式数据 =============
const configStore = useConfigStore()
const configUseConfig = useConfig()

const formRef = ref()
const formData = ref<Record<string, any>>({})
const originalData = ref<Record<string, any>>({})

// 状态管理
const batchSaving = ref(false)
const savingConfigs = ref<Record<string, boolean>>({})
const testingConnections = ref<Record<string, boolean>>({})

// 验证状态
const validationErrors = ref<Record<string, string[]>>({})
const validationWarnings = ref<Record<string, string[]>>({})

// ============= 计算属性 =============

// 权限检查
const hasWritePermission = computed(() => {
  return configStore.permissions?.canWrite || false
})

// 按区域分组配置
const configSections = computed(() => {
  const sections: Array<{
    title: string
    description?: string
    configs: SystemConfig[]
  }> = []

  // 根据配置键的前缀进行分组
  const grouped = props.configs.reduce((groups, config) => {
    const prefix = config.configKey.split('.')[0] || 'general'
    if (!groups[prefix]) {
      groups[prefix] = []
    }
    groups[prefix].push(config)
    return groups
  }, {} as Record<string, SystemConfig[]>)

  // 转换为区域格式
  Object.entries(grouped).forEach(([prefix, configs]) => {
    sections.push({
      title: getSectionTitle(prefix),
      description: getSectionDescription(prefix),
      configs: configs.sort((a, b) => a.configKey.localeCompare(b.configKey))
    })
  })

  return sections
})

// 是否有任何变更
const hasAnyChanges = computed(() => {
  return Object.keys(formData.value).some(key =>
    hasChanges(key)
  )
})

// 变更数量
const changeCount = computed(() => {
  return Object.keys(formData.value).filter(key =>
    hasChanges(key)
  ).length
})

// 表单验证规则
const formRules = computed(() => {
  const rules: Record<string, any[]> = {}

  props.configs.forEach(config => {
    const configRules: any[] = []

    if (config.isRequired) {
      configRules.push({
        required: true,
        message: `${getConfigLabel(config)}不能为空`,
        trigger: 'blur'
      })
    }

    if (config.validationRule) {
      try {
        const regex = new RegExp(config.validationRule)
        configRules.push({
          pattern: regex,
          message: `${getConfigLabel(config)}格式不正确`,
          trigger: 'blur'
        })
      } catch (error) {
        console.warn(`配置项 ${config.configKey} 的验证规则无效:`, error)
      }
    }

    if (config.configType === 'number') {
      configRules.push({
        type: 'number',
        message: `${getConfigLabel(config)}必须是数字`,
        trigger: 'blur'
      })
    }

    if (configRules.length > 0) {
      rules[config.configKey] = configRules
    }
  })

  return rules
})

// ============= 监听器 =============

// 监听配置变化，初始化表单数据
watch(
  () => props.configs,
  (newConfigs) => {
    initFormData(newConfigs)
  },
  { immediate: true, deep: true }
)

// ============= 方法 =============

/**
 * 初始化表单数据
 */
function initFormData(configs: SystemConfig[]) {
  const data: Record<string, any> = {}
  const original: Record<string, any> = {}

  configs.forEach(config => {
    let value = config.configValue

    // 根据类型转换值
    switch (config.configType) {
      case 'number':
        value = value ? Number(value) : 0
        break
      case 'boolean':
        value = value === 'true' || value === true
        break
      case 'json':
        try {
          value = JSON.parse(value)
          value = JSON.stringify(value, null, 2)
        } catch {
          // 保持原值
        }
        break
    }

    data[config.configKey] = value
    original[config.configKey] = value
  })

  formData.value = data
  originalData.value = original
}

/**
 * 获取区域标题
 */
function getSectionTitle(prefix: string): string {
  const titles: Record<string, string> = {
    system: '系统参数',
    security: '安全配置',
    notification: '通知配置',
    whatsapp: 'WhatsApp API',
    database: '数据库配置',
    cache: '缓存配置',
    storage: '存储配置',
    general: '通用配置'
  }
  return titles[prefix] || prefix.toUpperCase()
}

/**
 * 获取区域描述
 */
function getSectionDescription(prefix: string): string {
  const descriptions: Record<string, string> = {
    system: '系统运行的基础参数设置',
    security: '安全策略和权限控制相关配置',
    notification: '邮件、短信等通知服务配置',
    whatsapp: 'WhatsApp Business API 连接配置',
    database: '数据库连接和性能相关配置',
    cache: 'Redis 缓存服务配置',
    storage: '文件存储服务配置'
  }
  return descriptions[prefix] || ''
}

/**
 * 获取配置标签
 */
function getConfigLabel(config: SystemConfig): string {
  // 从配置键生成友好的标签
  const parts = config.configKey.split('.')
  const lastPart = parts[parts.length - 1]
  return lastPart.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

/**
 * 获取输入类型
 */
function getInputType(config: SystemConfig): string {
  if (config.isEncrypted) {
    return 'password'
  }

  switch (config.configType) {
    case 'number':
      return 'number'
    case 'boolean':
      return 'switch'
    case 'json':
      return 'textarea'
    default:
      // 检查是否是选择类型
      if (config.validationRule && config.validationRule.includes('|')) {
        return 'select'
      }
      return 'text'
  }
}

/**
 * 获取选择项选项
 */
function getSelectOptions(config: SystemConfig) {
  if (!config.validationRule || !config.validationRule.includes('|')) {
    return []
  }

  return config.validationRule.split('|').map(option => ({
    value: option.trim(),
    label: option.trim()
  }))
}

/**
 * 获取配置项样式类
 */
function getConfigItemClass(config: SystemConfig): string {
  const classes = ['config-item']

  if (config.isRequired) {
    classes.push('required')
  }

  if (config.isEncrypted) {
    classes.push('encrypted')
  }

  if (hasChanges(config.configKey)) {
    classes.push('changed')
  }

  return classes.join(' ')
}

/**
 * 是否显示配置操作按钮
 */
function showConfigActions(config: SystemConfig): boolean {
  return hasWritePermission.value || canTestConnection(config)
}

/**
 * 是否可以测试连接
 */
function canTestConnection(config: SystemConfig): boolean {
  const testableKeys = [
    'database.host',
    'cache.host',
    'notification.email.smtp_host',
    'whatsapp.api_url'
  ]

  return testableKeys.some(key => config.configKey.includes(key))
}

/**
 * 检查是否有变更
 */
function hasChanges(configKey: string): boolean {
  return formData.value[configKey] !== originalData.value[configKey]
}

/**
 * 处理配置变更
 */
async function handleConfigChange(configKey: string, value: any) {
  formData.value[configKey] = value
  emit('update', configKey, String(value))

  // 实时验证
  await validateConfig(configKey, String(value))
}

/**
 * 验证单个配置
 */
async function validateConfig(configKey: string, value: string) {
  try {
    const validation = await configUseConfig.validateConfigValue(configKey, value)

    if (validation.isValid) {
      delete validationErrors.value[configKey]
    } else {
      validationErrors.value[configKey] = validation.errors
    }

    if (validation.warnings.length > 0) {
      validationWarnings.value[configKey] = validation.warnings
    } else {
      delete validationWarnings.value[configKey]
    }
  } catch (error) {
    console.error('验证配置失败:', error)
  }
}

/**
 * 测试连接
 */
async function testConnection(configKey: string) {
  testingConnections.value[configKey] = true
  try {
    emit('testConnection', configKey)
  } finally {
    testingConnections.value[configKey] = false
  }
}

/**
 * 保存单个配置
 */
async function saveConfig(config: SystemConfig) {
  savingConfigs.value[config.configKey] = true
  try {
    const value = String(formData.value[config.configKey])
    const success = await configUseConfig.saveSystemConfig(
      config.configKey,
      value,
      config.description
    )

    if (success) {
      originalData.value[config.configKey] = formData.value[config.configKey]
      delete validationErrors.value[config.configKey]
      delete validationWarnings.value[config.configKey]
    }
  } finally {
    savingConfigs.value[config.configKey] = false
  }
}

/**
 * 重置单个配置
 */
function resetConfig(configKey: string) {
  formData.value[configKey] = originalData.value[configKey]
  delete validationErrors.value[configKey]
  delete validationWarnings.value[configKey]
}

/**
 * 重置所有变更
 */
function resetAllChanges() {
  Object.keys(formData.value).forEach(key => {
    if (hasChanges(key)) {
      resetConfig(key)
    }
  })
}

/**
 * 批量保存配置
 */
async function batchSaveConfigs() {
  // 验证所有变更的配置
  const changedConfigs = Object.keys(formData.value).filter(key => hasChanges(key))

  if (changedConfigs.length === 0) {
    ElMessage.warning('没有需要保存的配置')
    return
  }

  // 检查是否有验证错误
  const hasErrors = changedConfigs.some(key => validationErrors.value[key])
  if (hasErrors) {
    ElMessage.error('请先修复配置验证错误')
    return
  }

  const changes = changedConfigs.map(configKey => {
    const config = props.configs.find(c => c.configKey === configKey)
    return {
      configKey,
      configValue: String(formData.value[configKey]),
      description: config?.description
    }
  })

  emit('batchSave', changes)
}

/**
 * 显示配置历史
 */
function showHistory(config: SystemConfig) {
  // 触发父组件显示历史对话框
  emit('showHistory', config.id)
}
</script>

<style scoped>
.config-form {
  padding: 20px 0;
}

.config-section {
  margin-bottom: 32px;
}

.section-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e4e7ed;
}

.section-header h3 {
  margin: 0 0 8px 0;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.section-header p {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.config-items {
  display: grid;
  gap: 16px;
}

.config-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.label-text {
  font-weight: 500;
  color: #303133;
}

.config-description {
  font-size: 12px;
  color: #909399;
  line-height: 1.4;
}

.config-item.changed :deep(.el-form-item__label) {
  color: #409eff;
}

.config-item.required :deep(.el-form-item__label::before) {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}

.config-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.validation-errors,
.validation-warnings {
  margin-top: 8px;
}

.validation-errors :deep(.el-alert),
.validation-warnings :deep(.el-alert) {
  margin-bottom: 4px;
}

.batch-actions {
  margin-top: 32px;
}

.actions-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f5f7fa;
  border-radius: 4px;
}

.changes-summary {
  color: #606266;
  font-size: 14px;
}

.actions-buttons {
  display: flex;
  gap: 12px;
}
</style>