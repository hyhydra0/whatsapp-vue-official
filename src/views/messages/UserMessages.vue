<template>
  <div class="user-messages">
    <!-- 页面头部 -->
    <el-card class="header-card" shadow="hover">
      <div class="header-content">
        <div class="header-left">
          <div class="user-info-header">
            <el-avatar :src="userInfo.avatar" :size="60">
              <el-icon><UserFilled /></el-icon>
            </el-avatar>
            <div class="user-details">
              <h2>{{ userInfo.name || userInfo.phone_number }}</h2>
              <p class="phone-number">{{ userInfo.phone_number }}</p>
              <el-tag :type="userInfo.is_online ? 'success' : 'info'" size="small">
                <el-icon><Connection /></el-icon>
                {{ userInfo.is_online ? '在线' : '离线' }}
              </el-tag>
            </div>
          </div>
        </div>
        <div class="header-right">
          <el-button @click="$router.back()" :icon="ArrowLeft">
            返回用户列表
          </el-button>
          <el-button type="primary" @click="handleRefresh" :icon="Refresh" :loading="loading">
            刷新
          </el-button>
        </div>
      </div>
    </el-card>

    <!-- WebSocket 连接状态指示器 -->
    <div class="ws-status-indicator" :class="{ connected: wsConnected }">
      <el-icon v-if="wsConnected"><CircleCheckFilled /></el-icon>
      <el-icon v-else><CircleCloseFilled /></el-icon>
      <span>{{ wsConnected ? 'WebSocket 已连接' : 'WebSocket 未连接' }}</span>
    </div>

    <!-- 翻译设置面板 -->
    <el-card class="translation-settings-card" shadow="hover">
      <div class="translation-settings">
        <div class="settings-title">
          <el-icon><Setting /></el-icon>
          <span>翻译设置</span>
        </div>
        <div class="settings-controls">
          <div class="control-item">
            <span>自动翻译好友消息</span>
            <el-switch
              v-model="translationConfig.auto_translate_received"
              @change="handleSaveTranslationConfig"
            />
          </div>
          <div class="control-item">
            <span>自动翻译发送消息</span>
            <el-switch
              v-model="translationConfig.auto_translate_sent"
              @change="handleSaveTranslationConfig"
            />
          </div>
          <div class="control-item">
            <span>目标语言</span>
            <el-select
              v-model="selectedLanguageId"
              placeholder="选择目标语言"
              size="small"
              style="width: 180px"
              @change="handleLanguageChange"
            >
              <el-option
                v-for="lang in languageConfigs"
                :key="lang.id"
                :label="`${lang.language_name} (${lang.country_name})`"
                :value="lang.id"
              />
            </el-select>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 主要内容区域 -->
    <el-row :gutter="10" class="main-content">
      <!-- 对话列表 -->
      <el-col :span="8">
        <el-card class="conversations-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><ChatLineRound /></el-icon>
                <span>对话列表</span>
                <el-tag type="info" size="small">{{ conversations.length }}</el-tag>
              </div>
              <el-input
                v-model="conversationSearchKeyword"
                placeholder="搜索联系人..."
                size="small"
                style="width: 200px"
                @input="handleConversationSearch"
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
            </div>
          </template>

          <div class="conversations-content">
            <div
              v-if="conversations.length === 0"
              class="empty-conversations"
            >
              <el-empty description="暂无对话记录" />
            </div>
            <div
              v-for="conversation in filteredConversations"
              :key="conversation.contact_phone"
              class="conversation-item"
              :class="{
                active: selectedConversation?.contact_phone === conversation.contact_phone,
                'just-updated': recentlyUpdated[conversation.contact_phone],
                'has-unread': conversation.unread_count > 0,
                'archived': conversation.archived
              }"
              @click="handleSelectConversation(conversation)"
            >
              <el-avatar :src="conversation.avatar" :size="40">
                <el-icon><UserFilled /></el-icon>
              </el-avatar>
              <div class="conversation-info">
                <div class="conversation-header">
                  <span class="contact-name">{{ conversation.contact_name || conversation.contact_phone }}</span>
                  <span class="last-time">{{ formatTime(conversation.last_message_time) }}</span>
                </div>
                <div class="last-message">
                  <span class="message-preview">{{ conversation.last_message || '暂无消息' }}</span>
                  <div class="message-badges">
                    <el-badge
                      v-if="conversation.unread_count > 0"
                      :value="conversation.unread_count"
                      type="danger"
                      class="unread-badge"
                    />
                    <el-tag
                      v-if="conversation.has_sensitive"
                      type="danger"
                      size="small"
                      effect="plain"
                    >
                      敏感
                    </el-tag>
                  </div>
                </div>
              </div>
              <div class="conversation-actions">
                <el-tooltip
                  :content="conversation.archived ? '取消归档' : '归档会话'"
                  placement="left"
                >
                  <el-button
                    :type="conversation.archived ? 'success' : 'info'"
                    link
                    size="small"
                    :icon="conversation.archived ? FolderOpened : FolderAdd"
                    :loading="archivingChats[conversation.contact_phone]"
                    @click.stop="handleToggleArchive(conversation)"
                  />
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 消息历史记录 -->
      <el-col :span="16">
        <el-card class="messages-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><ChatDotRound /></el-icon>
                <span v-if="selectedConversation">
                  与 {{ selectedConversation.contact_name || selectedConversation.contact_phone }} 的聊天记录
                </span>
                <span v-else>选择对话查看消息记录</span>
              </div>
              <div class="message-actions" v-if="selectedConversation">
                <el-input
                  v-model="messageSearchKeyword"
                  placeholder="搜索消息内容..."
                  size="small"
                  style="width: 200px"
                  @input="handleMessageSearch"
                >
                  <template #prefix>
                    <el-icon><Search /></el-icon>
                  </template>
                </el-input>
                <el-button size="small" @click="handleExportMessages" :icon="Download">
                  导出
                </el-button>
              </div>
            </div>
          </template>

          <div class="messages-content">
            <!-- 未选择对话时的提示 -->
            <div v-if="!selectedConversation" class="no-conversation-selected">
              <el-empty description="请在左侧选择一个对话查看消息记录" />
            </div>

            <!-- 消息列表 -->
            <div v-else class="messages-list" ref="messagesContainer">
              <div
                v-if="messages.length === 0"
                class="empty-messages"
              >
                <el-empty description="暂无消息记录" />
              </div>
              <div
                v-for="message in filteredMessages"
                :key="message.id"
                class="message-item"
                :class="{
                  'sent': isMessageSent(message),
                  'received': !isMessageSent(message),
                  'sensitive': false
                }"
              >
                <div class="message-avatar" v-if="!message.is_from_me">
                  <el-avatar :size="32" :src="message.sender?.avatar">
                    <template v-if="!message.sender?.avatar">
                      {{ (getSenderName(message) || 'U').charAt(0).toUpperCase() }}
                    </template>
                  </el-avatar>
                </div>
                <div class="message-content">
                  <div class="message-header">
                    <span class="sender-name">
                      {{ getSenderName(message) }}
                    </span>
                    <span class="message-time">{{ formatDateTime(message.timestamp) }}</span>
                    <!-- MessageSend 没有敏感词字段，暂时不显示 -->
                    <!-- <el-tag
                      v-if="message.is_sensitive"
                      type="danger"
                      size="small"
                      effect="plain"
                    >
                      敏感内容
                    </el-tag> -->
                  </div>
                  <div class="message-body">
                    <!-- 文本消息 -->
                    <div class="message-text" v-if="message.type === 'text'">
                      {{ message.content }}
                      <!-- 好友消息：显示中文译文 -->
                      <div
                        v-if="!message.is_from_me && translationConfig.auto_translate_received && message.translated_text"
                        class="translated-text"
                      >
                        <el-divider style="margin: 8px 0" />
                        <div class="translation-header">
                          <el-icon size="12"><Connection /></el-icon>
                          <span>译文 (中文)</span>
                        </div>
                        <div class="translation-content">
                          {{ message.translated_text }}
                        </div>
                      </div>
                      <!-- 我方消息：显示中文原文 -->
                      <div
                        v-if="message.is_from_me && translationConfig.auto_translate_sent && message.original_text"
                        class="translated-text"
                      >
                        <el-divider style="margin: 8px 0" />
                        <div class="translation-header">
                          <el-icon size="12"><Connection /></el-icon>
                          <span>原文 (中文)</span>
                        </div>
                        <div class="translation-content">
                          {{ message.original_text }}
                        </div>
                      </div>
                      <!-- 翻译加载中 -->
                      <div
                        v-if="!message.is_from_me && translationConfig.auto_translate_received && message.translating"
                        class="translating"
                      >
                        <el-icon class="is-loading"><Loading /></el-icon>
                        <span>翻译中...</span>
                      </div>
                    </div>
                    <!-- 非文本消息 -->
                    <div class="message-media" v-else>
                      <div class="media-container">
                        <div class="media-icon">
                          <el-icon :size="24" :color="getMessageTypeColor(message.type) === 'success' ? '#67c23a' :
                                                     getMessageTypeColor(message.type) === 'primary' ? '#409eff' :
                                                     getMessageTypeColor(message.type) === 'warning' ? '#e6a23c' :
                                                     getMessageTypeColor(message.type) === 'danger' ? '#f56c6c' : '#909399'">
                            <component :is="getMessageTypeIcon(message.type)" />
                          </el-icon>
                        </div>
                        <div class="media-content">
                          <div class="media-type">
                            <el-tag :type="getMessageTypeColor(message.type)" size="small" effect="plain">
                              {{ getMessageTypeText(message.type) }}
                            </el-tag>
                          </div>
                          <div class="media-description">
                            <span v-if="message.content && message.content !== '暂无消息'">
                              {{ message.content }}
                            </span>
                            <span v-else class="no-content">
                              {{ getMessageTypeText(message.type) }}消息
                            </span>
                          </div>
                          <!-- 语音消息特殊处理 -->
                          <div v-if="message.type === 'voice' || message.type === 'audio'" class="voice-controls">
                            <audio
                              v-if="message.media_url"
                              :src="getMediaUrl(message.media_url)"
                              controls
                              controlsList="nodownload"
                              style="max-width: 300px; height: 40px;"
                            >
                              您的浏览器不支持音频播放
                            </audio>
                            <div v-else class="no-media">
                              <el-icon><Microphone /></el-icon>
                              <span>语音文件不可用</span>
                            </div>
                          </div>
                          <!-- 图片/视频消息特殊处理 -->
                          <div v-else-if="['image', 'video'].includes(message.type)" class="media-preview">
                            <!-- 图片预览 -->
                            <div v-if="message.type === 'image' && message.media_url" class="image-preview">
                              <el-image
                                :src="getMediaUrl(message.media_url)"
                                :preview-src-list="[getMediaUrl(message.media_url)]"
                                fit="cover"
                                style="max-width: 300px; max-height: 300px; border-radius: 8px;"
                                lazy
                              >
                                <template #error>
                                  <div class="image-slot">
                                    <el-icon><Picture /></el-icon>
                                    <span>图片加载失败</span>
                                  </div>
                                </template>
                              </el-image>
                            </div>
                            <!-- 视频预览 -->
                            <div v-else-if="message.type === 'video' && message.media_url" class="video-preview">
                              <video
                                :src="getMediaUrl(message.media_url)"
                                controls
                                style="max-width: 400px; max-height: 300px; border-radius: 8px;"
                                controlsList="nodownload"
                              >
                                您的浏览器不支持视频播放
                              </video>
                            </div>
                            <!-- 视频文件不可用 -->
                            <div v-else-if="message.type === 'video'" class="preview-placeholder">
                              <el-icon :size="40">
                                <VideoCamera />
                              </el-icon>
                              <span>视频文件不可用</span>
                            </div>
                            <!-- 没有media_url时的占位符 -->
                            <div v-else class="preview-placeholder">
                              <el-icon :size="40">
                                <component :is="getMessageTypeIcon(message.type)" />
                              </el-icon>
                              <span>媒体文件不可用</span>
                            </div>
                          </div>
                          <!-- 文件/文档消息特殊处理 -->
                          <div v-else-if="['document', 'file'].includes(message.type)" class="file-controls">
                            <el-button
                              v-if="message.media_url"
                              size="small"
                              type="info"
                              plain
                              :icon="Download"
                              @click="handleDownloadFile(message)"
                            >
                              下载文件
                            </el-button>
                            <div v-else class="no-media">
                              <el-icon><Document /></el-icon>
                              <span>文件不可用</span>
                            </div>
                          </div>
                          <!-- 位置消息特殊处理 -->
                          <div v-else-if="message.type === 'location'" class="location-controls">
                            <el-button size="small" type="danger" plain :icon="Location">
                              查看位置
                            </el-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="message-status">
                    <el-tag :type="getStatusType(message.send_status)" size="small">
                      {{ getStatusText(message.send_status) }}
                    </el-tag>
                  </div>
                  <!-- 消息操作按钮 -->
                  <div class="message-actions" v-if="!message.is_revoked">
                    <!-- 撤销按钮 (仅自己发送的24小时内消息) -->
                    <el-tooltip content="撤回消息" v-if="canRevokeMessage(message)">
                      <el-button
                        type="warning"
                        link
                        size="small"
                        :icon="RefreshLeft"
                        @click.stop="handleRevokeMessage(message)"
                      />
                    </el-tooltip>
                    <!-- 删除按钮 (管理员) -->
                    <el-tooltip content="删除消息" v-if="canDeleteMessage">
                      <el-button
                        type="danger"
                        link
                        size="small"
                        :icon="Delete"
                        @click.stop="handleDeleteMessage(message)"
                      />
                    </el-tooltip>
                  </div>
                </div>
                <!-- 已撤销消息标识 -->
                <div v-if="message.is_revoked" class="message-revoked-badge">
                  <el-icon><RefreshLeft /></el-icon>
                  <span>此消息已撤回</span>
                </div>
              </div>

              <!-- 加载更多按钮 -->
              <div v-if="hasMoreMessages" class="load-more">
                <el-button @click="handleLoadMoreMessages" :loading="loadingMore">
                  加载更多历史消息
                </el-button>
              </div>
            </div>

            <!-- 消息输入区域 -->
            <div v-if="selectedConversation" class="message-input-area">
              <!-- 图片预览区 -->
              <div v-if="selectedImage" class="image-preview-container">
                <div class="preview-image-wrapper">
                  <img :src="imagePreviewUrl" alt="预览图片" class="preview-image" />
                  <el-button
                    circle
                    size="small"
                    type="danger"
                    class="remove-image-btn"
                    @click="removeSelectedImage"
                  >
                    ×
                  </el-button>
                </div>
              </div>

              <div class="input-container">
                <el-input
                  ref="messageInputRef"
                  v-model="newMessage"
                  type="textarea"
                  :rows="2"
                  placeholder="输入消息内容... (Ctrl+V 粘贴图片)"
                  class="message-input"
                  @keydown.enter.ctrl="handleSendMessage"
                  @keydown.enter.exact.prevent="handleSendMessage"
                  @paste="handlePaste"
                  resize="none"
                />
                <div class="input-actions">
                  <input
                    ref="fileInputRef"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleFileSelect"
                  />
                  <el-button
                    @click="triggerFileSelect"
                    :icon="Picture"
                    title="选择图片"
                  >
                    图片
                  </el-button>
                  <el-button
                    type="primary"
                    @click="handleSendMessage"
                    :loading="sendingMessage"
                    :disabled="!canSendMessage"
                    :icon="Position"
                  >
                    发送
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { api } from '@/utils/request'
import {
  UserFilled,
  User,
  Connection,
  ArrowLeft,
  Refresh,
  ChatLineRound,
  ChatDotRound,
  Search,
  Download,
  Picture,
  VideoCamera,
  Document,
  Location,
  Folder,
  Microphone,
  Position,
  Setting,
  Loading,
  CircleCheckFilled,
  CircleCloseFilled,
  Delete,
  RefreshLeft,
  FolderAdd,
  FolderOpened
} from '@element-plus/icons-vue'
import {
  getLanguageConfigs,
  getTranslationConfig,
  updateTranslationConfig,
  translateText,
  type LanguageConfig,
  type TranslationConfig
} from '@/api/translation'
import { wsClient } from '@/utils/websocket'
import type { NewMessageData, MessageStatusData } from '@/types/websocket'
import { useConversationState } from '@/composables/useConversationState'
import { deleteMessage, revokeMessage } from '@/api/message-search'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'
import { archiveChat, unarchiveChat } from '@/api/chat'

