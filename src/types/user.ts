// Import AccountTag from tag API
import type { AccountTag } from '@/api/tag'

// User related types
export interface User {
  id: number
  phone_number: string
  name?: string
  username?: string
  avatar?: string
  is_bot: boolean
  is_online: boolean
  last_seen?: string
  country?: string
  city?: string
  language?: string
  message_count: number
  status: UserStatus
  role?: string
  tags?: AccountTag[]
  created_at: string
  updated_at: string
  deleted_at?: string
}

export interface UserTag {
  id: number
  user_id: number
  tag_id: number
  created_at: string
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
  PENDING = 'pending'
}

// API request/response types
export interface UserListParams {
  page?: number
  page_size?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
  status?: UserStatus | string
  is_online?: boolean
  country?: string
  city?: string
  language?: string
  tag_id?: number
  search?: string
  phone_number?: string
  name?: string
}

export interface UserListResponse {
  users: User[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export interface UserCreateRequest {
  phone_number: string
  name?: string
  username?: string
  avatar?: string
  is_bot?: boolean
  country?: string
  city?: string
  language?: string
  status?: UserStatus
}

export interface UserUpdateRequest {
  name?: string
  username?: string
  avatar?: string
  country?: string
  city?: string
  language?: string
  status?: UserStatus
  is_online?: boolean
}

export interface UserStatsResponse {
  total_users: number
  active_users: number
  inactive_users: number
  logged_out_users: number
  pending_users: number
  online_users: number
  new_users_today: number
  new_users_this_week: number
  new_users_this_month: number
  top_countries: Array<{ country: string; count: number }>
  top_cities: Array<{ city: string; count: number }>
  top_languages: Array<{ language: string; count: number }>
}

export interface UserChartsResponse {
  user_growth: Array<{ date: string; count: number }>
  status_distribution: Array<{ status: string; count: number }>
  country_distribution: Array<{ country: string; count: number }>
  message_activity: Array<{ date: string; count: number }>
}

export interface BatchOperationRequest {
  user_ids: number[]
  operation: 'update_status' | 'delete' | 'add_tags' | 'remove_tags'
  data?: {
    status?: UserStatus
    tag_ids?: number[]
  }
}

export interface BatchOperationResponse {
  success: boolean
  affected_count: number
  errors?: Array<{ user_id: number; error: string }>
}

export interface UserSearchParams {
  query: string
  fields?: ('name' | 'username' | 'phone_number')[]
  limit?: number
}

// Form validation types
export interface UserFormData {
  name: string
  username: string
  country: string
  city: string
  language: string
  status: UserStatus
}

export interface UserFormRules {
  name: any[]
  username: any[]
  country: any[]
  city: any[]
  language: any[]
  status: any[]
}

// Table column configuration
export interface UserTableColumn {
  prop: string
  label: string
  width?: string | number
  minWidth?: string | number
  sortable?: boolean | string
  formatter?: (row: User, column: any, cellValue: any) => string
  fixed?: boolean | string
}

// Filter configuration
export interface UserFilter {
  status: UserStatus | ''
  is_online: boolean | ''
  country: string
  city: string
  language: string
  tag_ids: number[]
  date_range: [string, string] | null
}