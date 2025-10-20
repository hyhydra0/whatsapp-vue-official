import { api } from '@/utils/request'

// 后管用户接口
export interface AdminUser {
  id: number
  username: string
  email: string
  status: string
  created_at: string
  updated_at: string
  last_login_at?: string
  last_login_ip?: string
}

// 后管用户列表响应
export interface AdminUserListResponse {
  list: AdminUser[]
  total: number
  page: number
  limit: number
}

// 创建后管用户请求
export interface AdminUserCreateRequest {
  username: string
  email: string
  password: string
  confirm_password: string
  status?: string
}

// 更新后管用户请求
export interface AdminUserUpdateRequest {
  email?: string
  password?: string
  confirm_password?: string
  status?: string
}

// 后管用户管理API
export const adminUserApi = {
  // 获取后管用户列表
  getList(params: {
    page?: number
    limit?: number
    keyword?: string
    status?: string
  } = {}): Promise<AdminUserListResponse> {
    return api.get('/admin/users', { params })
  },

  // 获取后管用户详情
  getById(id: number): Promise<AdminUser> {
    return api.get(`/admin/users/${id}`)
  },

  // 创建后管用户
  create(data: AdminUserCreateRequest): Promise<AdminUser> {
    return api.post('/admin/users', data)
  },

  // 更新后管用户
  update(id: number, data: AdminUserUpdateRequest): Promise<AdminUser> {
    return api.put(`/admin/users/${id}`, data)
  },

  // 删除后管用户
  delete(id: number): Promise<void> {
    return api.delete(`/admin/users/${id}`)
  },

  // 更新后管用户状态
  updateStatus(id: number, status: string): Promise<AdminUser> {
    return api.put(`/admin/users/${id}/status`, { status })
  },

  // 重置后管用户密码
  resetPassword(id: number, newPassword: string): Promise<void> {
    return api.post(`/admin/users/${id}/reset-password`, {
      new_password: newPassword
    })
  }
}

export default adminUserApi