// 消息类型定义
interface Message {
  id: string | number
  content: string
  type: string
  is_from_me: boolean
  timestamp: string
  send_status: string
  media_url?: string         // 媒体文件URL
  is_revoked?: boolean       // 是否已撤销
  revoked_at?: string        // 撤销时间
  deleted_at?: string        // 删除时间
  sender?: {
    name?: string
    phone?: string
    avatar?: string
  }
  translated_text?: string  // 好友消息的中文译文
  translating?: boolean
  original_text?: string     // 我方消息的中文原文
}

// 会话类型定义
interface Conversation {
  id?: number                    // 会话ID (用于API调用)
  contact_phone: string
  contact_name: string
  avatar: string
  last_message: string
  last_message_time: string
  message_count: number
  unread_count: number
  has_sensitive: boolean
  archived?: boolean             // 归档状态
}

// 路由参数
const route = useRoute()
const userId = route.params.userId as string
const userStore = useUserStore()
const authStore = useAuthStore()

// 响应式数据
const loading = ref(false)
const loadingMore = ref(false)
const userInfo = ref<any>({})

// 使用会话状态管理 Composable
const {
  conversations,
  updateConversation,
  incrementUnread,
  clearUnread,
  setConversations
} = useConversationState()

const messages = ref<Message[]>([])
const selectedConversation = ref<Conversation | null>(null)
const conversationSearchKeyword = ref('')
const messageSearchKeyword = ref('')
const hasMoreMessages = ref(false)
const messagesContainer = ref<HTMLElement>()
const newMessage = ref('')
const sendingMessage = ref(false)

