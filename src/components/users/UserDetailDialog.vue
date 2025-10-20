<template>
  <el-dialog
    v-model="dialogVisible"
    title="用户详情"
    width="600px"
    :before-close="handleClose"
  >
    <div v-if="user" class="user-detail">
      <el-descriptions border :column="2">
        <el-descriptions-item label="用户ID">
          {{ user.id }}
        </el-descriptions-item>
        <el-descriptions-item label="手机号">
          {{ user.phone_number }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名">
          {{ user.name || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="用户名(@)">
          {{ user.username ? '@' + user.username : '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(user.status)">
            {{ getStatusText(user.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="在线状态">
          <el-tag :type="user.is_online ? 'success' : 'info'">
            {{ user.is_online ? '在线' : '离线' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="国家">
          {{ user.country || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="城市">
          {{ user.city || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="语言">
          {{ user.language || '未设置' }}
        </el-descriptions-item>
        <el-descriptions-item label="消息数量">
          {{ user.message_count }}
        </el-descriptions-item>
        <el-descriptions-item label="最后在线">
          {{ user.last_seen ? formatDateTime(user.last_seen) : '未知' }}
        </el-descriptions-item>
        <el-descriptions-item label="注册时间">
          {{ formatDateTime(user.created_at) }}
        </el-descriptions-item>
      </el-descriptions>

      <div class="user-avatar" v-if="user.avatar">
        <el-divider content-position="left">头像</el-divider>
        <el-avatar :src="user.avatar" :size="80" />
      </div>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleEdit">编辑用户</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types/user'

interface Props {
  visible: boolean
  user?: User | null
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'updated'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  user: null
})

const emit = defineEmits<Emits>()

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const getStatusType = (status: string) => {
  const statusMap = {
    active: 'success',
    inactive: 'warning',
    blocked: 'danger',
    pending: 'info'
  }
  return statusMap[status as keyof typeof statusMap] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap = {
    active: '活跃',
    inactive: '非活跃',
    blocked: '已拉黑',
    pending: '待审核'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN')
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleEdit = () => {
  // TODO: 触发编辑事件
  handleClose()
}
</script>

<style scoped>
.user-detail {
  padding: 10px 0;
}

.user-avatar {
  margin-top: 20px;
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>