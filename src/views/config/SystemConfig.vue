<template>
  <div class="system-config">
    <!-- 页面头部 -->
    <div class="config-header">
      <div class="header-main">
        <h2>系统配置</h2>
        <p class="description">管理系统运行参数、安全配置和服务连接等设置</p>
      </div>
      <div class="header-actions">
        <el-button
          type="primary"
          :icon="RefreshOne"
          :loading="configStore.systemConfigsLoading"
          @click="refreshConfigs"
        >
          刷新配置
        </el-button>
        <el-button
          type="success"
          :icon="CheckOne"
          :loading="applying"
          @click="applyChanges"
          :disabled="!hasChanges"
        >
          应用更改
        </el-button>
        <el-button
          type="info"
          :icon="Download"
          @click="exportConfigs"
        >
          导出配置
        </el-button>
      </div>
    </div>

    <!-- 系统健康状态 -->
    <div class="health-status" v-if="healthStatus">
      <el-card shadow="never" class="health-card">
        <template #header>
          <div class="health-header">
            <span>系统健康状态</span>
            <el-button
              text
              :icon="RefreshOne"
              @click="refreshHealthStatus"
              :loading="healthLoading"
            >
              刷新
            </el-button>
          </div>
        </template>
        <div class="health-items">
          <div
            v-for="(status, service) in healthStatus"
            :key="service"
            class="health-item"
            :class="{ 'health-error': !status }"
          >
            <el-icon :class="status ? 'text-green-500' : 'text-red-500'">
              <Check v-if="status" />
              <Close v-else />
            </el-icon>
            <span>{{ getServiceName(service) }}</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 配置搜索 -->
    <div class="config-search">
      <el-card shadow="never">
        <el-form :model="searchForm" inline>
          <el-form-item label="搜索配置">
            <el-input
              v-model="searchForm.keyword"
              placeholder="输入配置名称或描述"
              :prefix-icon="Search"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="配置分类">
            <el-select
              v-model="searchForm.category"
              placeholder="选择分类"
              clearable
              style="width: 200px"
              @change="handleSearch"
            >
              <el-option
                v-for="group in configStore.systemConfigs"
                :key="group.category"
                :label="group.categoryName"
                :value="group.category"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="配置类型">
            <el-select
              v-model="searchForm.configType"
              placeholder="选择类型"
              clearable
              style="width: 150px"
              @change="handleSearch"
            >
              <el-option label="字符串" value="string" />
              <el-option label="数字" value="number" />
              <el-option label="布尔值" value="boolean" />
              <el-option label="JSON" value="json" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="handleSearch">
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 配置列表 -->
    <div class="config-content">
      <el-tabs v-model="activeTab" type="card" @tab-change="handleTabChange">
        <el-tab-pane
          v-for="group in filteredConfigGroups"
          :key="group.category"
          :label="group.categoryName"
          :name="group.category"
        >
          <ConfigForm
            :configs="group.configs"
            :category="group.category"
            :loading="configStore.systemConfigsLoading"
            @update="handleConfigUpdate"
            @test-connection="handleTestConnection"
            @batch-save="handleBatchSave"
          />
        </el-tab-pane>

        <!-- 空状态 -->
        <div v-if="filteredConfigGroups.length === 0" class="empty-state">
          <el-empty description="暂无配置项" />
        </div>
      </el-tabs>
    </div>

    <!-- 配置历史对话框 -->
    <el-dialog
      v-model="historyDialogVisible"
      title="配置历史"
      width="80%"
      :close-on-click-modal="false"
    >
      <ConfigHistory
        v-if="historyDialogVisible"
        :config-type="'system'"
        :config-id="selectedConfigId"
        @rollback="handleRollback"
      />
    </el-dialog>

    <!-- 批量操作确认对话框 -->
    <el-dialog
      v-model="batchConfirmVisible"
      title="批量保存确认"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="batch-confirm-content">
        <el-alert
          title="以下配置将被更新"
          type="warning"
          :closable="false"
          show-icon
        />
        <div class="config-changes">
          <div
            v-for="change in pendingChanges"
            :key="change.configKey"
            class="change-item"
          >
            <div class="change-key">{{ change.configKey }}</div>
            <div class="change-value">
              <span class="old-value">{{ change.oldValue }}</span>
              <el-icon><ArrowRight /></el-icon>
              <span class="new-value">{{ change.newValue }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="batchConfirmVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="configUseConfig.saving"
          @click="confirmBatchSave"
        >
          确认保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  RefreshOne,
  CheckOne,
  Download,
  Search,
  Check,
  Close,
  ArrowRight
} from '@element-plus/icons-vue'
import { useConfigStore } from '@/stores/config'
import { useConfig } from '@/composables/useConfig'
import ConfigForm from '@/components/config/ConfigForm.vue'
import ConfigHistory from '@/components/config/ConfigHistory.vue'
import type { SystemConfig, ConfigSearchParams } from '@/types/config'