// 图片相关状态
const selectedImage = ref<File | null>(null)
const imagePreviewUrl = ref('')
const fileInputRef = ref<HTMLInputElement>()
const messageInputRef = ref<any>()

// UI 状态
const recentlyUpdated = ref<Record<string, boolean>>({}) // 跟踪最近更新的会话
const wsConnected = ref(false) // WebSocket 连接状态
const archivingChats = ref<Record<string, boolean>>({}) // 跟踪正在归档的会话

// 翻译相关数据
const languageConfigs = ref<LanguageConfig[]>([])
const translationConfig = ref<TranslationConfig>({
  auto_translate_received: false,
  auto_translate_sent: false,
  default_target_language_id: undefined
})
const selectedLanguageId = ref<number | undefined>(undefined)
const targetLanguage = computed(() => {
  if (!selectedLanguageId.value) return 'en'
  const lang = languageConfigs.value.find(l => l.id === selectedLanguageId.value)
  return lang?.language_code || 'en'
})

// 计算属性
const filteredConversations = computed(() => {
  if (!conversationSearchKeyword.value) return conversations.value
  const keyword = conversationSearchKeyword.value.toLowerCase()
  return conversations.value.filter(conv =>
    (conv.contact_name || '').toLowerCase().includes(keyword) ||
    conv.contact_phone.includes(keyword)
  )
})

