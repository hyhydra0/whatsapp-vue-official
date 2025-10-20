import { api } from '@/utils/request'
import type {
  User,
  UserListParams,
  UserListResponse,
  UserCreateRequest,
  UserUpdateRequest,
  UserStatsResponse,
  UserChartsResponse,
  BatchOperationRequest,
  BatchOperationResponse,
  UserSearchParams
} from '@/types/user'
import type { Tag } from '@/types/tag'

// User CRUD operations
export const userApi = {
  // List users with pagination and filters
  list(params: UserListParams = {}): Promise<UserListResponse> {
    return api.get('/users', { params })
  },

  // Get user by ID
  getById(id: number): Promise<User> {
    return api.get(`/users/${id}`).then(res => res.data)
  },

  // Get user with chats
  getUserWithChats(id: number): Promise<{user: User, chats: any[]}> {
    return api.get(`/users/${id}`)
  },

  // Create new user
  create(data: UserCreateRequest): Promise<User> {
    return api.post('/users', data).then(res => res.data)
  },

  // Update user
  update(id: number, data: UserUpdateRequest): Promise<User> {
    return api.put(`/users/${id}`, data).then(res => res.data)
  },

  // Delete user
  delete(id: number): Promise<void> {
    return api.delete(`/users/${id}`)
  },

  // Update user status
  updateStatus(id: number, status: string): Promise<User> {
    return api.put(`/users/${id}/status`, { status }).then(res => res.data)
  },

  // Search users
  search(params: UserSearchParams): Promise<User[]> {
    return api.get('/users/search', { params }).then(res => res.data)
  },

  // Get user by phone number
  getByPhone(phone: string): Promise<User> {
    return api.get('/users/phone', { params: { phone } }).then(res => res.data)
  },

  // Get online users
  getOnlineUsers(params: { page?: number; page_size?: number } = {}): Promise<UserListResponse> {
    return api.get('/users/online', { params }).then(res => res.data)
  },

  // Get top message users
  getTopMessageUsers(params: { limit?: number; period?: string } = {}): Promise<User[]> {
    return api.get('/users/top-messages', { params }).then(res => res.data)
  },

  // Update online status
  updateOnlineStatus(id: number, isOnline: boolean): Promise<User> {
    return api.put(`/users/${id}/online-status`, { is_online: isOnline }).then(res => res.data)
  },

  // Update last seen
  updateLastSeen(id: number, lastSeen: string): Promise<User> {
    return api.put(`/users/${id}/last-seen`, { last_seen: lastSeen }).then(res => res.data)
  },

  // Batch operations
  batch(data: BatchOperationRequest): Promise<BatchOperationResponse> {
    return api.post('/users/batch', data).then(res => res.data)
  }
}

// User tag operations
export const userTagApi = {
  // Get user tags
  getUserTags(userId: number): Promise<Tag[]> {
    return api.get(`/users/${userId}/tags`).then(res => res.data)
  },

  // Set user tags (replace all)
  setUserTags(userId: number, tagIds: number[]): Promise<Tag[]> {
    return api.put(`/users/${userId}/tags`, { tag_ids: tagIds }).then(res => res.data)
  },

  // Add tags to user
  addUserTags(userId: number, tagIds: number[]): Promise<Tag[]> {
    return api.post(`/users/${userId}/tags`, { tag_ids: tagIds }).then(res => res.data)
  },

  // Remove tag from user
  removeUserTag(userId: number, tagId: number): Promise<void> {
    return api.delete(`/users/${userId}/tags/${tagId}`).then(res => res.data)
  }
}

// User statistics
export const userStatsApi = {
  // Get user statistics
  getStats(): Promise<UserStatsResponse> {
    return api.get('/users/stats')
  },

  // Get chart data
  getCharts(params: {
    period?: 'day' | 'week' | 'month' | 'year'
    start_date?: string
    end_date?: string
  } = {}): Promise<UserChartsResponse> {
    return api.get('/users/charts', { params }).then(res => res.data)
  }
}

// Export all APIs
export default {
  ...userApi,
  tags: userTagApi,
  stats: userStatsApi
}