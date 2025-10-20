import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import userApi, { userTagApi, userStatsApi } from '@/api/user'
import type {
  User,
  UserListParams,
  UserListResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserStatsResponse,
  UserChartsResponse,
  BatchOperationRequest,
  UserSearchParams,
  UserStatus
} from '@/types/user'
import type { Tag } from '@/types/tag'
import { ElMessage } from 'element-plus'

export const useUserStore = defineStore('user', () => {
  // State
  const users = ref<User[]>([])
  const currentUser = ref<User | null>(null)
  const userTags = ref<Tag[]>([])
  const userStats = ref<UserStatsResponse | null>(null)
  const userCharts = ref<UserChartsResponse | null>(null)
  const totalUsers = ref(0)
  const currentPage = ref(1)
  const pageSize = ref(20)
  const totalPages = ref(0)
  const loading = ref(false)
  const searchLoading = ref(false)

  // Filter state
  const filters = ref<UserListParams>({
    page: 1,
    page_size: 20,
    sort_by: 'created_at',
    sort_order: 'desc'
  })

  // Computed
  const hasUsers = computed(() => users.value.length > 0)
  const activeUsers = computed(() => users.value.filter(user => user.status === UserStatus.ACTIVE))
  const onlineUsers = computed(() => users.value.filter(user => user.is_online))
  const paginationInfo = computed(() => ({
    total: totalUsers.value,
    current: currentPage.value,
    pageSize: pageSize.value,
    totalPages: totalPages.value
  }))

  // Actions
  const fetchUsers = async (params: UserListParams = {}) => {
    loading.value = true
    try {
      const mergedParams = { ...filters.value, ...params }
      const response: UserListResponse = await userApi.list(mergedParams)

      users.value = response.users
      totalUsers.value = response.total
      currentPage.value = response.page
      pageSize.value = response.page_size
      totalPages.value = response.total_pages

      // Update filters with actual params used
      filters.value = mergedParams

      return response
    } catch (error) {
      ElMessage.error('获取用户列表失败')
      console.error('Failed to fetch users:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id: number) => {
    loading.value = true
    try {
      const user = await userApi.getById(id)
      currentUser.value = user
      return user
    } catch (error) {
      ElMessage.error('获取用户详情失败')
      console.error('Failed to fetch user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const createUser = async (data: UserCreateRequest) => {
    loading.value = true
    try {
      const user = await userApi.create(data)
      users.value.unshift(user)
      totalUsers.value++
      ElMessage.success('创建用户成功')
      return user
    } catch (error) {
      ElMessage.error('创建用户失败')
      console.error('Failed to create user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUser = async (id: number, data: UserUpdateRequest) => {
    loading.value = true
    try {
      const updatedUser = await userApi.update(id, data)

      // Update in list
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }

      ElMessage.success('更新用户成功')
      return updatedUser
    } catch (error) {
      ElMessage.error('更新用户失败')
      console.error('Failed to update user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteUser = async (id: number) => {
    loading.value = true
    try {
      await userApi.delete(id)

      // Remove from list
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value.splice(index, 1)
        totalUsers.value--
      }

      // Clear current user if it's the deleted one
      if (currentUser.value?.id === id) {
        currentUser.value = null
      }

      ElMessage.success('删除用户成功')
    } catch (error) {
      ElMessage.error('删除用户失败')
      console.error('Failed to delete user:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateUserStatus = async (id: number, status: UserStatus) => {
    try {
      const updatedUser = await userApi.updateStatus(id, status)

      // Update in list
      const index = users.value.findIndex(user => user.id === id)
      if (index !== -1) {
        users.value[index] = updatedUser
      }

      // Update current user if it's the same
      if (currentUser.value?.id === id) {
        currentUser.value = updatedUser
      }

      ElMessage.success('更新用户状态成功')
      return updatedUser
    } catch (error) {
      ElMessage.error('更新用户状态失败')
      console.error('Failed to update user status:', error)
      throw error
    }
  }

  const searchUsers = async (params: UserSearchParams) => {
    searchLoading.value = true
    try {
      const results = await userApi.search(params)
      return results
    } catch (error) {
      ElMessage.error('搜索用户失败')
      console.error('Failed to search users:', error)
      throw error
    } finally {
      searchLoading.value = false
    }
  }

  const batchOperation = async (data: BatchOperationRequest) => {
    loading.value = true
    try {
      const result = await userApi.batch(data)

      // Refresh users list after batch operation
      await fetchUsers()

      ElMessage.success(`批量操作成功，影响 ${result.affected_count} 个用户`)
      return result
    } catch (error) {
      ElMessage.error('批量操作失败')
      console.error('Failed to perform batch operation:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  // User tags actions
  const fetchUserTags = async (userId: number) => {
    try {
      const tags = await userTagApi.getUserTags(userId)
      userTags.value = tags
      return tags
    } catch (error) {
      ElMessage.error('获取用户标签失败')
      console.error('Failed to fetch user tags:', error)
      throw error
    }
  }

  const setUserTags = async (userId: number, tagIds: number[]) => {
    try {
      const tags = await userTagApi.setUserTags(userId, tagIds)
      userTags.value = tags

      // Update user in list if present
      const user = users.value.find(u => u.id === userId)
      if (user) {
        // Note: User model doesn't have tags field, but this could be extended
      }

      ElMessage.success('设置用户标签成功')
      return tags
    } catch (error) {
      ElMessage.error('设置用户标签失败')
      console.error('Failed to set user tags:', error)
      throw error
    }
  }

  const addUserTags = async (userId: number, tagIds: number[]) => {
    try {
      const tags = await userTagApi.addUserTags(userId, tagIds)
      userTags.value = tags
      ElMessage.success('添加用户标签成功')
      return tags
    } catch (error) {
      ElMessage.error('添加用户标签失败')
      console.error('Failed to add user tags:', error)
      throw error
    }
  }

  const removeUserTag = async (userId: number, tagId: number) => {
    try {
      await userTagApi.removeUserTag(userId, tagId)
      userTags.value = userTags.value.filter(tag => tag.id !== tagId)
      ElMessage.success('移除用户标签成功')
    } catch (error) {
      ElMessage.error('移除用户标签失败')
      console.error('Failed to remove user tag:', error)
      throw error
    }
  }

  // Statistics actions
  const fetchUserStats = async () => {
    try {
      const stats = await userStatsApi.getStats()
      userStats.value = stats
      return stats
    } catch (error) {
      ElMessage.error('获取用户统计失败')
      console.error('Failed to fetch user stats:', error)
      throw error
    }
  }

  const fetchUserCharts = async (params: {
    period?: 'day' | 'week' | 'month' | 'year'
    start_date?: string
    end_date?: string
  } = {}) => {
    try {
      const charts = await userStatsApi.getCharts(params)
      userCharts.value = charts
      return charts
    } catch (error) {
      ElMessage.error('获取用户图表数据失败')
      console.error('Failed to fetch user charts:', error)
      throw error
    }
  }

  // Utility actions
  const setFilters = (newFilters: Partial<UserListParams>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      page: 1,
      page_size: 20,
      sort_by: 'created_at',
      sort_order: 'desc'
    }
  }

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  const clearUsers = () => {
    users.value = []
    totalUsers.value = 0
    currentPage.value = 1
    totalPages.value = 0
  }

  return {
    // State
    users,
    currentUser,
    userTags,
    userStats,
    userCharts,
    totalUsers,
    currentPage,
    pageSize,
    totalPages,
    loading,
    searchLoading,
    filters,

    // Computed
    hasUsers,
    activeUsers,
    onlineUsers,
    paginationInfo,

    // Actions
    fetchUsers,
    fetchUserById,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    searchUsers,
    batchOperation,
    fetchUserTags,
    setUserTags,
    addUserTags,
    removeUserTag,
    fetchUserStats,
    fetchUserCharts,
    setFilters,
    resetFilters,
    clearCurrentUser,
    clearUsers
  }
})