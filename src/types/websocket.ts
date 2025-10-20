/**
 * WebSocket 消息类型定义
 * 用于 WhatsApp 消息实时推送
 */

// WebSocket 消息类型枚举
export enum WSMessageType {
  NEW_MESSAGE = 'new_message',
  MESSAGE_STATUS = 'message_status',
  TYPING = 'typing',
  ONLINE_STATUS = 'online_status',
  CONNECTED = 'connected'
}

// WebSocket 消息基础结构
export interface WSMessage<T = any> {
  type: WSMessageType | string
  account_id: number
  data: T
  timestamp: string
}

// 新消息数据结构
export interface NewMessageData {
  id: number
  message_id: string
  from_jid: string
  to_jid: string
  content: string
  original_text?: string
  type: string
  is_from_me: boolean
  timestamp: string
  created_at: string
}

// 消息状态更新数据
export interface MessageStatusData {
  message_id: string
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending'
}

// 正在输入数据（可选功能）
export interface TypingData {
  contact_phone: string
  is_typing: boolean
}

// 在线状态数据（可选功能）
export interface OnlineStatusData {
  contact_phone: string
  is_online: boolean
  last_seen?: string
}

// 连接成功数据
export interface ConnectedData {
  message: string
  account_id?: number
}
