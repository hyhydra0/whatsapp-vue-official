<template>
  <el-container class="main-layout">
    <!-- 顶部导航栏 -->
    <el-header class="main-header">
      <div class="header-left">
        <div class="logo">
          <el-icon size="28" color="#409EFF">
            <ChatDotRound />
          </el-icon>
          <span class="logo-text">WhatsApp 管理系统</span>
        </div>
      </div>

      <div class="header-right">
        <!-- 用户信息 -->
        <el-dropdown @command="handleCommand">
          <div class="user-info">
            <el-avatar
              :size="32"
              :src="userStore.user?.avatar"
              :icon="UserFilled"
            />
            <span class="username">{{ userStore.user?.username }}</span>
            <el-icon class="dropdown-icon">
              <ArrowDown />
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="settings" :icon="Setting">
                系统设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边导航菜单 -->
      <el-aside class="main-aside" :width="isCollapsed ? '64px' : '240px'">
        <div class="aside-header">
          <el-button
            :icon="Fold"
            text
            @click="toggleCollapse"
            class="collapse-btn"
          />
        </div>

        <el-menu
          :default-active="currentRoute"
          :collapse="isCollapsed"
          :unique-opened="true"
          class="main-menu"
          @select="handleMenuSelect"
        >
          <!-- 仪表盘 -->
          <el-menu-item index="Dashboard">
            <el-icon><Odometer /></el-icon>
            <template #title>仪表盘</template>
          </el-menu-item>

          <!-- 用户管理 -->
          <el-menu-item index="Users">
            <el-icon><User /></el-icon>
            <template #title>用户管理</template>
          </el-menu-item>

          <!-- 消息搜索 -->
          <el-menu-item index="MessageSearch">
            <el-icon><Search /></el-icon>
            <template #title>消息搜索</template>
          </el-menu-item>

          <!-- 批量发送 -->
          <el-menu-item index="BatchSend">
            <el-icon><ChatDotRound /></el-icon>
            <template #title>批量发送</template>
          </el-menu-item>

          <!-- 标签管理 -->
          <el-menu-item index="TagManagement">
            <el-icon><Collection /></el-icon>
            <template #title>标签管理</template>
          </el-menu-item>

          <!-- 敏感词管理 -->
          <el-sub-menu index="sensitive-word">
            <template #title>
              <el-icon><Warning /></el-icon>
              <span>敏感词管理</span>
            </template>
            <el-menu-item index="SensitiveWords">
              <el-icon><Warning /></el-icon>
              <template #title>敏感词</template>
            </el-menu-item>
            <el-menu-item index="SystemConfig">
              <el-icon><Setting /></el-icon>
              <template #title>系统配置</template>
            </el-menu-item>
            <el-menu-item index="SensitiveWordAlerts">
              <el-icon><Bell /></el-icon>
              <template #title>告警日志</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 监控中心 -->
          <!-- <el-sub-menu index="monitor">
            <template #title>
              <el-icon><Monitor /></el-icon>
              <span>监控中心</span>
            </template>
            <el-menu-item index="MessageMonitor">
              <el-icon><Message /></el-icon>
              <template #title>消息监控</template>
            </el-menu-item>
            <el-menu-item index="ContactMonitor">
              <el-icon><Phone /></el-icon>
              <template #title>联系人监控</template>
            </el-menu-item>
            <el-menu-item index="RealTimeAlerts">
              <el-icon><Bell /></el-icon>
              <template #title>实时告警</template>
            </el-menu-item>
          </el-sub-menu> -->

          <!-- 数据分析 -->
          <!-- <el-menu-item index="Analytics">
            <el-icon><TrendCharts /></el-icon>
            <template #title>数据分析</template>
          </el-menu-item> -->

          <!-- 权限管理 -->
          <el-sub-menu index="rbac">
            <template #title>
              <el-icon><Lock /></el-icon>
              <span>权限管理</span>
            </template>
            <el-menu-item index="AdminUserManagement">
              <el-icon><Avatar /></el-icon>
              <template #title>后管用户</template>
            </el-menu-item>
            <el-menu-item index="RoleManagement">
              <el-icon><Key /></el-icon>
              <template #title>角色管理</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 语言设置 -->
          <el-menu-item index="Languages">
            <el-icon><Setting /></el-icon>
            <template #title>语言设置</template>
          </el-menu-item>

          <!-- 系统设置 -->
          <!-- <el-menu-item index="Settings">
            <el-icon><Setting /></el-icon>
            <template #title>系统设置</template>
          </el-menu-item> -->
        </el-menu>
      </el-aside>

      <!-- 主内容区域 -->
      <el-main :class="['main-content', { 'no-scroll': isMessagePage }]">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ChatDotRound,
  UserFilled,
  ArrowDown,
  User,
  Setting,
  SwitchButton,
  Fold,
  Odometer,
  Monitor,
  Message,
  Phone,
  Bell,
  Warning,
  TrendCharts,
  Avatar,
  Collection,
  Lock,
  Key,
  Search
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useAuthStore()

// 菜单折叠状态
const isCollapsed = ref(false)

// 当前路由名称
const currentRoute = computed(() => route.name as string || 'Dashboard')

// 判断是否是消息页面
const isMessagePage = computed(() => route.name === 'UserMessages')

// 切换菜单折叠状态
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

// 处理菜单选择
function handleMenuSelect(index: string) {
  router.push({ name: index })
}

// 处理用户下拉菜单命令
async function handleCommand(command: string) {
  switch (command) {
    case 'settings':
      router.push({ name: 'Settings' })
      break
    case 'logout':
      try {
        await ElMessageBox.confirm(
          '确定要退出登录吗？',
          '退出确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        )
        await userStore.logout()
        router.push({ name: 'Login' })
      } catch {
        // 用户取消操作
      }
      break
  }
}
</script>

<style scoped>
.main-layout {
  height: 100vh;
  overflow: hidden;
}

/* 顶部导航栏 */
.main-header {
  background: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #2c3e50;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f7fa;
}

.username {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

.dropdown-icon {
  font-size: 12px;
  color: #909399;
}

/* 侧边栏 */
.main-aside {
  background: #fff;
  border-right: 1px solid #e6e6e6;
  transition: width 0.3s;
  overflow: hidden;
}

.aside-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #e6e6e6;
}

.collapse-btn {
  font-size: 18px;
  color: #606266;
}

.main-menu {
  border: none;
  height: calc(100vh - 60px - 60px);
  overflow-y: auto;
}

.main-menu :deep(.el-menu-item) {
  height: 48px;
  line-height: 48px;
}

.main-menu :deep(.el-sub-menu .el-sub-menu__title) {
  height: 48px;
  line-height: 48px;
}

.main-menu :deep(.el-menu-item.is-active) {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 主内容区域 */
.main-content {
  background: #f5f5f5;
  padding: 0;
  overflow: auto;
  height: calc(100vh - 60px);
}

/* 消息页面不滚动 */
.main-content.no-scroll {
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-aside {
    width: 64px !important;
  }

  .logo-text {
    display: none;
  }

  .username {
    display: none;
  }
}
</style>