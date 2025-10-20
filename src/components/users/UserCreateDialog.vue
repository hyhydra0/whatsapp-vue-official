<template>
  <el-dialog
    v-model="dialogVisible"
    title="添加用户"
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
      <el-form-item label="手机号" prop="phone_number">
        <el-input
          v-model="form.phone_number"
          placeholder="请输入手机号"
          clearable
        />
      </el-form-item>

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

      <el-form-item label="机器人" prop="is_bot">
        <el-switch
          v-model="form.is_bot"
          active-text="是"
          inactive-text="否"
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
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          创建
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { useUserStore } from '@/stores/user'
import type { UserCreateRequest } from '@/types/user'

interface Props {
  visible: boolean
}

interface Emits {
  (e: 'update:visible', visible: boolean): void
  (e: 'created'): void
}

const props = withDefaults(defineProps<Props>(), {
  visible: false
})

const emit = defineEmits<Emits>()

const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const form = ref<UserCreateRequest>({
  phone_number: '',
  name: '',
  username: '',
  avatar: '',
  is_bot: false,
  status: 'pending',
  country: '',
  city: '',
  language: 'zh-CN'
})

const rules: FormRules = {
  phone_number: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { max: 20, message: '手机号长度不能超过20个字符', trigger: 'blur' }
  ],
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

const handleClose = () => {
  formRef.value?.resetFields()
  // 重置表单数据
  form.value = {
    phone_number: '',
    name: '',
    username: '',
    avatar: '',
    is_bot: false,
    status: 'pending',
    country: '',
    city: '',
    language: 'zh-CN'
  }
  emit('update:visible', false)
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    const valid = await formRef.value.validate()
    if (!valid) return

    loading.value = true

    await userStore.createUser(form.value)

    ElMessage.success('用户创建成功')
    emit('created')
    handleClose()
  } catch (error) {
    console.error('Create user error:', error)
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