const filteredMessages = computed(() => {
  if (!messageSearchKeyword.value) return messages.value
  const keyword = messageSearchKeyword.value.toLowerCase()
  return messages.value.filter(msg =>
    msg.content.toLowerCase().includes(keyword)
  )
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // 使用统一的request对象，路径格式和其他API保持一致
    const data = await api.get(`/users/${userId}`)
    userInfo.value = data.user
  } catch (error) {
    console.error('Error fetching user info:', error)
    ElMessage.error('获取用户信息失败')
  }
}

// 获取对话列表（从API获取会话数据）
const fetchConversations = async () => {
  try {
    loading.value = true
    // 使用我们实现的API接口获取用户信息和会话列表
    const data = await api.get(`/users/${userId}`)

    // 转换会话数据格式以匹配现有界面
    const chats = data.chats || []
    const formattedConversations = chats.map((chat: any) => ({
      id: chat.id,                   // 新增: 保留会话ID用于归档操作
      archived: chat.archived || false, // 新增: 归档状态
      contact_phone: chat.jid,
      contact_name: getChatDisplayName(chat),
      avatar: '', // 会话数据没有头像字段
      last_message: chat.last_message || '暂无消息',
      last_message_time: chat.last_time,
      message_count: 0, // 暂时设为0
      unread_count: chat.unread_count || 0,
      has_sensitive: false // 暂时设为false
    }))

    // 使用 setConversations 更新会话列表
    setConversations(formattedConversations)

  } catch (error) {
    console.error('Error fetching conversations:', error)
    ElMessage.error('获取对话列表失败')
  } finally {
    loading.value = false
  }
}

// 获取会话显示名称 (从ChatList组件复制)
const getChatDisplayName = (chat: any) => {
  // 如果有名称就用名称，否则使用JID
  if (chat.name && chat.name !== chat.jid) {
    return chat.name
  }

  // 从JID中提取可读的部分
  if (chat.jid.includes('@')) {
    const parts = chat.jid.split('@')
    return parts[0] // 返回@前面的部分
  }

  return chat.jid
}

// 获取特定对话的消息记录
const fetchMessages = async (contactPhone: string, page = 1) => {
  try {
    if (page === 1) {
      messages.value = []
    }

    loadingMore.value = page > 1

    // 使用新的对话历史API接口
    const data = await api.get(
      `/messages/user/${userId}/conversation?` +
      `contact_phone=${contactPhone}&` +
      `page=${page}&limit=50`
    )

    // 处理正确的数据结构
    const responseMessages = data.messages || []

    if (page === 1) {
      messages.value = responseMessages
    } else {
      messages.value.push(...responseMessages)
    }

    // 判断是否还有更多消息
    hasMoreMessages.value = responseMessages.length === 50

    // 自动翻译好友消息
    if (translationConfig.value.auto_translate_received && page === 1) {
      await translateReceivedMessages()
    }

    // 滚动到底部（对于新会话）
    if (page === 1) {
      nextTick(() => {
        scrollToBottom()
      })
    }

  } catch (error) {
    console.error('Error fetching conversation history:', error)
    ElMessage.error('获取对话历史失败')
  } finally {
    loadingMore.value = false
  }
}

// 事件处理函数
const handleRefresh = async () => {
  await Promise.all([
    fetchUserInfo(),
    fetchConversations()
  ])
  if (selectedConversation.value) {
    await fetchMessages(selectedConversation.value.contact_phone)
  }
}

const handleSelectConversation = async (conversation: any) => {
  selectedConversation.value = conversation
  // 清除该对话的未读计数
  clearUnread(conversation.contact_phone)
  await fetchMessages(conversation.contact_phone)
}

const handleConversationSearch = () => {
  // 搜索逻辑在计算属性中处理
}

const handleMessageSearch = () => {
  // 搜索逻辑在计算属性中处理
}

const handleLoadMoreMessages = async () => {
  if (!selectedConversation.value) return
  const currentPage = Math.floor(messages.value.length / 50) + 1
  await fetchMessages(selectedConversation.value.contact_phone, currentPage)
}

const handleExportMessages = async () => {
  if (!selectedConversation.value) return

  try {
    await ElMessageBox.confirm(
      `确定要导出与 ${selectedConversation.value.contact_name || selectedConversation.value.contact_phone} 的聊天记录吗？`,
      '导出确认'
    )

    // 这里可以调用导出API或者前端导出
    ElMessage.success('导出功能开发中...')
  } catch {
    // 用户取消
  }
}

// 删除消息
const handleDeleteMessage = async (message: Message) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除这条消息吗?删除后消息将对所有人不可见。',
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await deleteMessage(Number(message.id))
    ElMessage.success('消息已删除')

    // 从消息列表中移除
    messages.value = messages.value.filter(m => m.id !== message.id)
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('删除消息失败:', error)
      ElMessage.error(error.response?.data?.message || '删除消息失败')
    }
  }
}

