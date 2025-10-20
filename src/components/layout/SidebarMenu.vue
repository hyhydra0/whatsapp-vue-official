<template>
  <div class="sidebar-menu">
    <!-- Logo -->
    <div class="logo">
      <div class="logo-icon">
        <el-icon size="28">
          <ChatDotRound />
        </el-icon>
      </div>
      <span v-show="!collapsed" class="logo-text">WhatsApp 管理</span>
    </div>

    <!-- Menu -->
    <el-menu
      :default-active="activeMenu"
      :collapse="collapsed"
      :unique-opened="true"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#1890ff"
      @select="handleMenuSelect"
    >
      <template v-for="item in menuItems.value" :key="item.path">
        <el-menu-item :index="item.path">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <template #title>{{ item.title }}</template>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ChatDotRound,
  House,
  User,
  Setting,
  Collection,
  Warning
} from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'

interface MenuItem {
  path: string
  title: string
  icon: any
  permissions?: string[]
}

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()

const collapsed = computed(() => appStore.sidebarCollapsed)
const activeMenu = computed(() => route.name as string || 'Dashboard')

const allMenuItems: MenuItem[] = [
  {
    path: 'Dashboard',
    title: '仪表板',
    icon: House,
    permissions: ['dashboard.view']
  },
  {
    path: 'Users',
    title: '用户管理',
    icon: User,
    permissions: ['user.read']
  },
  {
    path: 'TagManagement',
    title: '标签管理',
    icon: Collection,
    permissions: ['tag.view']
  },
  {
    path: 'SensitiveWords',
    title: '敏感词管理',
    icon: Warning,
    permissions: ['sensitive_word.view']
  },
  {
    path: 'SystemConfig',
    title: '系统配置',
    icon: Setting,
    permissions: ['system_config.view']
  },
  {
    path: 'SensitiveWordAlerts',
    title: '告警日志',
    icon: Warning,
    permissions: ['sensitive_word_alert.view']
  },
  {
    path: 'Settings',
    title: '系统设置',
    icon: Setting,
    permissions: ['system.settings']
  }
]

// 根据权限过滤菜单项
const menuItems = computed(() => {
  return allMenuItems.filter(item => {
    // 如果没有指定权限要求，则显示
    if (!item.permissions || item.permissions.length === 0) {
      return true
    }
    // 检查用户是否有任一所需权限
    return authStore.checkAnyPermission(item.permissions)
  })
})

const handleMenuSelect = (path: string) => {
  router.push({ name: path })
}
</script>

<style scoped>
.sidebar-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border-bottom: 1px solid #002140;
  background-color: #001529;
}

.logo-icon {
  color: #1890ff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #fff;
  white-space: nowrap;
}

.el-menu {
  flex: 1;
  border-right: none;
}

:deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

:deep(.el-menu-item.is-active) {
  background-color: #1890ff !important;
}

:deep(.el-menu-item:hover) {
  background-color: #002140 !important;
}

:deep(.el-menu--collapse .el-menu-item) {
  padding: 0 !important;
  text-align: center;
}
</style>