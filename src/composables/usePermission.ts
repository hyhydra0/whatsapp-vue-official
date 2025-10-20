import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { User } from '@/types/auth'

/**
 * 权限检查组合函数
 */
export function usePermission() {
  const authStore = useAuthStore()

  /**
   * 检查单个权限
   */
  const hasPermission = (permission: string): boolean => {
    return authStore.checkPermission(permission)
  }

  /**
   * 检查多个权限（任一满足）
   */
  const hasAnyPermission = (permissions: string[]): boolean => {
    return authStore.checkAnyPermission(permissions)
  }

  /**
   * 检查多个权限（全部满足）
   */
  const hasAllPermissions = (permissions: string[]): boolean => {
    return authStore.checkAllPermissions(permissions)
  }

  /**
   * 检查角色
   */
  const hasRole = (role: string): boolean => {
    return authStore.checkRole(role)
  }

  /**
   * 检查多个角色（任一满足）
   */
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => authStore.checkRole(role))
  }

  /**
   * 检查是否为管理员
   */
  const isAdmin = computed(() => authStore.isAdmin)

  /**
   * 检查是否为当前用户
   */
  const isCurrentUser = (userId: number): boolean => {
    return authStore.user?.id === userId
  }

  /**
   * 检查是否为用户本人或管理员
   */
  const isSelfOrAdmin = (userId: number): boolean => {
    return isCurrentUser(userId) || isAdmin.value
  }

  /**
   * 检查资源访问权限
   */
  const canAccessResource = (resource: string, action: string): boolean => {
    const permission = `${resource}:${action}`
    return hasPermission(permission)
  }

  /**
   * 检查用户管理权限
   */
  const canManageUsers = computed(() => {
    return hasAnyPermission(['user:create', 'user:update', 'user:delete']) || isAdmin.value
  })

  /**
   * 检查用户查看权限
   */
  const canViewUsers = computed(() => {
    return hasPermission('user:read') || canManageUsers.value
  })

  /**
   * 检查群组管理权限
   */
  const canManageGroups = computed(() => {
    return hasAnyPermission(['group:create', 'group:update', 'group:delete']) || isAdmin.value
  })

  /**
   * 检查群组查看权限
   */
  const canViewGroups = computed(() => {
    return hasPermission('group:read') || canManageGroups.value
  })

  /**
   * 检查消息管理权限
   */
  const canManageMessages = computed(() => {
    return hasAnyPermission(['message:create', 'message:update', 'message:delete']) || isAdmin.value
  })

  /**
   * 检查消息查看权限
   */
  const canViewMessages = computed(() => {
    return hasPermission('message:read') || canManageMessages.value
  })

  /**
   * 检查系统设置权限
   */
  const canManageSettings = computed(() => {
    return hasPermission('settings:manage') || isAdmin.value
  })

  /**
   * 检查数据分析权限
   */
  const canViewAnalytics = computed(() => {
    return hasPermission('analytics:read') || isAdmin.value
  })

  /**
   * 检查数据导出权限
   */
  const canExportData = computed(() => {
    return hasPermission('data:export') || isAdmin.value
  })

  /**
   * 检查数据导入权限
   */
  const canImportData = computed(() => {
    return hasPermission('data:import') || isAdmin.value
  })

  /**
   * 检查批量操作权限
   */
  const canBatchOperation = computed(() => {
    return hasPermission('batch:operation') || isAdmin.value
  })

  /**
   * 根据权限过滤菜单项
   */
  const filterMenuByPermission = <T extends { permission?: string; role?: string; children?: T[] }>(
    menus: T[]
  ): T[] => {
    return menus.filter(menu => {
      // 检查权限
      if (menu.permission && !hasPermission(menu.permission)) {
        return false
      }

      // 检查角色
      if (menu.role && !hasRole(menu.role)) {
        return false
      }

      // 递归过滤子菜单
      if (menu.children) {
        menu.children = filterMenuByPermission(menu.children)
      }

      return true
    })
  }

  /**
   * 根据权限过滤操作按钮
   */
  const filterActionsByPermission = <T extends { permission?: string; role?: string }>(
    actions: T[]
  ): T[] => {
    return actions.filter(action => {
      if (action.permission && !hasPermission(action.permission)) {
        return false
      }

      if (action.role && !hasRole(action.role)) {
        return false
      }

      return true
    })
  }

  /**
   * 权限装饰器（用于方法权限检查）
   */
  const withPermission = <T extends (...args: any[]) => any>(
    permission: string,
    fn: T,
    fallback?: () => void
  ) => {
    return (...args: Parameters<T>): ReturnType<T> | void => {
      if (hasPermission(permission)) {
        return fn(...args)
      } else {
        if (fallback) {
          fallback()
        } else {
          console.warn(`Permission denied: ${permission}`)
        }
      }
    }
  }

  /**
   * 角色装饰器（用于方法角色检查）
   */
  const withRole = <T extends (...args: any[]) => any>(
    role: string,
    fn: T,
    fallback?: () => void
  ) => {
    return (...args: Parameters<T>): ReturnType<T> | void => {
      if (hasRole(role)) {
        return fn(...args)
      } else {
        if (fallback) {
          fallback()
        } else {
          console.warn(`Role required: ${role}`)
        }
      }
    }
  }

  return {
    // 基础权限检查
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    isCurrentUser,
    isSelfOrAdmin,
    canAccessResource,

    // 业务权限检查
    canManageUsers,
    canViewUsers,
    canManageGroups,
    canViewGroups,
    canManageMessages,
    canViewMessages,
    canManageSettings,
    canViewAnalytics,
    canExportData,
    canImportData,
    canBatchOperation,

    // 工具方法
    filterMenuByPermission,
    filterActionsByPermission,
    withPermission,
    withRole
  }
}