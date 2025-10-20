<template>
  <div class="user-detail-container">
    <!-- Header -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="$router.back()">
          <el-icon><ArrowLeft /></el-icon>
          返回
        </el-button>
        <h1>用户详情</h1>
      </div>
      <div class="header-actions" v-if="currentUser">
        <el-button type="primary" @click="showEditDialog = true">
          <el-icon><Edit /></el-icon>
          编辑用户
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>
          删除用户
        </el-button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- User Details -->
    <div v-else-if="currentUser" class="user-details">
      <!-- Basic Information -->
      <el-card class="info-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3>基本信息</h3>
            <el-tag :type="formatUserStatus(currentUser.status).type">
              {{ formatUserStatus(currentUser.status).text }}
            </el-tag>
          </div>
        </template>

        <div class="info-grid">
          <div class="info-item">
            <label>用户ID:</label>
            <span>{{ currentUser.id }}</span>
          </div>
          <div class="info-item">
            <label>手机号:</label>
            <span>{{ currentUser.phone_number }}</span>
          </div>
          <div class="info-item">
            <label>姓名:</label>
            <span>{{ currentUser.name || '-' }}</span>
          </div>
          <div class="info-item">
            <label>用户名:</label>
            <span>{{ currentUser.username || '-' }}</span>
          </div>
          <div class="info-item">
            <label>是否机器人:</label>
            <el-tag :type="currentUser.is_bot ? 'warning' : 'success'">
              {{ currentUser.is_bot ? '是' : '否' }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>在线状态:</label>
            <el-tag :type="formatOnlineStatus(currentUser.is_online).type">
              {{ formatOnlineStatus(currentUser.is_online).text }}
            </el-tag>
          </div>
          <div class="info-item">
            <label>国家:</label>
            <span>{{ currentUser.country || '-' }}</span>
          </div>
          <div class="info-item">
            <label>城市:</label>
            <span>{{ currentUser.city || '-' }}</span>
          </div>
          <div class="info-item">
            <label>语言:</label>
            <span>{{ currentUser.language || '-' }}</span>
          </div>
          <div class="info-item">
            <label>消息数量:</label>
            <span>{{ currentUser.message_count.toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <label>最后在线:</label>
            <span>{{ formatLastSeen(currentUser.last_seen) }}</span>
          </div>
          <div class="info-item">
            <label>创建时间:</label>
            <span>{{ new Date(currentUser.created_at).toLocaleString() }}</span>
          </div>
          <div class="info-item">
            <label>更新时间:</label>
            <span>{{ new Date(currentUser.updated_at).toLocaleString() }}</span>
          </div>
        </div>
      </el-card>

      <!-- Tags Management -->
      <el-card class="tags-card" shadow="never">
        <template #header>
          <div class="card-header">
            <h3>用户标签</h3>
            <el-button size="small" type="primary" @click="showTagDialog = true">
              <el-icon><Plus /></el-icon>
              管理标签
            </el-button>
          </div>
        </template>

        <div v-if="userTags.length > 0" class="tags-container">
          <el-tag
            v-for="tag in userTags"
            :key="tag.id"
            :color="tag.color"
            closable
            size="large"
            style="margin-right: 8px; margin-bottom: 8px;"
            @close="handleRemoveTag(tag.id)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
        <div v-else class="empty-tags">
          <el-empty description="暂无标签" :image-size="80" />
        </div>
      </el-card>

      <!-- Statistics -->
      <el-card class="stats-card" shadow="never">
        <template #header>
          <h3>用户统计</h3>
        </template>

        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ currentUser.message_count }}</div>
            <div class="stat-label">总消息数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userTags.length }}</div>
            <div class="stat-label">标签数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ Math.floor((Date.now() - new Date(currentUser.created_at).getTime()) / (1000 * 60 * 60 * 24)) }}
            </div>
            <div class="stat-label">注册天数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">
              {{ currentUser.last_seen ? getLastSeenDays(currentUser.last_seen) : '-' }}
            </div>
            <div class="stat-label">最后活跃(天前)</div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- User Not Found -->
    <div v-else class="not-found">
      <el-empty description="用户不存在" />
    </div>

    <!-- Edit User Dialog -->
    <el-dialog v-model="showEditDialog" title="编辑用户" width="600px">
      <el-form
        ref="editFormRef"
        :model="editUserForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editUserForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="editUserForm.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="editUserForm.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-input v-model="editUserForm.language" placeholder="请输入语言" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="editUserForm.status" placeholder="请选择状态">
            <el-option
              v-for="option in statusOptions.slice(1)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showEditDialog = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleUpdate">更新</el-button>
      </template>
    </el-dialog>

    <!-- Tag Management Dialog -->
    <el-dialog v-model="showTagDialog" title="管理用户标签" width="600px">
      <div class="tag-management">
        <!-- Current Tags -->
        <div class="current-tags">
          <h4>当前标签</h4>
          <div v-if="userTags.length > 0" class="tags-list">
            <el-tag
              v-for="tag in userTags"
              :key="tag.id"
              :color="tag.color"
              closable
              style="margin-right: 8px; margin-bottom: 8px;"
              @close="handleRemoveTag(tag.id)"
            >
              {{ tag.name }}
            </el-tag>
          </div>
          <div v-else class="empty-message">暂无标签</div>
        </div>

        <!-- Available Tags -->
        <div class="available-tags">
          <h4>可用标签</h4>
          <el-select
            v-model="selectedNewTags"
            multiple
            filterable
            placeholder="选择要添加的标签"
            style="width: 100%"
          >
            <el-option
              v-for="tag in availableTags"
              :key="tag.id"
              :label="`${tag.name} (${tag.user_count} 用户)`"
              :value="tag.id"
            >
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span>{{ tag.name }}</span>
                <el-tag :color="tag.color" size="small">{{ tag.user_count }}</el-tag>
              </div>
            </el-option>
          </el-select>
          <el-button
            type="primary"
            style="margin-top: 10px; width: 100%"
            :disabled="selectedNewTags.length === 0"
            @click="handleAddTags"
          >
            添加选中标签
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import { useTag } from '@/composables/useTag'

