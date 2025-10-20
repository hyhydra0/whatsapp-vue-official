<template>
  <div class="user-list-container">
    <!-- Header -->
    <div class="page-header">
      <h1>用户管理</h1>
      <div class="header-actions">
        <el-button type="primary" @click="showCreateDialog = true">
          <el-icon><Plus /></el-icon>
          添加用户
        </el-button>
        <el-button v-if="selectedUsers.length > 0" @click="showBatchDialog = true">
          批量操作 ({{ selectedUsers.length }})
        </el-button>
      </div>
    </div>

    <!-- Filters -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <el-input
          v-model="searchForm.query"
          placeholder="搜索用户名、姓名或手机号"
          style="width: 300px"
          clearable
          @keyup.enter="handleSearch"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>

        <el-select v-model="filterForm.status" placeholder="状态" style="width: 120px" clearable>
          <el-option
            v-for="option in statusOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>

        <el-select v-model="filterForm.is_online" placeholder="在线状态" style="width: 120px" clearable>
          <el-option label="全部" value="" />
          <el-option label="在线" :value="true" />
          <el-option label="离线" :value="false" />
        </el-select>

        <el-input v-model="filterForm.country" placeholder="国家" style="width: 120px" clearable />
        <el-input v-model="filterForm.city" placeholder="城市" style="width: 120px" clearable />
        <el-input v-model="filterForm.language" placeholder="语言" style="width: 120px" clearable />

        <el-button type="primary" @click="handleFilter">
          <el-icon><Search /></el-icon>
          筛选
        </el-button>
        <el-button @click="handleResetFilter">重置</el-button>
      </div>
    </el-card>

    <!-- Table -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="users"
        @selection-change="handleSelectionChange"
        @sort-change="handleSort"
        stripe
        style="width: 100%"
      >
        <el-table-column type="selection" width="55" fixed="left" />

        <el-table-column prop="id" label="ID" width="80" sortable="custom" />

        <el-table-column prop="phone_number" label="手机号" width="140" sortable="custom" />

        <el-table-column prop="name" label="姓名" width="120" sortable="custom">
          <template #default="{ row }">
            <span>{{ row.name || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="username" label="用户名" width="120" sortable="custom">
          <template #default="{ row }">
            <span>{{ row.username || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="is_online" label="在线状态" width="100">
          <template #default="{ row }">
            <el-tag :type="formatOnlineStatus(row.is_online).type" size="small">
              {{ formatOnlineStatus(row.is_online).text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100" sortable="custom">
          <template #default="{ row }">
            <el-tag :type="formatUserStatus(row.status).type" size="small">
              {{ formatUserStatus(row.status).text }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="country" label="国家" width="100" sortable="custom">
          <template #default="{ row }">
            <span>{{ row.country || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="city" label="城市" width="100" sortable="custom">
          <template #default="{ row }">
            <span>{{ row.city || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="language" label="语言" width="100" sortable="custom">
          <template #default="{ row }">
            <span>{{ row.language || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="message_count" label="消息数" width="100" sortable="custom" />

        <el-table-column prop="last_seen" label="最后在线" width="160" sortable="custom">
          <template #default="{ row }">
            <span>{{ formatLastSeen(row.last_seen) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="created_at" label="创建时间" width="160" sortable="custom">
          <template #default="{ row }">
            <span>{{ new Date(row.created_at).toLocaleString() }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row.id)">
              <el-icon><Delete /></el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="paginationInfo.current"
          v-model:page-size="paginationInfo.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="paginationInfo.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- Create User Dialog -->
    <el-dialog v-model="showCreateDialog" title="添加用户" width="600px">
      <el-form
        ref="createFormRef"
        :model="userForm"
        :rules="userFormRules"
        label-width="100px"
      >
        <el-form-item label="手机号" prop="phone_number">
          <el-input v-model="userForm.phone_number" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-input v-model="userForm.country" placeholder="请输入国家" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="userForm.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-input v-model="userForm.language" placeholder="请输入语言" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="userForm.status" placeholder="请选择状态">
            <el-option
              v-for="option in statusOptions.slice(1)"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="机器人">
          <el-switch v-model="userForm.is_bot" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="showCreateDialog = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleCreate">创建</el-button>
      </template>
    </el-dialog>

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

    <!-- Batch Operation Dialog -->
    <el-dialog v-model="showBatchDialog" title="批量操作" width="500px">
      <el-form :model="batchForm" label-width="100px">
        <el-form-item label="操作类型">
          <el-select v-model="batchForm.operation" placeholder="请选择操作">
            <el-option label="更新状态" value="update_status" />
            <el-option label="删除用户" value="delete" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="batchForm.operation === 'update_status'" label="新状态">
          <el-select v-model="batchForm.status" placeholder="请选择状态">
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
        <el-button @click="showBatchDialog = false">取消</el-button>
        <el-button type="primary" :loading="loading" @click="handleBatchOperation">执行</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser'
import type { User, UserStatus } from '@/types/user'

const router = useRouter()

// Composables
const {
  users,
  loading,
  paginationInfo,
  userForm,
  editUserForm,
  userFormRules,
  statusOptions,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  resetUserForm,
  resetEditUserForm,
  setEditUserForm,
  setFilters,
  resetFilters,
  handlePageChange,
  handlePageSizeChange,
  handleSort,
  formatUserStatus,
  formatOnlineStatus,
  formatLastSeen,
  batchOperation
} = useUser()

// Dialog states
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showBatchDialog = ref(false)

// Form refs
const createFormRef = ref()
const editFormRef = ref()

// Selection
const selectedUsers = ref<User[]>([])

// Current editing user
const currentEditingUser = ref<User | null>(null)

// Search and filter forms
const searchForm = reactive({
  query: ''
})

const filterForm = reactive({
  status: '',
  is_online: '',
  country: '',
  city: '',
  language: ''
})

const batchForm = reactive({
  operation: '',
  status: ''
})

// Methods
const handleSearch = async () => {
  if (searchForm.query.trim()) {
    setFilters({ search: searchForm.query.trim(), page: 1 })
  } else {
    setFilters({ search: undefined, page: 1 })
  }
  await fetchUsers()
}

const handleFilter = async () => {
  const filters: any = { page: 1 }

  if (filterForm.status) filters.status = filterForm.status
  if (filterForm.is_online !== '') filters.is_online = filterForm.is_online
  if (filterForm.country) filters.country = filterForm.country
  if (filterForm.city) filters.city = filterForm.city
  if (filterForm.language) filters.language = filterForm.language

  setFilters(filters)
  await fetchUsers()
}

const handleResetFilter = async () => {
  searchForm.query = ''
  filterForm.status = ''
  filterForm.is_online = ''
  filterForm.country = ''
  filterForm.city = ''
  filterForm.language = ''

  resetFilters()
  await fetchUsers()
}

const handleSelectionChange = (selection: User[]) => {
  selectedUsers.value = selection
}

const handleView = (user: User) => {
  router.push({ name: 'UserDetail', params: { id: user.id } })
}

const handleEdit = (user: User) => {
  currentEditingUser.value = user
  setEditUserForm(user)
  showEditDialog.value = true
}

const handleDelete = async (userId: number) => {
  try {
    await deleteUser(userId)
  } catch (error) {
    console.error('Delete user failed:', error)
  }
}

const handleCreate = async () => {
  try {
    await createFormRef.value.validate()
    await createUser()
    showCreateDialog.value = false
    resetUserForm()
    await fetchUsers()
  } catch (error) {
    console.error('Create user failed:', error)
  }
}

const handleUpdate = async () => {
  if (!currentEditingUser.value) return

  try {
    await editFormRef.value.validate()
    await updateUser(currentEditingUser.value.id)
    showEditDialog.value = false
    resetEditUserForm()
    currentEditingUser.value = null
    await fetchUsers()
  } catch (error) {
    console.error('Update user failed:', error)
  }
}

const handleBatchOperation = async () => {
  if (!batchForm.operation || selectedUsers.value.length === 0) return

  try {
    const data: any = {
      user_ids: selectedUsers.value.map(user => user.id),
      operation: batchForm.operation
    }

    if (batchForm.operation === 'update_status') {
      data.data = { status: batchForm.status }
    }

    await batchOperation(data)
    showBatchDialog.value = false
    selectedUsers.value = []
    batchForm.operation = ''
    batchForm.status = ''
    await fetchUsers()
  } catch (error) {
    console.error('Batch operation failed:', error)
  }
}

// Lifecycle
onMounted(async () => {
  await fetchUsers()
})
</script>

<style scoped>
.user-list-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.filter-card {
  margin-bottom: 20px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.table-card {
  margin-bottom: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .user-list-container {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-row > * {
    width: 100% !important;
  }
}
</style>