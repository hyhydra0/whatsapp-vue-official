import { api } from '@/utils/request'

// WhatsApp API响应类型
export interface QRCodeResponse {
  session_id: string
  qr_code: string
  timeout: number
  created_at: string
}

export interface LoginStatusResponse {
  connected: boolean
  jid?: string
  push_name?: string
  platform?: string
  last_seen: string
}

export interface PairingCodeResponse {
  session_id: string
  pairing_code: string
  timeout: number
}

export interface VerifyCodeResponse {
  success: boolean
  connected: boolean
  jid?: string
}

// WhatsApp API
export const whatsappApi = {
  // 生成登录二维码
  generateQR(): Promise<QRCodeResponse> {
    return api.post('/whatsapp/qr', {})
  },

  // 获取配对码（手机号登录）
  getPairingCode(phoneNumber: string): Promise<PairingCodeResponse> {
    return api.post('/pairing-code', { phone_number: phoneNumber })
  },

  // 验证配对码
  verifyPairingCode(sessionId: string, code: string): Promise<VerifyCodeResponse> {
    return api.post('/verify-code', { session_id: sessionId, code })
  },

  // 检查登录状态
  checkStatus(sessionID: string): Promise<LoginStatusResponse> {
    return api.get('/whatsapp/status', { params: { session_id: sessionID } })
  },

  // 断开连接
  disconnect(sessionID: string): Promise<void> {
    return api.post('/whatsapp/disconnect', { session_id: sessionID })
  },

  // 恢复会话
  restore(sessionID: string): Promise<void> {
    return api.post('/whatsapp/restore', { session_id: sessionID })
  },

  // 清理过期会话
  cleanup(): Promise<void> {
    return api.post('/whatsapp/cleanup')
  },

  // 获取所有账号列表
  getAccounts(): Promise<any> {
    return api.get('/accounts')
  },

  // 获取单个账号详情
  getAccount(accountId: number): Promise<any> {
    return api.get(`/accounts/${accountId}`)
  },

  // 获取账号的聊天列表
  getAccountChats(accountId: number): Promise<any> {
    return api.get(`/accounts/${accountId}/chats`)
  }
}

export default whatsappApi