// 撤销消息
const handleRevokeMessage = async (message: Message) => {
  try {
    await ElMessageBox.confirm(
      '确定要撤回这条消息吗?撤回后所有人都看不到消息内容。',
      '确认撤回',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    await revokeMessage(Number(message.id))
    ElMessage.success('消息已撤回')

    // 更新消息状态
    const msg = messages.value.find(m => m.id === message.id)
    if (msg) {
      msg.is_revoked = true
      msg.content = ''
    }
  } catch (error: any) {
    if (error !== 'cancel') {
      console.error('撤销消息失败:', error)
      ElMessage.error(error.response?.data?.message || '撤销消息失败')
    }
  }
}

// 检查是否可以删除消息(管理员权限)
const canDeleteMessage = computed(() => {
  return authStore.hasPermission('message.delete')
})

// 检查是否可以撤销消息
const canRevokeMessage = (message: Message): boolean => {
  // 只能撤销自己发送的消息
  if (!message.is_from_me) {
    return false
  }

  // 检查撤销权限
  if (!authStore.hasPermission('message.revoke')) {
    return false
  }

  // 检查24小时时间限制
  const messageTime = new Date(message.timestamp).getTime()
  const now = Date.now()
  const hoursSinceMessage = (now - messageTime) / (1000 * 60 * 60)

  return hoursSinceMessage <= 24
}

// 归档/取消归档会话
const handleToggleArchive = async (conversation: Conversation) => {
  if (!conversation.id) {
    ElMessage.error('无法操作:会话ID缺失')
    return
  }

  const action = conversation.archived ? '取消归档' : '归档'

  try {
    archivingChats.value[conversation.contact_phone] = true

    if (conversation.archived) {
      await unarchiveChat(conversation.id)
    } else {
      await archiveChat(conversation.id)
    }

    ElMessage.success(`${action}成功`)

    // 更新本地状态
    const conv = conversations.value.find(
      c => c.contact_phone === conversation.contact_phone
    )
    if (conv) {
      conv.archived = !conversation.archived
    }

  } catch (error: any) {
    console.error(`${action}失败:`, error)
    ElMessage.error(error.response?.data?.message || `${action}失败`)
  } finally {
    archivingChats.value[conversation.contact_phone] = false
  }
}

// 图片处理函数
const canSendMessage = computed(() => {
  return selectedImage.value !== null || newMessage.value.trim() !== ''
})

const triggerFileSelect = () => {
  fileInputRef.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    ElMessage.error('请选择图片文件')
    return
  }

  // 验证文件大小 (16MB)
  if (file.size > 16 * 1024 * 1024) {
    ElMessage.error('图片大小不能超过16MB')
    return
  }

  selectedImage.value = file
  imagePreviewUrl.value = URL.createObjectURL(file)
}

const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault()

      const file = item.getAsFile()
      if (!file) continue

      // 验证文件大小
      if (file.size > 16 * 1024 * 1024) {
        ElMessage.error('图片大小不能超过16MB')
        return
      }

      selectedImage.value = file
      imagePreviewUrl.value = URL.createObjectURL(file)
      break
    }
  }
}

const removeSelectedImage = () => {
  if (imagePreviewUrl.value) {
    URL.revokeObjectURL(imagePreviewUrl.value)
  }
  selectedImage.value = null
  imagePreviewUrl.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleSendMessage = async () => {
  // 发送图片或文本消息
  if (selectedImage.value) {
    await sendImageMessage()
  } else if (newMessage.value.trim()) {
    await sendTextMessage()
  }
}

const sendImageMessage = async () => {
  if (!selectedConversation.value || !selectedImage.value) return

  const caption = newMessage.value.trim()

  try {
    sendingMessage.value = true

    // 1. 上传图片
    const formData = new FormData()
    formData.append('file', selectedImage.value)

    const uploadRes = await api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })

    console.log('Upload response:', uploadRes)

    // 2. 发送图片消息
    await api.post(`/messages/user/${userId}/send`, {
      contact_phone: selectedConversation.value.contact_phone,
      content: caption || '[图片]',
      type: 'image',
      media_path: uploadRes.file_path
    })

    // 3. 清理状态
    removeSelectedImage()
    newMessage.value = ''

    ElMessage.success('图片发送成功')
  } catch (error) {
    console.error('Error sending image:', error)
    ElMessage.error('图片发送失败: ' + (error?.response?.data?.message || error?.message || '未知错误'))
  } finally {
    sendingMessage.value = false
  }
}

const sendTextMessage = async () => {
  if (!selectedConversation.value || !newMessage.value.trim()) return

  const originalText = newMessage.value.trim()

  try {
    sendingMessage.value = true
    console.log("原文：", originalText)

    // 立即清空输入框，提升用户体验
    newMessage.value = ''

    let messageToSend = originalText

    // 如果启用了自动翻译发送，先翻译消息
    if (translationConfig.value.auto_translate_sent && targetLanguage.value) {
      try {
        const translationResult = await translateText({
          text: messageToSend,
          target_language: targetLanguage.value,
          source_language: 'zh'
        })
        messageToSend = translationResult.data.translated_text
        ElMessage.success(`已翻译为${targetLanguage.value}`)
      } catch (error) {
        console.error('Translation error:', error)
        ElMessage.warning('翻译失败，将发送原文')
      }
    }

    // 调用后端发送消息API
    await api.post(`/messages/user/${userId}/send`, {
      contact_phone: selectedConversation.value.contact_phone,
      content: messageToSend,
      original_text: originalText,
      type: 'text'
    })

    ElMessage.success('消息发送成功')

  } catch (error) {
    console.error('Error sending message:', error)
    ElMessage.error('发送消息失败: ' + (error?.response?.data?.message || error?.message || '未知错误'))
    // 发送失败，恢复输入框内容
    newMessage.value = originalText
  } finally {
    sendingMessage.value = false
  }
}

// 工具函数
const formatDateTime = (dateTime: string) => {
  return new Date(dateTime).toLocaleString('zh-CN')
}

const formatTime = (dateTime: string) => {
  const date = new Date(dateTime)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return '昨天'
  } else if (diffDays < 7) {
    return `${diffDays}天前`
  } else {
    return date.toLocaleDateString('zh-CN')
  }
}

const getMessageTypeText = (type: string) => {
  const typeMap: { [key: string]: string } = {
    'text': '文本',
    'image': '图片',
    'video': '视频',
    'audio': '音频',
    'voice': '语音',
    'document': '文档',
    'location': '位置',
    'file': '文件'
  }
  return typeMap[type] || type
}

const getMessageTypeIcon = (type: string) => {
  const iconMap: { [key: string]: any } = {
    'image': Picture,
    'video': VideoCamera,
    'audio': Microphone,
    'voice': Microphone,
    'document': Document,
    'location': Location,
    'file': Folder
  }
  return iconMap[type] || Document
}

const getMessageTypeColor = (type: string) => {
  const colorMap: { [key: string]: string } = {
    'text': 'info',
    'image': 'success',
    'video': 'primary',
    'audio': 'warning',
    'voice': 'warning',
    'document': 'info',
    'location': 'danger',
    'file': 'info'
  }
  return colorMap[type] || 'info'
}

const getStatusType = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'sent': 'success',
    'delivered': 'success',
    'read': 'success',
    'failed': 'danger',
    'pending': 'warning'
  }
  return statusMap[status] || 'info'
}

