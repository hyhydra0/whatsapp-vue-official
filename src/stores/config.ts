import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  SystemConfig,
  SystemConfigGroup,
  SensitiveWord,
  SensitiveWordCategory,
  ApprovalTemplate,
  ConfigHistory,
  ConfigStats,
  ConfigPermission,
  ConfigSearchParams,
  SensitiveWordSearchParams,
  ApprovalTemplateSearchParams,
  ConfigHistoryQuery,
  PaginatedResponse
} from '@/types/config'
import configApi from '@/api/config'

export const useConfigStore = defineStore('config', () => {
  // ============= 状态定义 =============

  // 系统配置相关状态
  const systemConfigs = ref<SystemConfigGroup[]>([])
  const systemConfigsLoading = ref(false)

  // 敏感词相关状态
  const sensitiveWords = ref<SensitiveWord[]>([])
  const sensitiveWordCategories = ref<SensitiveWordCategory[]>([])
  const sensitiveWordsLoading = ref(false)

  // 审批模板相关状态
  const approvalTemplates = ref<ApprovalTemplate[]>([])
  const approvalTemplatesLoading = ref(false)

  // 配置历史相关状态
  const configHistories = ref<ConfigHistory[]>([])
  const configHistoriesLoading = ref(false)

  // 配置统计
  const configStats = ref<ConfigStats | null>(null)

  // 权限信息
  const permissions = ref<ConfigPermission | null>(null)

  // 当前选中的配置项
  const selectedSystemConfig = ref<SystemConfig | null>(null)
  const selectedSensitiveWord = ref<SensitiveWord | null>(null)
  const selectedApprovalTemplate = ref<ApprovalTemplate | null>(null)

  // 搜索和分页状态
  const searchParams = ref<{
    system: ConfigSearchParams
    sensitiveWord: SensitiveWordSearchParams
    approvalTemplate: ApprovalTemplateSearchParams
    history: ConfigHistoryQuery
  }>({
    system: { page: 1, pageSize: 20 },
    sensitiveWord: { page: 1, pageSize: 20 },
    approvalTemplate: { page: 1, pageSize: 20 },
    history: { page: 1, pageSize: 20 }
  })

  // 分页信息
  const pagination = ref<{
    system: { total: number; totalPages: number }
    sensitiveWord: { total: number; totalPages: number }
    approvalTemplate: { total: number; totalPages: number }
    history: { total: number; totalPages: number }
  }>({
    system: { total: 0, totalPages: 0 },
    sensitiveWord: { total: 0, totalPages: 0 },
    approvalTemplate: { total: 0, totalPages: 0 },
    history: { total: 0, totalPages: 0 }
  })

  // ============= 计算属性 =============

  // 获取所有系统配置项的扁平化数组
  const allSystemConfigs = computed(() => {
    return systemConfigs.value.flatMap(group => group.configs)
  })

  // 根据分类获取系统配置
  const getSystemConfigsByCategory = computed(() => {
    return (category: string) => {
      const group = systemConfigs.value.find(g => g.category === category)
      return group ? group.configs : []
    }
  })

  // 根据分类获取敏感词
  const getSensitiveWordsByCategory = computed(() => {
    return (category: string) => {
      return sensitiveWords.value.filter(word => word.category === category)
    }
  })

  // 获取活跃的审批模板
  const activeApprovalTemplates = computed(() => {
    return approvalTemplates.value.filter(template => template.status === 'active')
  })

  // 检查是否有相关权限
  const hasPermission = computed(() => {
    return (action: keyof ConfigPermission) => {
      return permissions.value?.[action] || false
    }
  })

  // ============= 系统配置相关方法 =============

  /**
   * 获取系统配置列表
   */
  async function fetchSystemConfigs() {
    systemConfigsLoading.value = true
    try {
      const response = await configApi.systemConfig.getConfigs()
      systemConfigs.value = response.data
    } catch (error) {
      console.error('获取系统配置失败:', error)
      ElMessage.error('获取系统配置失败')
    } finally {
      systemConfigsLoading.value = false
    }
  }

  /**
   * 搜索系统配置
   */
  async function searchSystemConfigs(params: ConfigSearchParams) {
    systemConfigsLoading.value = true
    try {
      searchParams.value.system = { ...searchParams.value.system, ...params }
      const response = await configApi.systemConfig.searchConfigs(searchParams.value.system)

      // 将搜索结果转换为分组格式
      const groupedConfigs = response.data.items.reduce((groups, config) => {
        const existingGroup = groups.find(g => g.category === config.category)
        if (existingGroup) {
          existingGroup.configs.push(config)
        } else {
          groups.push({
            category: config.category,
            categoryName: config.category,
            configs: [config]
          })
        }
        return groups
      }, [] as SystemConfigGroup[])

      systemConfigs.value = groupedConfigs
      pagination.value.system = {
        total: response.data.total,
        totalPages: response.data.totalPages
      }
    } catch (error) {
      console.error('搜索系统配置失败:', error)
      ElMessage.error('搜索系统配置失败')
    } finally {
      systemConfigsLoading.value = false
    }
  }

  /**
   * 更新系统配置
   */
  async function updateSystemConfig(configKey: string, configValue: string, description?: string) {
    try {
      const response = await configApi.systemConfig.updateConfig(configKey, {
        configKey,
        configValue,
        description
      })

      // 更新本地状态
      const updatedConfig = response.data
      systemConfigs.value.forEach(group => {
        const configIndex = group.configs.findIndex(c => c.configKey === configKey)
        if (configIndex !== -1) {
          group.configs[configIndex] = updatedConfig
        }
      })

      ElMessage.success('配置更新成功')
      return updatedConfig
    } catch (error) {
      console.error('更新系统配置失败:', error)
      throw error
    }
  }

  /**
   * 批量更新系统配置
   */
  async function batchUpdateSystemConfigs(configs: Array<{ configKey: string; configValue: string; description?: string }>) {
    try {
      const response = await configApi.systemConfig.batchUpdateConfigs({ configs })

      // 更新本地状态
      response.data.forEach(updatedConfig => {
        systemConfigs.value.forEach(group => {
          const configIndex = group.configs.findIndex(c => c.configKey === updatedConfig.configKey)
          if (configIndex !== -1) {
            group.configs[configIndex] = updatedConfig
          }
        })
      })

      ElMessage.success('批量更新配置成功')
      return response.data
    } catch (error) {
      console.error('批量更新配置失败:', error)
      throw error
    }
  }

  // ============= 敏感词相关方法 =============

  /**
   * 获取敏感词分类
   */
  async function fetchSensitiveWordCategories() {
    try {
      const response = await configApi.sensitiveWord.getCategories()
      sensitiveWordCategories.value = response.data
    } catch (error) {
      console.error('获取敏感词分类失败:', error)
      ElMessage.error('获取敏感词分类失败')
    }
  }

  /**
   * 搜索敏感词
   */
  async function searchSensitiveWords(params: SensitiveWordSearchParams) {
    sensitiveWordsLoading.value = true
    try {
      searchParams.value.sensitiveWord = { ...searchParams.value.sensitiveWord, ...params }
      const response = await configApi.sensitiveWord.searchWords(searchParams.value.sensitiveWord)

      sensitiveWords.value = response.data.items
      pagination.value.sensitiveWord = {
        total: response.data.total,
        totalPages: response.data.totalPages
      }
    } catch (error) {
      console.error('搜索敏感词失败:', error)
      ElMessage.error('搜索敏感词失败')
    } finally {
      sensitiveWordsLoading.value = false
    }
  }

  /**
   * 创建敏感词
   */
  async function createSensitiveWord(data: Omit<SensitiveWord, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await configApi.sensitiveWord.createWord(data)
      sensitiveWords.value.unshift(response.data)
      ElMessage.success('敏感词创建成功')
      return response.data
    } catch (error) {
      console.error('创建敏感词失败:', error)
      throw error
    }
  }

  /**
   * 更新敏感词
   */
  async function updateSensitiveWord(id: number, data: Partial<SensitiveWord>) {
    try {
      const response = await configApi.sensitiveWord.updateWord(id, data)

      const index = sensitiveWords.value.findIndex(word => word.id === id)
      if (index !== -1) {
        sensitiveWords.value[index] = response.data
      }

      ElMessage.success('敏感词更新成功')
      return response.data
    } catch (error) {
      console.error('更新敏感词失败:', error)
      throw error
    }
  }

  /**
   * 删除敏感词
   */
  async function deleteSensitiveWord(id: number) {
    try {
      await configApi.sensitiveWord.deleteWord(id)

      const index = sensitiveWords.value.findIndex(word => word.id === id)
      if (index !== -1) {
        sensitiveWords.value.splice(index, 1)
      }

      ElMessage.success('敏感词删除成功')
    } catch (error) {
      console.error('删除敏感词失败:', error)
      throw error
    }
  }

  // ============= 审批模板相关方法 =============

  /**
   * 获取审批模板列表
   */
  async function fetchApprovalTemplates() {
    approvalTemplatesLoading.value = true
    try {
      const response = await configApi.approvalTemplate.getTemplates()
      approvalTemplates.value = response.data
    } catch (error) {
      console.error('获取审批模板失败:', error)
      ElMessage.error('获取审批模板失败')
    } finally {
      approvalTemplatesLoading.value = false
    }
  }

  /**
   * 搜索审批模板
   */
  async function searchApprovalTemplates(params: ApprovalTemplateSearchParams) {
    approvalTemplatesLoading.value = true
    try {
      searchParams.value.approvalTemplate = { ...searchParams.value.approvalTemplate, ...params }
      const response = await configApi.approvalTemplate.searchTemplates(searchParams.value.approvalTemplate)

      approvalTemplates.value = response.data.items
      pagination.value.approvalTemplate = {
        total: response.data.total,
        totalPages: response.data.totalPages
      }
    } catch (error) {
      console.error('搜索审批模板失败:', error)
      ElMessage.error('搜索审批模板失败')
    } finally {
      approvalTemplatesLoading.value = false
    }
  }

  /**
   * 创建审批模板
   */
  async function createApprovalTemplate(data: Omit<ApprovalTemplate, 'id' | 'version' | 'createdBy' | 'createdAt' | 'updatedAt'>) {
    try {
      const response = await configApi.approvalTemplate.createTemplate(data)
      approvalTemplates.value.unshift(response.data)
      ElMessage.success('审批模板创建成功')
      return response.data
    } catch (error) {
      console.error('创建审批模板失败:', error)
      throw error
    }
  }

  // ============= 配置历史相关方法 =============

  /**
   * 获取配置历史
   */
  async function fetchConfigHistory(params: ConfigHistoryQuery) {
    configHistoriesLoading.value = true
    try {
      searchParams.value.history = { ...searchParams.value.history, ...params }
      const response = await configApi.history.getHistory(searchParams.value.history)

      configHistories.value = response.data.items
      pagination.value.history = {
        total: response.data.total,
        totalPages: response.data.totalPages
      }
    } catch (error) {
      console.error('获取配置历史失败:', error)
      ElMessage.error('获取配置历史失败')
    } finally {
      configHistoriesLoading.value = false
    }
  }

  // ============= 通用方法 =============

  /**
   * 获取配置权限
   */
  async function fetchPermissions() {
    try {
      const response = await configApi.getPermissions()
      permissions.value = response.data
    } catch (error) {
      console.error('获取配置权限失败:', error)
    }
  }

  /**
   * 获取配置统计
   */
  async function fetchConfigStats() {
    try {
      const response = await configApi.getStats()
      configStats.value = response.data
    } catch (error) {
      console.error('获取配置统计失败:', error)
    }
  }

  /**
   * 重置所有状态
   */
  function resetState() {
    systemConfigs.value = []
    sensitiveWords.value = []
    sensitiveWordCategories.value = []
    approvalTemplates.value = []
    configHistories.value = []
    configStats.value = null
    permissions.value = null
    selectedSystemConfig.value = null
    selectedSensitiveWord.value = null
    selectedApprovalTemplate.value = null
  }

  return {
    // 状态
    systemConfigs,
    systemConfigsLoading,
    sensitiveWords,
    sensitiveWordCategories,
    sensitiveWordsLoading,
    approvalTemplates,
    approvalTemplatesLoading,
    configHistories,
    configHistoriesLoading,
    configStats,
    permissions,
    selectedSystemConfig,
    selectedSensitiveWord,
    selectedApprovalTemplate,
    searchParams,
    pagination,

    // 计算属性
    allSystemConfigs,
    getSystemConfigsByCategory,
    getSensitiveWordsByCategory,
    activeApprovalTemplates,
    hasPermission,

    // 方法
    fetchSystemConfigs,
    searchSystemConfigs,
    updateSystemConfig,
    batchUpdateSystemConfigs,
    fetchSensitiveWordCategories,
    searchSensitiveWords,
    createSensitiveWord,
    updateSensitiveWord,
    deleteSensitiveWord,
    fetchApprovalTemplates,
    searchApprovalTemplates,
    createApprovalTemplate,
    fetchConfigHistory,
    fetchPermissions,
    fetchConfigStats,
    resetState
  }
})