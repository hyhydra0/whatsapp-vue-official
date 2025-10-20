import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupGuards } from './guards'
import { withAdminPrefix } from '@/utils/route'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'WhatsAppLogin',
    component: () => import('@/views/WhatsAppLogin.vue'),
    meta: {
      title: 'WhatsApp Web',
      requiresAuth: false
    }
  },
  {
    path: withAdminPrefix('/login'),
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
      layout: 'auth'
    }
  },
  {
    path: withAdminPrefix('/'),
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          requiresAuth: true,
          permissions: ['dashboard.view']
        }
      },
      {
        path: 'dashboard',
        redirect: { name: 'Dashboard' }
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/views/users/UserList.vue'),
        meta: {
          title: '用户管理',
          requiresAuth: true,
          permissions: ['user.view']
        }
      },
      {
        path: 'messages/user/:userId',
        name: 'UserMessages',
        component: () => import('@/views/messages/UserMessages.vue'),
        meta: {
          title: '用户消息',
          requiresAuth: true,
          permissions: ['message.view']
        }
      },
      {
        path: 'messages/search',
        name: 'MessageSearch',
        component: () => import('@/views/messages/MessageSearch.vue'),
        meta: {
          title: '消息搜索',
          requiresAuth: true,
          permissions: ['message.view']
        }
      },
      {
        path: 'batch-send',
        name: 'BatchSend',
        component: () => import('@/views/batch-send/BatchSend.vue'),
        meta: {
          title: '批量发送',
          requiresAuth: true,
          permissions: ['message.send']
        }
      },
      {
        path: 'languages',
        name: 'Languages',
        component: () => import('@/views/languages/LanguageSettings.vue'),
        meta: {
          title: '语言设置',
          requiresAuth: true
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/settings/Settings.vue'),
        meta: {
          title: '系统设置',
          requiresAuth: true,
          permissions: ['config.update']
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/analytics/Analytics.vue'),
        meta: {
          title: '数据分析',
          requiresAuth: true,
          permissions: ['dashboard.view']
        }
      },
      // 监控路由
      {
        path: 'monitor/messages',
        name: 'MessageMonitor',
        component: () => import('@/views/monitor/MessageMonitor.vue'),
        meta: {
          title: '消息监控',
          requiresAuth: true,
          permissions: ['message.view']
        }
      },
      {
        path: 'monitor/contacts',
        name: 'ContactMonitor',
        component: () => import('@/views/monitor/ContactMonitor.vue'),
        meta: {
          title: '联系人监控',
          requiresAuth: true,
          permissions: ['user.view']
        }
      },
      {
        path: 'monitor/alerts',
        name: 'RealTimeAlerts',
        component: () => import('@/views/monitor/RealTimeAlerts.vue'),
        meta: {
          title: '实时告警',
          requiresAuth: true,
          permissions: ['operation_log.view']
        }
      },
      // 敏感词系统路由
      {
        path: 'sensitive-words',
        name: 'SensitiveWords',
        component: () => import('@/views/sensitive-words/SensitiveWords.vue'),
        meta: {
          title: '敏感词管理',
          requiresAuth: true,
          permissions: ['sensitive_word.view']
        }
      },
      {
        path: 'sensitive-words/config',
        name: 'SystemConfig',
        component: () => import('@/views/sensitive-words/SystemConfig.vue'),
        meta: {
          title: '系统配置',
          requiresAuth: true,
          permissions: ['config.view']
        }
      },
      {
        path: 'sensitive-words/alerts',
        name: 'SensitiveWordAlerts',
        component: () => import('@/views/sensitive-words/SensitiveWordAlerts.vue'),
        meta: {
          title: '告警日志',
          requiresAuth: true,
          permissions: ['operation_log.view']
        }
      },
      // 设备管理路由
      {
        path: 'devices',
        name: 'Devices',
        component: () => import('@/views/devices/DeviceList.vue'),
        meta: {
          title: '设备管理',
          requiresAuth: true,
          permissions: ['device.view']
        }
      },
      {
        path: 'devices/:id',
        name: 'DeviceDetail',
        component: () => import('@/views/devices/DeviceDetail.vue'),
        meta: {
          title: '设备详情',
          requiresAuth: true,
          permissions: ['device.view']
        }
      },
      // 标签管理路由
      {
        path: 'tags',
        name: 'TagManagement',
        component: () => import('@/views/tag/TagManagement.vue'),
        meta: {
          title: '标签管理',
          requiresAuth: true,
          permissions: ['tag.view']
        }
      },
      // RBAC权限管理路由
      {
        path: 'rbac/admin-users',
        name: 'AdminUserManagement',
        component: () => import('@/views/rbac/AdminUserManagement.vue'),
        meta: {
          title: '后管用户管理',
          requiresAuth: true,
          permissions: ['admin_user.view']
        }
      },
      {
        path: 'rbac/roles',
        name: 'RoleManagement',
        component: () => import('@/views/rbac/RoleList.vue'),
        meta: {
          title: '角色管理',
          requiresAuth: true,
          permissions: ['role.view']
        }
      },
      {
        path: 'rbac/user-roles',
        name: 'UserRoleAssignment',
        component: () => import('@/views/rbac/UserRoleAssignment.vue'),
        meta: {
          title: '用户角色分配',
          requiresAuth: true,
          permissions: ['user_role.assign']
        }
      }
    ]
  },
  {
    path: '/403',
    name: 'Forbidden',
    component: () => import('@/views/error/403.vue'),
    meta: {
      title: '权限不足',
      requiresAuth: false
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/views/error/404.vue'),
    meta: {
      title: '页面不存在',
      requiresAuth: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 设置路由守卫
setupGuards(router)

export default router