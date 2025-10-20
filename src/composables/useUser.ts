import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import type {
  User,
  UserListParams,
  UserCreateRequest,
  UserUpdateRequest,
  UserStatus,
  UserSearchParams,
  BatchOperationRequest,
  UserFilter,
  UserTableColumn
} from '@/types/user'
import { ElMessageBox } from 'element-plus'

export function useUser() {
  const userStore = useUserStore()

  // Local state for form handling
  const userForm = ref<UserCreateRequest>({
    phone_number: '',
    name: '',
    username: '',
    is_bot: false,
    status: UserStatus.ACTIVE
  })

  const editUserForm = ref<UserUpdateRequest>({})
  const isFormValid = ref(false)

  // Computed properties
  const users = computed(() => userStore.users)
  const currentUser = computed(() => userStore.currentUser)
  const userTags = computed(() => userStore.userTags)
  const loading = computed(() => userStore.loading)
  const searchLoading = computed(() => userStore.searchLoading)
  const paginationInfo = computed(() => userStore.paginationInfo)
  const filters = computed(() => userStore.filters)

  // Form validation rules
  const userFormRules = {
    phone_number: [
      { required: true, message: '请输入手机号', trigger: 'blur' },
      { pattern: /^[+]?[\d\s-()]+$/, message: '请输入有效的手机号', trigger: 'blur' }
    ],
    name: [
      { max: 100, message: '名称长度不能超过100个字符', trigger: 'blur' }
    ],
    username: [
      { max: 100, message: '用户名长度不能超过100个字符', trigger: 'blur' }
    ],
    status: [
      { required: true, message: '请选择用户状态', trigger: 'change' }
    ]
  }

  // Table columns configuration
  const userTableColumns: UserTableColumn[] = [
    {
      prop: 'selection',
      label: '选择',
      width: 55,
      fixed: 'left'
    },
    {
      prop: 'id',
      label: 'ID',
      width: 80,
      sortable: true
    },
    {
      prop: 'phone_number',
      label: '手机号',
      width: 140,
      sortable: true
    },
    {
      prop: 'name',
      label: '姓名',
      width: 120,
      sortable: true
    },
    {
      prop: 'username',
      label: '用户名',
      width: 120,
      sortable: true
    },
    {
      prop: 'is_online',
      label: '在线状态',
      width: 100,
      formatter: (row: User) => row.is_online ? '在线' : '离线'
    },
    {
      prop: 'status',
      label: '状态',
      width: 100,
      sortable: true
    },
    {
      prop: 'country',
      label: '国家',
      width: 100,
      sortable: true
    },
    {
      prop: 'city',
      label: '城市',
      width: 100,
      sortable: true
    },
    {
      prop: 'language',
      label: '语言',
      width: 100,
      sortable: true
    },
    {
      prop: 'message_count',
      label: '消息数',
      width: 100,
      sortable: true
    },
    {
      prop: 'last_seen',
      label: '最后在线',
      width: 160,
      sortable: true,
      formatter: (row: User) => row.last_seen ? new Date(row.last_seen).toLocaleString() : '-'
    },
    {
      prop: 'created_at',
      label: '创建时间',
      width: 160,
      sortable: true,
      formatter: (row: User) => new Date(row.created_at).toLocaleString()
    },
    {
      prop: 'actions',
      label: '操作',
      width: 200,
      fixed: 'right'
    }
  ]

  // Status options
  const statusOptions = [
    { label: '全部', value: '' },
    { label: '活跃', value: UserStatus.ACTIVE },
    { label: '非活跃', value: UserStatus.INACTIVE },
    { label: '已屏蔽', value: UserStatus.BLOCKED },
    { label: '待审核', value: UserStatus.PENDING }
  ]

  // User operations
  const fetchUsers = async (params?: UserListParams) => {
    return await userStore.fetchUsers(params)
  }

  const fetchUserById = async (id: number) => {
    return await userStore.fetchUserById(id)
  }

  const createUser = async () => {
    if (!isFormValid.value) {
      throw new Error('表单验证失败')
    }
    return await userStore.createUser(userForm.value)
  }

  const updateUser = async (id: number) => {
    return await userStore.updateUser(id, editUserForm.value)
  }

  const deleteUser = async (id: number) => {
    await ElMessageBox.confirm(
      '确定要删除这个用户吗？删除后不可恢复。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    return await userStore.deleteUser(id)
  }

  const updateUserStatus = async (id: number, status: UserStatus) => {
    return await userStore.updateUserStatus(id, status)
  }

  const searchUsers = async (params: UserSearchParams) => {
    return await userStore.searchUsers(params)
  }

  const batchOperation = async (data: BatchOperationRequest) => {
    const operationNames = {
      update_status: '更新状态',
      delete: '删除',
      add_tags: '添加标签',
      remove_tags: '移除标签'
    }

    const operationName = operationNames[data.operation] || '操作'

    await ElMessageBox.confirm(
      `确定要对选中的 ${data.user_ids.length} 个用户执行${operationName}吗？`,
      '确认批量操作',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    return await userStore.batchOperation(data)
  }

  // User tags operations
  const fetchUserTags = async (userId: number) => {
    return await userStore.fetchUserTags(userId)
  }

  const setUserTags = async (userId: number, tagIds: number[]) => {
    return await userStore.setUserTags(userId, tagIds)
  }

  const addUserTags = async (userId: number, tagIds: number[]) => {
    return await userStore.addUserTags(userId, tagIds)
  }

  const removeUserTag = async (userId: number, tagId: number) => {
    return await userStore.removeUserTag(userId, tagId)
  }

  // Form management
  const resetUserForm = () => {
    userForm.value = {
      phone_number: '',
      name: '',
      username: '',
      is_bot: false,
      status: UserStatus.ACTIVE
    }
    isFormValid.value = false
  }

  const resetEditUserForm = () => {
    editUserForm.value = {}
  }

  const setEditUserForm = (user: User) => {
    editUserForm.value = {
      name: user.name,
      username: user.username,
      country: user.country,
      city: user.city,
      language: user.language,
      status: user.status
    }
  }

  // Filter management
  const setFilters = (newFilters: Partial<UserListParams>) => {
    userStore.setFilters(newFilters)
  }

  const resetFilters = () => {
    userStore.resetFilters()
  }

  // Pagination
  const handlePageChange = (page: number) => {
    setFilters({ page })
    fetchUsers()
  }

  const handlePageSizeChange = (pageSize: number) => {
    setFilters({ page: 1, page_size: pageSize })
    fetchUsers()
  }

  // Sorting
  const handleSort = (column: any) => {
    const sortBy = column.prop
    const sortOrder = column.order === 'ascending' ? 'asc' : 'desc'
    setFilters({ sort_by: sortBy, sort_order: sortOrder })
    fetchUsers()
  }

  // Utility functions
  const formatUserStatus = (status: UserStatus) => {
    const statusMap = {
      [UserStatus.ACTIVE]: { text: '活跃', type: 'success' },
      [UserStatus.INACTIVE]: { text: '非活跃', type: 'info' },
      [UserStatus.BLOCKED]: { text: '已屏蔽', type: 'danger' },
      [UserStatus.PENDING]: { text: '待审核', type: 'warning' }
    }
    return statusMap[status] || { text: status, type: 'info' }
  }

  const formatOnlineStatus = (isOnline: boolean) => {
    return {
      text: isOnline ? '在线' : '离线',
      type: isOnline ? 'success' : 'info'
    }
  }

  const formatLastSeen = (lastSeen?: string) => {
    if (!lastSeen) return '-'
    const date = new Date(lastSeen)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`
    return date.toLocaleDateString()
  }

  return {
    // State
    userForm,
    editUserForm,
    isFormValid,

    // Computed
    users,
    currentUser,
    userTags,
    loading,
    searchLoading,
    paginationInfo,
    filters,

    // Configuration
    userFormRules,
    userTableColumns,
    statusOptions,

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

    // Form management
    resetUserForm,
    resetEditUserForm,
    setEditUserForm,

    // Filter and pagination
    setFilters,
    resetFilters,
    handlePageChange,
    handlePageSizeChange,
    handleSort,

    // Utilities
    formatUserStatus,
    formatOnlineStatus,
    formatLastSeen
  }
}

export function useUserStats() {
  const userStore = useUserStore()

  const userStats = computed(() => userStore.userStats)
  const userCharts = computed(() => userStore.userCharts)

  const fetchUserStats = async () => {
    return await userStore.fetchUserStats()
  }

  const fetchUserCharts = async (params: {
    period?: 'day' | 'week' | 'month' | 'year'
    start_date?: string
    end_date?: string
  } = {}) => {
    return await userStore.fetchUserCharts(params)
  }

  // Chart configuration helpers
  const getUserGrowthChartOptions = (data: Array<{ date: string; count: number }>) => ({
    title: {
      text: '用户增长趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.date)
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      name: '新增用户',
      type: 'line',
      data: data.map(item => item.count),
      smooth: true
    }]
  })

  const getStatusDistributionChartOptions = (data: Array<{ status: string; count: number }>) => ({
    title: {
      text: '用户状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      name: '用户状态',
      type: 'pie',
      radius: '50%',
      data: data.map(item => ({ value: item.count, name: item.status }))
    }]
  })

  return {
    userStats,
    userCharts,
    fetchUserStats,
    fetchUserCharts,
    getUserGrowthChartOptions,
    getStatusDistributionChartOptions
  }
}