const getStatusText = (status: string) => {
  const statusMap: { [key: string]: string } = {
    'sent': '已发送',
    'delivered': '已送达',
    'read': '已读',
    'failed': '发送失败',
    'pending': '发送中'
  }
  return statusMap[status] || status
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 判断消息是否是发送的（与当前用户相关）
const isMessageSent = (message: any) => {
  // 根据后端API返回的 is_from_me 字段判断
  // is_from_me 为 true 表示是当前用户发送的消息
  return message.is_from_me === true
}

// 获取发送者名称
const getSenderName = (message: any) => {
  // 根据消息的 is_from_me 字段判断发送者
  if (message.is_from_me) {
    return userInfo.value.name || '我'
  } else {
    // 对方发送的消息，使用sender信息
    if (message.sender) {
      return message.sender.name || message.sender.phone || '对方'
    }
    return selectedConversation.value?.contact_name || '对方'
  }
}

// 获取完整的媒体文件URL
const getMediaUrl = (mediaUrl: string) => {
  if (!mediaUrl) return ''
  // 如果已经是完整URL，直接返回
  if (mediaUrl.startsWith('http://') || mediaUrl.startsWith('https://')) {
    return mediaUrl
  }
  // 否则拼接服务器地址 (注意: /media 路由在根路径,不在 /api 下)
  const apiBaseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  const serverURL = apiBaseURL.replace('/api', '')
  return `${serverURL}${mediaUrl}`
}

// 处理文件下载
const handleDownloadFile = (message: Message) => {
  if (!message.media_url) {
    ElMessage.error('文件不可用')
    return
  }

  const fileUrl = getMediaUrl(message.media_url)
  const fileName = message.content || '下载的文件'

  // 创建一个隐藏的a标签来触发下载
  const link = document.createElement('a')
  link.href = fileUrl
  link.download = fileName
  link.target = '_blank'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('开始下载文件')
}

// 翻译功能相关函数
const loadLanguageConfigs = async () => {
  try {
    const res = await getLanguageConfigs()
    languageConfigs.value = res.data || []

    // 如果有默认语言，选中它
    const defaultLang = languageConfigs.value.find(l => l.is_default)
    if (defaultLang) {
      selectedLanguageId.value = defaultLang.id
    } else if (languageConfigs.value.length > 0) {
      selectedLanguageId.value = languageConfigs.value[0].id
    }
  } catch (error) {
    console.error('Error loading language configs:', error)
  }
}

const loadTranslationConfig = async () => {
  try {
    const res = await getTranslationConfig()
    if (res.data) {
      translationConfig.value = res.data
      if (res.data.default_target_language_id) {
        selectedLanguageId.value = res.data.default_target_language_id
      }
    }
  } catch (error) {
    console.error('Error loading translation config:', error)
  }
}

const handleSaveTranslationConfig = async () => {
  try {
    await updateTranslationConfig({
      auto_translate_received: translationConfig.value.auto_translate_received,
      auto_translate_sent: translationConfig.value.auto_translate_sent,
      default_target_language_id: selectedLanguageId.value
    })
    ElMessage.success('翻译设置已保存')

    // 如果打开了自动翻译接收，立即翻译当前消息
    if (translationConfig.value.auto_translate_received && messages.value.length > 0) {
      await translateReceivedMessages()
    }
  } catch (error) {
    console.error('Error saving translation config:', error)
    ElMessage.error('保存翻译设置失败')
  }
}

const handleLanguageChange = async () => {
  await handleSaveTranslationConfig()
}

// 防抖翻译函数
let translateDebounceTimer: ReturnType<typeof setTimeout> | null = null
const translateReceivedMessages = async () => {
  // 清除之前的定时器
  if (translateDebounceTimer) {
    clearTimeout(translateDebounceTimer)
  }

  // 使用防抖，避免频繁调用
  return new Promise<void>((resolve) => {
    translateDebounceTimer = setTimeout(async () => {
      // 只翻译好友发送的文本消息
      const messagesToTranslate = messages.value.filter(
        msg => !msg.is_from_me && msg.type === 'text' && msg.content && !msg.translated_text
      )

      for (const message of messagesToTranslate) {
        // 设置翻译中状态
        message.translating = true

        try {
          // 好友消息永远翻译成中文
          const result = await translateText({
            text: message.content,
            target_language: 'zh', // 固定翻译成中文
            source_language: '' // 自动检测
          })
          message.translated_text = result.data.translated_text
        } catch (error) {
          console.error('Translation error for message:', error)
          message.translated_text = '[翻译失败]'
        } finally {
          message.translating = false
        }
      }
      resolve()
    }, 300) // 300ms 防抖延迟
  })
}

// 监听翻译配置变化
watch(
  () => translationConfig.value.auto_translate_received,
  async (newVal) => {
    if (newVal && messages.value.length > 0) {
      await translateReceivedMessages()
    }
  }
)

// 规范化 JID（移除设备 ID）
const normalizeJID = (jid: string): string => {
  // 移除 WhatsApp 设备 ID（例如 :1, :2 等）
  // 85587899137:1@s.whatsapp.net -> 85587899137@s.whatsapp.net
  return jid.replace(/:\d+@/, '@')
}

// WebSocket 消息处理
const handleNewMessage = async (messageData: NewMessageData) => {
  console.log('收到新消息:', messageData)

  let messageContactPhone = messageData.is_from_me
    ? messageData.to_jid
    : messageData.from_jid

  // 规范化 JID 格式
  messageContactPhone = normalizeJID(messageContactPhone)

  console.log('[Debug] 规范化后的 messageContactPhone:', messageContactPhone)
  console.log('[Debug] 现有会话列表:', conversations.value.map(c => c.contact_phone))

  // ✅ 本地更新会话列表（零网络请求，<10ms）
  updateConversation(messageContactPhone, {
    last_message: messageData.content,
    last_message_time: messageData.timestamp
  })

  // 标记为最近更新，触发动画
  recentlyUpdated.value[messageContactPhone] = true
  setTimeout(() => {
    recentlyUpdated.value[messageContactPhone] = false
  }, 2000) // 2秒后移除高亮

  // 如果不是当前对话，增加未读计数
  if (!selectedConversation.value || messageContactPhone !== selectedConversation.value.contact_phone) {
    if (!messageData.is_from_me) {
      incrementUnread(messageContactPhone)
    }
    return // 不属于当前对话，只更新会话列表
  }

  // ===== 当前对话的消息处理 =====

  // 构造消息对象
  const newMsg: Message = {
    id: messageData.id,
    content: messageData.content,
    type: messageData.type || 'text',
    is_from_me: messageData.is_from_me,
    timestamp: messageData.timestamp,
    send_status: 'sent',
    media_url: messageData.media_url || '',
    original_text: messageData.original_text || '',
    translated_text: undefined,
    translating: false
  }

  // 添加到消息列表
  messages.value.push(newMsg)

  // 如果是好友消息且启用了自动翻译，进行翻译
  if (!newMsg.is_from_me && translationConfig.value.auto_translate_received && newMsg.type === 'text') {
    newMsg.translating = true
    try {
      const result = await translateText({
        text: newMsg.content,
        target_language: 'zh',
        source_language: ''
      })
      newMsg.translated_text = result.data.translated_text
    } catch (error) {
      console.error('翻译失败:', error)
      newMsg.translated_text = '[翻译失败]'
    } finally {
      newMsg.translating = false
    }
  }

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// WebSocket 消息状态更新处理
const handleMessageStatus = (statusData: MessageStatusData) => {
  console.log('收到消息状态更新:', statusData)

  // 在当前消息列表中查找并更新状态
  const message = messages.value.find(m => {
    // 尝试匹配 message_id（可能是字符串或数字）
    return String(m.id) === String(statusData.message_id)
  })

  if (message) {
    message.send_status = statusData.status
    console.log(`消息 ${statusData.message_id} 状态更新为: ${statusData.status}`)
  }
}

// 后台同步机制（防止状态漂移）
const SYNC_INTERVAL = 5 * 60 * 1000 // 5分钟
let syncTimer: ReturnType<typeof setInterval> | null = null

const startBackgroundSync = () => {
  syncTimer = setInterval(async () => {
    try {
      // 静默刷新会话列表
      await fetchConversations()
      console.log('后台同步会话列表完成')
    } catch (error) {
      console.error('后台同步失败:', error)
    }
  }, SYNC_INTERVAL)
}

const stopBackgroundSync = () => {
  if (syncTimer) {
    clearInterval(syncTimer)
    syncTimer = null
  }
}

// 生命周期
onMounted(async () => {
  await fetchUserInfo()
  await fetchConversations()
  await loadLanguageConfigs()
  await loadTranslationConfig()

  // 连接 WebSocket
  if (userId) {
    wsClient.connect(Number(userId))
    // 注册消息处理器
    wsClient.on('new_message', handleNewMessage)
    wsClient.on('message_status', handleMessageStatus)
  }

  // 启动后台同步
  startBackgroundSync()
})

// 监听 WebSocket 连接状态
watch(() => wsClient.connected.value, (newVal) => {
  wsConnected.value = newVal
}, { immediate: true })

onUnmounted(() => {
  // 移除消息处理器
  wsClient.off('new_message', handleNewMessage)
  wsClient.off('message_status', handleMessageStatus)
  // 断开 WebSocket 连接
  wsClient.disconnect()
  // 停止后台同步
  stopBackgroundSync()
})
</script>

<style scoped>
.user-messages {
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
}

.header-card {
  margin-bottom: 10px;
  flex-shrink: 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-left p {
  margin: 0;
  color: #7f8c8d;
}

.header-right {
  display: flex;
  gap: 10px;
}

/* WebSocket 连接状态指示器 */
.ws-status-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 8px 16px;
  background-color: #f56c6c;
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  transition: all 0.3s ease;
}

.ws-status-indicator.connected {
  background-color: #67c23a;
}

.ws-status-indicator .el-icon {
  font-size: 16px;
}

/* 用户信息头部样式 */
.user-info-header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-details h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 18px;
  font-weight: 600;
}

.phone-number {
  margin: 0 0 8px 0;
  color: #606266;
  font-family: monospace;
  font-size: 14px;
}

/* 主要内容区域 */
.main-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  height: 90%;
}