const route = useRoute()
const router = useRouter()

// Composables
const {
  currentUser,
  userTags,
  loading,
  editUserForm,
  userFormRules,
  statusOptions,
  fetchUserById,
  updateUser,
  deleteUser,
  fetchUserTags,
  addUserTags,
  removeUserTag,
  setEditUserForm,
  resetEditUserForm,
  formatUserStatus,
  formatOnlineStatus,
  formatLastSeen
} = useUser()

const { allTags, fetchAllTags } = useTag()

// Dialog states
const showEditDialog = ref(false)
const showTagDialog = ref(false)

// Form refs
const editFormRef = ref()

// Tag management
const selectedNewTags = ref<number[]>([])

// Computed
const userId = computed(() => Number(route.params.id))

const availableTags = computed(() => {
  const userTagIds = userTags.value.map(tag => tag.id)
  return allTags.value.filter(tag => !userTagIds.includes(tag.id))
})

// Methods
const loadUserData = async () => {
  if (userId.value) {
    try {
      await fetchUserById(userId.value)
      await fetchUserTags(userId.value)
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }
}

const handleUpdate = async () => {
  if (!currentUser.value) return

  try {
    await editFormRef.value.validate()
    await updateUser(currentUser.value.id)
    showEditDialog.value = false
    resetEditUserForm()
    // Reload user data
    await loadUserData()
  } catch (error) {
    console.error('Update user failed:', error)
  }
}

const handleDelete = async () => {
  if (!currentUser.value) return

  try {
    await deleteUser(currentUser.value.id)
    router.push({ name: 'Users' })
  } catch (error) {
    console.error('Delete user failed:', error)
  }
}

const handleAddTags = async () => {
  if (!currentUser.value || selectedNewTags.value.length === 0) return

  try {
    await addUserTags(currentUser.value.id, selectedNewTags.value)
    selectedNewTags.value = []
    await fetchUserTags(currentUser.value.id)
  } catch (error) {
    console.error('Add tags failed:', error)
  }
}

const handleRemoveTag = async (tagId: number) => {
  if (!currentUser.value) return

  try {
    await removeUserTag(currentUser.value.id, tagId)
    await fetchUserTags(currentUser.value.id)
  } catch (error) {
    console.error('Remove tag failed:', error)
  }
}

const getLastSeenDays = (lastSeen: string): number => {
  const date = new Date(lastSeen)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

// Watch for edit dialog
const openEditDialog = () => {
  if (currentUser.value) {
    setEditUserForm(currentUser.value)
    showEditDialog.value = true
  }
}

const openTagDialog = async () => {
  await fetchAllTags()
  showTagDialog.value = true
}

// Lifecycle
onMounted(async () => {
  await loadUserData()
  await fetchAllTags()
})
</script>

<style scoped>
.user-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-left h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.loading-container {
  padding: 20px;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.info-card {
  margin-bottom: 20px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: center;
}

.info-item label {
  font-weight: 500;
  width: 120px;
  flex-shrink: 0;
  color: #606266;
}

.info-item span {
  color: #303133;
}

.tags-card {
  margin-bottom: 20px;
}

.tags-container {
  min-height: 60px;
}

.empty-tags {
  text-align: center;
  padding: 20px;
}

.stats-card {
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 32px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.not-found {
  text-align: center;
  padding: 40px;
}

.tag-management {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-tags h4,
.available-tags h4 {
  margin: 0 0 10px 0;
  font-size: 16px;
  font-weight: 600;
}

.tags-list {
  min-height: 40px;
}

.empty-message {
  color: #909399;
  font-style: italic;
}

@media (max-width: 768px) {
  .user-detail-container {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>