// ============= 响应式数据 =============
const configStore = useConfigStore()
const configUseConfig = useConfig()

const activeTab = ref('')
const applying = ref(false)
const healthLoading = ref(false)
const healthStatus = ref<Record<string, boolean> | null>(null)

// 搜索表单
const searchForm = ref<ConfigSearchParams>({
  keyword: '',
  category: '',
  configType: undefined,
  page: 1,
  pageSize: 100
})

// 变更跟踪
const originalConfigs = ref<Record<string, string>>({})
const currentConfigs = ref<Record<string, string>>({})

// 历史对话框
const historyDialogVisible = ref(false)
const selectedConfigId = ref<number | null>(null)

// 批量操作
const batchConfirmVisible = ref(false)
const pendingChanges = ref<Array<{
  configKey: string
  oldValue: string
  newValue: string
}>>([])

// ============= 计算属性 =============
const filteredConfigGroups = computed(() => {
  let groups = configStore.systemConfigs

  if (searchForm.value.keyword) {
    groups = groups.map(group => ({
      ...group,
      configs: group.configs.filter(config =>
        config.configKey.toLowerCase().includes(searchForm.value.keyword!.toLowerCase()) ||
        config.description?.toLowerCase().includes(searchForm.value.keyword!.toLowerCase())
      )
    })).filter(group => group.configs.length > 0)
  }

  if (searchForm.value.category) {
    groups = groups.filter(group => group.category === searchForm.value.category)
  }

  if (searchForm.value.configType) {
    groups = groups.map(group => ({
      ...group,
      configs: group.configs.filter(config => config.configType === searchForm.value.configType)
    })).filter(group => group.configs.length > 0)
  }

  return groups
})

const hasChanges = computed(() => {
  return Object.keys(currentConfigs.value).some(key =>
    currentConfigs.value[key] !== originalConfigs.value[key]
  )
})

// ============= 生命周期 =============
onMounted(async () => {
  await initData()
})

// 监听配置变化，初始化原始值
watch(
  () => configStore.systemConfigs,
  (newConfigs) => {
    initConfigValues(newConfigs)
    if (newConfigs.length > 0 && !activeTab.value) {
      activeTab.value = newConfigs[0].category
    }
  },
  { immediate: true }
)

// ============= 方法 =============

/**
 * 初始化数据
 */
async function initData() {
  await Promise.all([
    configUseConfig.initSystemConfigs(),
    refreshHealthStatus()
  ])
}

/**
 * 初始化配置值
 */
function initConfigValues(configGroups: typeof configStore.systemConfigs) {
  const original: Record<string, string> = {}
  const current: Record<string, string> = {}

  configGroups.forEach(group => {
    group.configs.forEach(config => {
      original[config.configKey] = config.configValue
      current[config.configKey] = config.configValue
    })
  })

  originalConfigs.value = original
  currentConfigs.value = current
}

/**
 * 刷新配置
 */
async function refreshConfigs() {
  await configStore.fetchSystemConfigs()
  ElMessage.success('配置已刷新')
}

/**
 * 刷新健康状态
 */
async function refreshHealthStatus() {
  healthLoading.value = true
  try {
    healthStatus.value = await configUseConfig.getSystemHealth()
  } catch (error) {
    console.error('获取健康状态失败:', error)
  } finally {
    healthLoading.value = false
  }
}

/**
 * 获取服务名称
 */
function getServiceName(service: string): string {
  const serviceNames: Record<string, string> = {
    database: '数据库',
    cache: '缓存',
    email: '邮件服务',
    whatsapp: 'WhatsApp API',
    storage: '文件存储'
  }
  return serviceNames[service] || service
}

/**
 * 处理搜索
 */
async function handleSearch() {
  if (Object.values(searchForm.value).some(v => v)) {
    await configStore.searchSystemConfigs(searchForm.value)
  } else {
    await configStore.fetchSystemConfigs()
  }
}

