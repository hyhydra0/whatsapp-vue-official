<template>
  <el-dialog
    v-model="dialogVisible"
    title="编辑用户"
    width="600px"
    :before-close="handleClose"
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      v-loading="loading"
    >
      <el-form-item label="用户名" prop="name">
        <el-input
          v-model="form.name"
          placeholder="请输入用户名"
          clearable
        />
      </el-form-item>

      <el-form-item label="用户名(@)" prop="username">
        <el-input
          v-model="form.username"
          placeholder="请输入用户名，不含@符号"
          clearable
        />
      </el-form-item>

      <el-form-item label="头像URL" prop="avatar">
        <el-input
          v-model="form.avatar"
          placeholder="请输入头像URL"
          clearable
        />
      </el-form-item>

      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="活跃" value="active" />
          <el-option label="非活跃" value="inactive" />
          <el-option label="已拉黑" value="blocked" />
          <el-option label="待审核" value="pending" />
        </el-select>
      </el-form-item>

      <el-form-item label="国家" prop="country">
        <el-input
          v-model="form.country"
          placeholder="请输入国家"
          clearable
        />
      </el-form-item>

      <el-form-item label="城市" prop="city">
        <el-input
          v-model="form.city"
          placeholder="请输入城市"
          clearable
        />
      </el-form-item>

      <el-form-item label="语言" prop="language">
        <el-select v-model="form.language" placeholder="请选择语言">
          <el-option label="简体中文" value="zh-CN" />
          <el-option label="繁體中文" value="zh-TW" />
          <el-option label="English" value="en" />
          <el-option label="Español" value="es" />
          <el-option label="Français" value="fr" />
          <el-option label="العربية" value="ar" />
        </el-select>
      </el-form-item>

      <el-form-item label="在线状态" prop="is_online">
        <el-switch
          v-model="form.is_online"
          active-text="在线"
          inactive-text="离线"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          保存
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { User, UserUpdateRequest } from '@/types/user'

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

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const form = ref<UserUpdateRequest>({
  name: '',
  username: '',
  avatar: '',
  status: 'active',
  country: '',
  city: '',
  language: 'zh-CN',
  is_online: false
})

const rules: FormRules = {
  name: [
    { max: 100, message: '用户名长度不能超过100个字符', trigger: 'blur' }
  ],
  username: [
    { max: 100, message: '用户名长度不能超过100个字符', trigger: 'blur' }
  ],
  avatar: [
    { type: 'url', message: '请输入正确的URL格式', trigger: 'blur' }
  ],
  country: [
    { max: 100, message: '国家名称长度不能超过100个字符', trigger: 'blur' }
  ],
  city: [
    { max: 100, message: '城市名称长度不能超过100个字符', trigger: 'blur' }
  ]
}

// 监听用户数据变化，初始化表单
watch(() => props.user, (user) => {
  if (user) {
    form.value = {
      name: user.name || '',
      username: user.username || '',
      avatar: user.avatar || '',
      status: user.status,
      country: user.country || '',
      city: user.city || '',
      language: user.language || 'zh-CN',
      is_online: user.is_online
    }
  }
}, { immediate: true })

const handleClose = () => {
  formRef.value?.resetFields()
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!formRef.value || !props.user) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    // 过滤掉空值
    const updateData: any = {}
    Object.keys(form.value).forEach(key => {
      const value = (form.value as any)[key]
      if (value !== '' && value !== null && value !== undefined) {
        updateData[key] = value
      }
    })

    await userStore.updateUser(props.user.id, updateData)

    ElMessage.success('用户信息更新成功')
    emit('updated')
    handleClose()
  } catch (error) {
    console.error('Update user error:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>