<template>
  <div class="user-list">
    <!-- 页面头部 -->
    <el-card class="header-card" shadow="hover">
      <div class="header-content">
        <div class="header-left">
          <h1><el-icon><User /></el-icon> WhatsApp用户管理</h1>
          <p>管理通过扫码登录的WhatsApp用户，监控消息和联系人信息</p>
        </div>
        <div class="header-right">
          <el-button type="primary" @click="handleCreateUser" :icon="Plus">
            添加WhatsApp用户
          </el-button>
          <el-button @click="handleRefresh" :icon="Refresh" :loading="loading">
            刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 筛选条件 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :inline="true" :model="filters" class="filter-form">
        <el-form-item label="手机号">
          <el-input
            v-model="filters.phone_number"
            placeholder="请输入手机号"
            clearable
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="filters.name"
            placeholder="请输入用户名"
            clearable
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="filters.status"
            placeholder="请选择状态"
            clearable
            style="width: 150px;"
          >
            <el-option label="已连接" value="connected" />
            <el-option label="未连接" value="disconnected" />
            <el-option label="已退出" value="logged_out" />
          </el-select>
        </el-form-item>
        <el-form-item label="在线状态">
          <el-select
            v-model="filters.is_online"
            placeholder="请选择在线状态"
            clearable
            style="width: 150px;"
          >
            <el-option label="在线" :value="true" />
            <el-option label="离线" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-select
            v-model="filters.tag_id"
            placeholder="请选择标签"
            clearable
            style="width: 250px;"
            :loading="tagFilterLoading"
          >
            <el-option
              v-for="tag in filterTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <div
                  style="width: 12px; height: 12px; border-radius: 50%;"
                  :style="{ backgroundColor: tag.color }"
                />
                <span>{{ tag.name }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" :icon="Search">
            搜索
          </el-button>
          <el-button @click="handleResetFilter" :icon="RefreshLeft">
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 批量操作栏 -->
    <el-card v-if="selectedUsers.length > 0" class="batch-actions-card" shadow="hover">
      <div class="batch-actions">
        <span>已选择 {{ selectedUsers.length }} 个用户</span>
        <div class="batch-buttons">
          <el-button type="success" size="small" @click="handleBatchUpdateStatus('active')">
            批量激活
          </el-button>
          <el-button type="warning" size="small" @click="handleBatchUpdateStatus('blocked')">
            批量拉黑
          </el-button>
          <el-button type="danger" size="small" @click="handleBatchDelete">
            批量删除
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- 用户统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon total"><UserFilled /></el-icon>
            <div class="stats-content">
              <div class="stats-value">{{ userStats?.total_users || 0 }}</div>
              <div class="stats-label">总用户数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon active"><Check /></el-icon>
            <div class="stats-content">
              <div class="stats-value">{{ userStats?.active_users || 0 }}</div>
              <div class="stats-label">活跃用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon online"><Connection /></el-icon>
            <div class="stats-content">
              <div class="stats-value">{{ userStats?.online_users || 0 }}</div>
              <div class="stats-label">在线用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="stats-card">
          <div class="stats-item">
            <el-icon class="stats-icon blocked"><CloseBold /></el-icon>
            <div class="stats-content">
              <div class="stats-value">{{ userStats?.logged_out_users || 0 }}</div>
              <div class="stats-label">离线用户</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 用户列表 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        :data="users"
        v-loading="loading"
        @selection-change="handleSelectionChange"
        row-key="id"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" sortable />

        <el-table-column label="头像" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar" :size="40">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="phone_number" label="手机号" width="140" />

        <el-table-column prop="name" label="用户名" min-width="120">
          <template #default="{ row }">
            <div class="user-info">
              <div class="user-name">{{ row.name || '未设置' }}</div>
              <div class="user-username" v-if="row.username">@{{ row.username }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="在线状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.is_online ? 'success' : 'info'" size="small">
              <el-icon><Connection /></el-icon>
              {{ row.is_online ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="标签" min-width="200">
          <template #default="{ row }">
            <div class="user-tags" v-if="row.tags && row.tags.length > 0">
              <el-tag
                v-for="tag in row.tags"
                :key="tag.id"
                :color="tag.color"
                size="small"
                style="margin-right: 4px; margin-bottom: 4px;"
              >
                {{ tag.name }}
              </el-tag>
            </div>
            <span v-else style="color: #999; font-size: 12px;">无标签</span>
          </template>
        </el-table-column>

        <el-table-column prop="message_count" label="消息数量" width="100" sortable />

        <el-table-column label="最后在线" width="160">
          <template #default="{ row }">
            {{ row.last_seen ? formatDateTime(row.last_seen) : '未知' }}
          </template>
        </el-table-column>

        <el-table-column label="注册时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.created_at) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleViewUser(row)" :icon="View">
              查看
            </el-button>
            <el-dropdown @command="(command: string) => handleUserAction(command, row)">
              <el-button size="small" :icon="More">
                更多 <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="toggleStatus">
                    {{ row.status === 'active' ? '停用' : '启用' }}用户
                  </el-dropdown-item>
                  <el-dropdown-item command="manageTags">管理标签</el-dropdown-item>
                  <el-dropdown-item command="resetPassword">重置密码</el-dropdown-item>
                  <el-dropdown-item command="viewMessages">查看消息</el-dropdown-item>
                  <el-dropdown-item command="delete" divided>删除用户</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="paginationInfo.current"
          v-model:page-size="paginationInfo.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="paginationInfo.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <UserDetailDialog
      v-model:visible="userDetailVisible"
      :user="selectedUser"
      @updated="handleUserUpdated"
    />


    <!-- WhatsApp登录对话框 -->
    <WhatsAppLoginDialog
      v-model:visible="whatsappLoginVisible"
      @success="handleUserCreated"
    />

    <!-- 标签管理对话框 -->
    <el-dialog v-model="tagManagementVisible" title="管理账号标签" width="600px">
      <div class="tag-management-dialog">
        <div class="current-tags" v-if="currentUserTags.length > 0">
          <h4>当前标签</h4>
          <div class="tags-list">
            <el-tag
              v-for="tag in currentUserTags"
              :key="tag.id"
              :color="tag.color"
              closable
              @close="handleRemoveTag(tag.id)"
              style="margin-right: 8px; margin-bottom: 8px;"
            >
              {{ tag.name }}
            </el-tag>
          </div>
        </div>

        <el-divider />

        <div class="add-tags">
          <h4>添加标签</h4>
          <el-select
            v-model="selectedTagIds"
            multiple
            placeholder="请选择要添加的标签"
            style="width: 100%"
            :loading="tagLoading"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="tag.name"
              :value="tag.id"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <div
                  style="width: 16px; height: 16px; border-radius: 50%;"
                  :style="{ backgroundColor: tag.color }"
                />
                <span>{{ tag.name }}</span>
                <span style="color: #999; font-size: 12px;">({{ tag.account_count }}个账号)</span>
              </div>
            </el-option>
          </el-select>
        </div>
      </div>

      <template #footer>
        <el-button @click="tagManagementVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="tagLoading"
          :disabled="selectedTagIds.length === 0"
          @click="handleAddTags"
        >
          添加标签
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import {
  User, Plus, Refresh, Search, RefreshLeft, UserFilled, Check,
  Connection, CloseBold, View, More, ArrowDown
} from '@element-plus/icons-vue'
import { useUserStore } from '@/stores/user'
import type { User as UserType, UserListParams, UserStatsResponse as UserStats } from '@/types/user'
import type { AccountTag } from '@/api/tag'
import * as tagApi from '@/api/tag'
import UserDetailDialog from '@/components/users/UserDetailDialog.vue'
import WhatsAppLoginDialog from '@/components/users/WhatsAppLoginDialog.vue'

// Store
const userStore = useUserStore()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const selectedUsers = ref<UserType[]>([])
const selectedUser = ref<UserType | null>(null)
const userDetailVisible = ref(false)
const whatsappLoginVisible = ref(false)
const tagManagementVisible = ref(false)

// 标签管理相关状态
const currentUserTags = ref<AccountTag[]>([])
const availableTags = ref<AccountTag[]>([])
const selectedTagIds = ref<number[]>([])
const tagLoading = ref(false)
const currentManagingUser = ref<UserType | null>(null)

// 标签筛选相关状态
const filterTags = ref<AccountTag[]>([])
const tagFilterLoading = ref(false)
const userStats = ref<UserStats | null>(null)

// 筛选条件
const filters = reactive<UserListParams>({
  page: 1,
  page_size: 20,
  sort_by: 'created_at',
  sort_order: 'desc'
})

// 计算属性
const users = computed(() => userStore.users)
const paginationInfo = computed(() => userStore.paginationInfo)

// 状态相关方法
const getStatusType = (status: string) => {
  const statusMap = {
    connected: 'success',
    disconnected: 'info',
    logged_out: 'danger'
  }
  return statusMap[status as keyof typeof statusMap] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap = {
    connected: '已连接',
    disconnected: '未连接',
    logged_out: '已退出'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 格式化时间
const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN')
}

// 事件处理方法
const handleSearch = async () => {
  try {
    loading.value = true
    await userStore.fetchUsers(filters)
  } finally {
    loading.value = false
  }
}

const handleResetFilter = () => {
  Object.assign(filters, {
    page: 1,
    page_size: 20,
    sort_by: 'created_at',
    sort_order: 'desc',
    phone_number: '',
    name: '',
    status: '',
    is_online: undefined,
    country: ''
  })
  handleSearch()
}

const handleRefresh = () => {
  handleSearch()
  loadUserStats()
}

const handleSelectionChange = (selection: UserType[]) => {
  selectedUsers.value = selection
}

const handleSizeChange = (size: number) => {
  filters.page_size = size
  handleSearch()
}

const handleCurrentChange = (page: number) => {
  filters.page = page
  handleSearch()
}

const handleCreateUser = () => {
  whatsappLoginVisible.value = true
}

const handleViewUser = (user: UserType) => {
  selectedUser.value = user
  userDetailVisible.value = true
}

const handleViewMessages = async (user: UserType) => {
  router.push({ name: 'UserMessages', params: { userId: user.id } })
}

const handleUserAction = async (command: string, user: UserType) => {
  switch (command) {
    case 'toggleStatus':
      await handleToggleUserStatus(user)
      break
    case 'manageTags':
      await handleManageTags(user)
      break
    case 'resetPassword':
      ElMessage.info('重置密码功能即将开放')
      break
    case 'viewMessages':
      await handleViewMessages(user)
      break
    case 'delete':
      await handleDeleteUser(user)
      break
  }
}

const handleToggleUserStatus = async (user: UserType) => {
  const newStatus = user.status === 'active' ? 'inactive' : 'active'
  const action = newStatus === 'active' ? '启用' : '停用'

  try {
    await ElMessageBox.confirm(`确定要${action}用户 ${user.name || user.phone_number}?`, '确认操作')
    await userStore.updateUserStatus(user.id, newStatus as any)
    ElMessage.success(`用户${action}成功`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Toggle user status error:', error)
    }
  }
}

const handleDeleteUser = async (user: UserType) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除用户 ${user.name || user.phone_number}? 此操作将删除该用户的所有数据,包括消息、会话、设备信息等,且不可恢复!`,
      '危险操作',
      {
        type: 'error',
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true
      }
    )

    // 显示全屏加载动画
    const loading = ElLoading.service({
      lock: true,
      text: '正在删除用户及所有关联数据...',
      background: 'rgba(0, 0, 0, 0.7)',
      spinner: 'el-icon-loading',
      customClass: 'delete-loading'
    })

    try {
      await userStore.deleteUser(user.id)
      ElMessage.success('用户删除成功')
    } finally {
      loading.close()
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Delete user error:', error)
      ElMessage.error('删除用户失败')
    }
  }
}

const handleBatchUpdateStatus = async (status: 'active' | 'blocked') => {
  const userIds = selectedUsers.value.map(user => user.id)
  const action = status === 'active' ? '激活' : '拉黑'

  try {
    await ElMessageBox.confirm(`确定要${action}选中的 ${userIds.length} 个用户?`, '确认批量操作')

    await userStore.batchOperation({
      user_ids: userIds,
      operation: 'update_status',
      data: { status }
    })

    ElMessage.success(`批量${action}成功`)
    selectedUsers.value = []
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Batch update status error:', error)
    }
  }
}

const handleBatchDelete = async () => {
  const userIds = selectedUsers.value.map(user => user.id)

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${userIds.length} 个用户? 此操作不可逆!`,
      '危险操作',
      { type: 'error' }
    )

    await userStore.batchOperation({
      user_ids: userIds,
      operation: 'delete',
      data: {}
    })

    ElMessage.success('批量删除成功')
    selectedUsers.value = []
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Batch delete error:', error)
    }
  }
}

const handleUserUpdated = () => {
  handleRefresh()
}

const handleUserCreated = () => {
  handleRefresh()
}

const loadUserStats = async () => {
  try {
    userStats.value = await userStore.fetchUserStats()
  } catch (error) {
    console.error('Load user stats error:', error)
  }
}

// 标签管理方法
const handleManageTags = async (user: UserType) => {
  currentManagingUser.value = user
  tagManagementVisible.value = true
  selectedTagIds.value = []

  // 加载所有可用标签和当前用户的标签
  await Promise.all([loadAvailableTags(), loadUserTags(user.id)])
}

const loadAvailableTags = async () => {
  tagLoading.value = true
  try {
    const response = await tagApi.getTagList({ limit: 1000 })
    if (response.data && 'list' in response.data) {
      availableTags.value = response.data.list
    }
  } catch (error: any) {
    ElMessage.error(error.message || '获取标签列表失败')
  } finally {
    tagLoading.value = false
  }
}

const loadUserTags = async (userId: number) => {
  tagLoading.value = true
  try {
    const response = await tagApi.getAccountTags(userId)
    if (response.data) {
      currentUserTags.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    console.error('获取用户标签失败:', error)
    currentUserTags.value = []
  } finally {
    tagLoading.value = false
  }
}

const handleAddTags = async () => {
  if (!currentManagingUser.value || selectedTagIds.value.length === 0) {
    return
  }

  tagLoading.value = true
  try {
    await tagApi.addAccountTags(currentManagingUser.value.id, selectedTagIds.value)
    ElMessage.success('添加标签成功')
    selectedTagIds.value = []
    await loadUserTags(currentManagingUser.value.id)
  } catch (error: any) {
    ElMessage.error(error.message || '添加标签失败')
  } finally {
    tagLoading.value = false
  }
}

const handleRemoveTag = async (tagId: number) => {
  if (!currentManagingUser.value) {
    return
  }

  try {
    await ElMessageBox.confirm('确定要移除这个标签吗?', '确认操作')
    tagLoading.value = true

    await tagApi.removeAccountTag(currentManagingUser.value.id, tagId)
    ElMessage.success('移除标签成功')
    await loadUserTags(currentManagingUser.value.id)
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(error.message || '移除标签失败')
    }
  } finally {
    tagLoading.value = false
  }
}

// 加载筛选标签列表
const loadFilterTags = async () => {
  tagFilterLoading.value = true
  try {
    const response = await tagApi.getTagList({ limit: 1000 })
    if (response.data && 'list' in response.data) {
      filterTags.value = response.data.list
    }
  } catch (error: any) {
    console.error('获取标签列表失败:', error)
  } finally {
    tagFilterLoading.value = false
  }
}

// 生命周期
onMounted(() => {
  handleSearch()
  loadUserStats()
  loadFilterTags()
})
</script>

<style scoped>
.user-list {
  padding: 20px;
}

.header-card {
  margin-bottom: 20px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left p {
  margin: 0;
  color: #7f8c8d;
}

.header-right {
  display: flex;
  gap: 10px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-form {
  margin: 0;
}

.batch-actions-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-buttons {
  display: flex;
  gap: 10px;
}

.stats-row {
  margin-bottom: 20px;
}

.stats-card {
  height: 100px;
}

.stats-item {
  display: flex;
  align-items: center;
  height: 100%;
}

.stats-icon {
  font-size: 40px;
  margin-right: 15px;
}

.stats-icon.total {
  color: #3498db;
}

.stats-icon.active {
  color: #27ae60;
}

.stats-icon.online {
  color: #f39c12;
}

.stats-icon.blocked {
  color: #e74c3c;
}

.stats-content {
  flex: 1;
}

.stats-value {
  font-size: 28px;
  font-weight: bold;
  color: #2c3e50;
}

.stats-label {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.table-card {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #2c3e50;
}

.user-username {
  font-size: 12px;
  color: #95a5a6;
  margin-top: 2px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-card__body) {
  padding: 20px;
}

:deep(.batch-actions-card .el-card__body) {
  padding: 15px 20px;
}

:deep(.stats-card .el-card__body) {
  padding: 15px;
}

/* 标签管理对话框样式 */
.tag-management-dialog {
  padding: 10px 0;
}

.tag-management-dialog h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  color: #606266;
}

.current-tags .tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.add-tags {
  margin-top: 20px;
}

/* 用户标签列样式 */
.user-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

/* 删除加载动画样式 */
:deep(.delete-loading) {
  background: rgba(0, 0, 0, 0.8) !important;
}

:deep(.delete-loading .el-loading-text) {
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  margin-top: 10px;
}

:deep(.delete-loading .el-loading-spinner) {
  font-size: 50px;
}

:deep(.delete-loading .el-loading-spinner .path) {
  stroke: #409eff;
  stroke-width: 3;
}
</style>