/* 对话列表样式 */
.conversations-card {
  height: 90%;
  display: flex;
  flex-direction: column;
}

.conversations-card :deep(.el-card__body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.conversations-content {
  flex: 1;
  overflow-y: auto;
  padding: 0;
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.conversation-item:hover {
  background-color: #f8f9fa;
}

.conversation-item.active {
  background-color: #e7f3ff;
  border-left: 4px solid #409eff;
}

/* 会话更新动画 */
.conversation-item.just-updated {
  animation: highlight 2s ease-out;
}

@keyframes highlight {
  0% { background-color: #fff3cd; }
  100% { background-color: transparent; }
}

/* 未读消息标记 */
.conversation-item.has-unread .contact-name {
  color: #409eff;
  font-weight: 600;
}

.conversation-item.has-unread .last-message-time {
  color: #409eff;
}

/* 会话操作按钮样式 */
.conversation-actions {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.conversation-item:hover .conversation-actions {
  opacity: 1;
}

/* 已归档会话视觉区分 */
.conversation-item.archived {
  opacity: 0.7;
  background-color: #f5f7fa;
}

.conversation-item.archived .contact-name::before {
  content: '[已归档] ';
  color: #909399;
  font-size: 11px;
  margin-right: 4px;
  font-weight: normal;
}

.conversation-item:last-child {
  border-bottom: none;
}

.conversation-info {
  flex: 1;
  margin-left: 12px;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.contact-name {
  font-weight: 500;
  color: #2c3e50;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.last-time {
  font-size: 12px;
  color: #909399;
  flex-shrink: 0;
  margin-left: 8px;
}

.last-message {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.message-preview {
  font-size: 13px;
  color: #909399;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  margin-right: 8px;
}

.message-badges {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

.empty-conversations {
  padding: 40px 20px;
  text-align: center;
}

/* 消息历史记录样式 */
.messages-card {
  height: 90%;
  display: flex;
  flex-direction: column;
}

.messages-card :deep(.el-card__body) {
  flex: 1;
  padding: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.messages-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.no-conversation-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.messages-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #f8f9fa;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  animation: fadeIn 0.3s ease;
}

.message-item.sent {
  flex-direction: row-reverse;
}

.message-item.received {
  flex-direction: row;
}

.message-avatar {
  flex-shrink: 0;
  margin: 0 10px;
}

.message-content {
  max-width: 70%;
  min-width: 200px;
}

.message-item.sent .message-content {
  background-color: #409eff;
  color: white;
  border-radius: 18px 18px 4px 18px;
  padding: 12px 16px;
  margin-left: auto;
}

.message-item.received .message-content {
  background-color: white;
  color: #2c3e50;
  border-radius: 18px 18px 18px 4px;
  padding: 12px 16px;
  border: 1px solid #e4e7ed;
  margin-right: auto;
}

.message-item.sensitive .message-content {
  border: 2px solid #f56c6c;
  background-color: #fef0f0;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  font-size: 12px;
}

.message-item.sent .message-header {
  color: rgba(255, 255, 255, 0.8);
}

.message-item.received .message-header {
  color: #909399;
}

.sender-name {
  font-weight: 500;
}

.message-time {
  font-size: 11px;
}

.message-body {
  margin-bottom: 5px;
}

.message-text {
  word-wrap: break-word;
  line-height: 1.4;
}

/* 消息媒体样式 */
.message-media {
  width: 100%;
}

.media-container {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  background-color: rgba(0, 0, 0, 0.05);
}

.message-item.sent .media-container {
  background-color: rgba(255, 255, 255, 0.1);
}

.media-icon {
  flex-shrink: 0;
  padding: 8px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-content {
  flex: 1;
  min-width: 0;
}

.media-type {
  margin-bottom: 6px;
}

.media-description {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  word-wrap: break-word;
}

.message-item.sent .media-description {
  color: rgba(255, 255, 255, 0.9);
}

.message-item.received .media-description {
  color: #606266;
}

.no-content {
  font-style: italic;
  opacity: 0.7;
}

/* 语音控制样式 */
.voice-controls {
  margin-top: 8px;
}

.voice-controls audio {
  width: 100%;
  max-width: 300px;
}

.no-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  text-align: center;
  font-size: 12px;
  opacity: 0.7;
}

.message-item.received .no-media {
  border-color: #dcdfe6;
  color: #909399;
}

/* 媒体预览样式 */
.media-preview {
  margin-top: 8px;
}

.video-preview {
  display: flex;
  justify-content: center;
}

.video-preview video {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.image-preview {
  display: flex;
  justify-content: center;
}

.image-preview :deep(.el-image) {
  cursor: pointer;
  transition: transform 0.2s ease;
}

.image-preview :deep(.el-image:hover) {
  transform: scale(1.02);
}

.image-slot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  height: 100%;
  min-height: 100px;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 12px;
}

.image-slot .el-icon {
  font-size: 32px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  border: 2px dashed rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  text-align: center;
}

.message-item.received .preview-placeholder {
  border-color: #dcdfe6;
}

.preview-placeholder span {
  font-size: 12px;
  opacity: 0.7;
}

/* 文件控制样式 */
.file-controls {
  margin-top: 8px;
}

/* 位置控制样式 */
.location-controls {
  margin-top: 8px;
}

.message-status {
  text-align: right;
  margin-top: 5px;
}

.message-item.sent .message-status {
  text-align: left;
}

/* 消息操作按钮样式 */
.message-actions {
  display: flex;
  gap: 4px;
  margin-top: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.message-item:hover .message-actions {
  opacity: 1;
}

.message-item.sent .message-actions {
  justify-content: flex-start;
}

.message-item.received .message-actions {
  justify-content: flex-end;
}

/* 已撤销消息标识 */
.message-revoked-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  margin-top: 8px;
  background-color: #f5f7fa;
  border-radius: 4px;
  color: #909399;
  font-size: 13px;
  font-style: italic;

  .el-icon {
    font-size: 14px;
  }
}

.message-item.sent .message-revoked-badge {
  background-color: rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
}

.empty-messages {
  text-align: center;
  padding: 40px;
}

.load-more {
  text-align: center;
  padding: 20px;
  border-top: 1px solid #e4e7ed;
}

/* 卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #2c3e50;
}

/* 动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
.conversations-content::-webkit-scrollbar,
.messages-list::-webkit-scrollbar {
  width: 8px;
}

.conversations-content::-webkit-scrollbar-track,
.messages-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.conversations-content::-webkit-scrollbar-thumb,
.messages-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
  border: 1px solid transparent;
  background-clip: content-box;
}

.conversations-content::-webkit-scrollbar-thumb:hover,
.messages-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
  background-clip: content-box;
}

/* 火狐浏览器滚动条样式 */
.conversations-content,
.messages-list {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* 消息输入区域样式 */
.message-input-area {
  border-top: 1px solid #e4e7ed;
  background-color: #fff;
  flex-shrink: 0;
}

.input-container {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  padding: 6px 15px;
}

.message-input {
  flex: 1;
}

.message-input :deep(.el-textarea__inner) {
  border-radius: 18px;
  border: 1px solid #dcdfe6;
  resize: none !important;
  padding: 6px 12px;
  line-height: 1.4;
  font-size: 14px;
  min-height: 32px !important;
  background-color: #f8f9fa;
  transition: all 0.2s ease;
}

.message-input :deep(.el-textarea__inner):focus {
  border-color: #409eff;
  background-color: #fff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
}

.input-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.input-actions .el-button {
  border-radius: 16px;
  padding: 4px 12px;
  height: 32px;
  font-weight: 500;
  font-size: 13px;
}

:deep(.el-card__body) {
  padding: 10px;
}

:deep(.header-card .el-card__body) {
  padding: 10px;
}

:deep(.stats-card .el-card__body) {
  padding: 15px;
}

/* 优化Element Plus的行间距 */
:deep(.el-row) {
  height: 100%;
  margin: 0 !important;
}

:deep(.el-col) {
  height: 100%;
  padding: 0 5px !important;
}

/* 确保没有额外的margins造成溢出 */
:deep(.el-card) {
  margin: 0 !important;
}

:deep(.el-card__header) {
  padding: 10px 0 !important;
  margin: 0 !important;
}

/* 翻译设置面板样式 */
.translation-settings-card {
  margin-bottom: 10px;
  flex-shrink: 0;
}

.translation-settings {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.settings-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 14px;
  flex-shrink: 0;
}

.settings-controls {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.control-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #606266;
}

.control-item span {
  white-space: nowrap;
}

/* 翻译文本样式 */
.translated-text {
  margin-top: 8px;
  padding-top: 8px;
}

.translation-header {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  margin-bottom: 4px;
  opacity: 0.7;
}

.translation-content {
  font-size: 13px;
  line-height: 1.4;
  opacity: 0.9;
}

.message-item.sent .translation-content {
  color: rgba(255, 255, 255, 0.95);
}

.message-item.received .translation-content {
  color: #606266;
}

.translating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  font-size: 12px;
  opacity: 0.7;
}

.translating .is-loading {
  animation: rotating 2s linear infinite;
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 图片预览样式 */
.image-preview-container {
  padding: 10px;
  border-bottom: 1px solid #eee;
  background-color: #f5f7fa;
}

.preview-image-wrapper {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 8px;
  border: 1px solid #ddd;
  display: block;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  z-index: 10;
}
</style>