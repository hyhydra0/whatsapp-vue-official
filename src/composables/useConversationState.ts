/**
 * 会话列表状态管理 Composable
 * 用于本地实时更新会话列表，消除不必要的 API 请求
 */

import { ref } from 'vue'

export interface Conversation {
  contact_phone: string
  contact_name: string
  avatar?: string
  last_message: string
  last_message_time: string
  message_count: number
  unread_count: number
  has_sensitive: boolean
}

export function useConversationState() {
  const conversations = ref<Conversation[]>([])

  /**
   * 更新单个会话（本地，零网络请求）
   * @param contactPhone 联系人电话
   * @param updates 要更新的字段
   */
  const updateConversation = (
    contactPhone: string,
    updates: Partial<Conversation>
  ) => {
    const index = conversations.value.findIndex(
      c => c.contact_phone === contactPhone
    )

    if (index !== -1) {
      // 更新现有会话
      conversations.value[index] = {
        ...conversations.value[index],
        ...updates
      }
      // 排序：最新消息在最前
      sortConversations()
    } else {
      // 添加新会话（如果不存在）
      conversations.value.unshift({
        contact_phone: contactPhone,
        contact_name: contactPhone,
        avatar: '',
        last_message: '',
        last_message_time: new Date().toISOString(),
        message_count: 0,
        unread_count: 0,
        has_sensitive: false,
        ...updates
      })
    }
  }

  /**
   * 增加未读计数
   * @param contactPhone 联系人电话
   */
  const incrementUnread = (contactPhone: string) => {
    const conversation = conversations.value.find(
      c => c.contact_phone === contactPhone
    )
    if (conversation) {
      conversation.unread_count++
    }
  }

  /**
   * 清除未读计数
   * @param contactPhone 联系人电话
   */
  const clearUnread = (contactPhone: string) => {
    const conversation = conversations.value.find(
      c => c.contact_phone === contactPhone
    )
    if (conversation) {
      conversation.unread_count = 0
    }
  }

  /**
   * 排序会话列表（最新消息在前）
   */
  const sortConversations = () => {
    conversations.value.sort((a, b) =>
      new Date(b.last_message_time).getTime() -
      new Date(a.last_message_time).getTime()
    )
  }

  /**
   * 批量设置会话列表
   * @param newConversations 新的会话列表
   */
  const setConversations = (newConversations: Conversation[]) => {
    conversations.value = newConversations
    sortConversations()
  }

  /**
   * 根据联系人电话查找会话
   * @param contactPhone 联系人电话
   */
  const findConversation = (contactPhone: string): Conversation | undefined => {
    return conversations.value.find(c => c.contact_phone === contactPhone)
  }

  return {
    conversations,
    updateConversation,
    incrementUnread,
    clearUnread,
    sortConversations,
    setConversations,
    findConversation
  }
}