/**
 * 重置搜索
 */
async function resetSearch() {
  searchForm.value = {
    keyword: '',
    category: '',
    configType: undefined,
    page: 1,
    pageSize: 100
  }
  await configStore.fetchSystemConfigs()
}

/**
 * 处理标签页切换
 */
function handleTabChange(tabName: string) {
  activeTab.value = tabName
}

/**
 * 处理配置更新
 */
function handleConfigUpdate(configKey: string, newValue: string) {
  currentConfigs.value[configKey] = newValue
}

/**
 * 测试连接
 */
async function handleTestConnection(configKey: string) {
  await configUseConfig.testConfigConnection(configKey)
}

/**
 * 处理批量保存
 */
function handleBatchSave(changes: Array<{ configKey: string; configValue: string; description?: string }>) {
  // 准备变更对比数据
  pendingChanges.value = changes.map(change => ({
    configKey: change.configKey,
    oldValue: originalConfigs.value[change.configKey] || '',
    newValue: change.configValue
  }))

  batchConfirmVisible.value = true
}

/**
 * 确认批量保存
 */
async function confirmBatchSave() {
  try {
    const changes = pendingChanges.value.map(change => ({
      configKey: change.configKey,
      configValue: change.newValue
    }))

    const success = await configUseConfig.batchSaveSystemConfigs(changes)

    if (success) {
      // 更新原始值
      changes.forEach(change => {
        originalConfigs.value[change.configKey] = change.configValue
        currentConfigs.value[change.configKey] = change.configValue
      })

      batchConfirmVisible.value = false
      pendingChanges.value = []
    }
  } catch (error) {
    console.error('批量保存失败:', error)
  }
}

/**
 * 应用配置更改
 */
async function applyChanges() {
  applying.value = true
  try {
    const result = await configUseConfig.applyConfigChanges()

    if (result.restartRequired) {
      await ElMessageBox.confirm(
        '配置已应用，但需要重启服务才能完全生效。是否立即重启？',
        '需要重启',
        {
          type: 'warning',
          confirmButtonText: '立即重启',
          cancelButtonText: '稍后重启'
        }
      )
      // 这里可以调用重启服务的 API
    }

    // 刷新健康状态
    await refreshHealthStatus()
  } catch (error) {
    console.error('应用配置失败:', error)
  } finally {
    applying.value = false
  }
}

/**
 * 导出配置
 */
async function exportConfigs() {
  try {
    const response = await configStore.configApi.exportConfig(['system'])

    // 创建下载链接
    const blob = new Blob([JSON.stringify(response.data, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system-config-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)

    ElMessage.success('配置导出成功')
  } catch (error) {
    console.error('导出配置失败:', error)
    ElMessage.error('导出配置失败')
  }
}

/**
 * 显示配置历史
 */
function showConfigHistory(configId: number) {
  selectedConfigId.value = configId
  historyDialogVisible.value = true
}

/**
 * 处理配置回滚
 */
async function handleRollback(historyId: number) {
  const success = await configUseConfig.rollbackToHistory(historyId)
  if (success) {
    historyDialogVisible.value = false
    await refreshConfigs()
  }
}
</script>

<style scoped>
.system-config {
  padding: 20px;
}

.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-main h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.header-main .description {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.health-status {
  margin-bottom: 20px;
}

.health-card :deep(.el-card__header) {
  padding: 16px 20px;
}

.health-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.health-items {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.health-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 4px;
  background: #f5f7fa;
  font-size: 14px;
}

.health-item.health-error {
  background: #fef0f0;
  color: #f56c6c;
}

.config-search {
  margin-bottom: 20px;
}

.config-search :deep(.el-card__body) {
  padding: 16px 20px;
}

.config-content {
  background: white;
  border-radius: 4px;
}

.empty-state {
  padding: 40px;
  text-align: center;
}

.batch-confirm-content {
  margin-bottom: 20px;
}

.config-changes {
  margin-top: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.change-item {
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  margin-bottom: 8px;
}

.change-key {
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.change-value {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: monospace;
  font-size: 13px;
}

.old-value {
  color: #f56c6c;
  text-decoration: line-through;
}

.new-value {
  color: #67c23a;
  font-weight: bold;
}

.text-green-500 {
  color: #67c23a;
}

.text-red-500 {
  color: #f56c6c;
}
</style>