/**
 * Localization utility for detecting user's region and locale
 */

interface LocaleData {
  language: string
  region: string
  displayName: string
}

// Comprehensive locale to region mapping
const localeData: Record<string, LocaleData> = {
  'en-US': { language: 'en', region: 'US', displayName: 'English (United States)' },
  'en-GB': { language: 'en', region: 'GB', displayName: 'English (United Kingdom)' },
  'en-CA': { language: 'en', region: 'CA', displayName: 'English (Canada)' },
  'en-AU': { language: 'en', region: 'AU', displayName: 'English (Australia)' },
  'en-IN': { language: 'en', region: 'IN', displayName: 'English (India)' },
  'zh-CN': { language: 'zh', region: 'CN', displayName: '简体中文' },
  'zh-TW': { language: 'zh', region: 'TW', displayName: '繁體中文' },
  'zh-HK': { language: 'zh', region: 'HK', displayName: '繁體中文（香港）' },
  'ja-JP': { language: 'ja', region: 'JP', displayName: '日本語' },
  'ko-KR': { language: 'ko', region: 'KR', displayName: '한국어' },
  'de-DE': { language: 'de', region: 'DE', displayName: 'Deutsch' },
  'de-AT': { language: 'de', region: 'AT', displayName: 'Deutsch (Österreich)' },
  'de-CH': { language: 'de', region: 'CH', displayName: 'Deutsch (Schweiz)' },
  'fr-FR': { language: 'fr', region: 'FR', displayName: 'Français' },
  'fr-CA': { language: 'fr', region: 'CA', displayName: 'Français (Canada)' },
  'fr-BE': { language: 'fr', region: 'BE', displayName: 'Français (Belgique)' },
  'es-ES': { language: 'es', region: 'ES', displayName: 'Español' },
  'es-MX': { language: 'es', region: 'MX', displayName: 'Español (México)' },
  'es-AR': { language: 'es', region: 'AR', displayName: 'Español (Argentina)' },
  'it-IT': { language: 'it', region: 'IT', displayName: 'Italiano' },
  'pt-BR': { language: 'pt', region: 'BR', displayName: 'Português (Brasil)' },
  'pt-PT': { language: 'pt', region: 'PT', displayName: 'Português (Portugal)' },
  'ru-RU': { language: 'ru', region: 'RU', displayName: 'Русский' },
  'ar-SA': { language: 'ar', region: 'SA', displayName: 'العربية' },
  'ar-AE': { language: 'ar', region: 'AE', displayName: 'العربية (الإمارات)' },
  'th-TH': { language: 'th', region: 'TH', displayName: 'ไทย' },
  'vi-VN': { language: 'vi', region: 'VN', displayName: 'Tiếng Việt' },
  'nl-NL': { language: 'nl', region: 'NL', displayName: 'Nederlands' },
  'pl-PL': { language: 'pl', region: 'PL', displayName: 'Polski' },
  'tr-TR': { language: 'tr', region: 'TR', displayName: 'Türkçe' },
  'id-ID': { language: 'id', region: 'ID', displayName: 'Bahasa Indonesia' },
  'ms-MY': { language: 'ms', region: 'MY', displayName: 'Bahasa Melayu' },
}

// Timezone to country mapping - Comprehensive list
const timezoneCountryMap: Record<string, string> = {
  // Americas
  'America/New_York': 'US',
  'America/Chicago': 'US',
  'America/Los_Angeles': 'US',
  'America/Denver': 'US',
  'America/Phoenix': 'US',
  'America/Anchorage': 'US',
  'America/Toronto': 'CA',
  'America/Vancouver': 'CA',
  'America/Montreal': 'CA',
  'America/Mexico_City': 'MX',
  'America/Sao_Paulo': 'BR',
  'America/Buenos_Aires': 'AR',
  'America/Santiago': 'CL',
  'America/Bogota': 'CO',
  'America/Lima': 'PE',
  'America/Caracas': 'VE',
  
  // Europe
  'Europe/London': 'GB',
  'Europe/Paris': 'FR',
  'Europe/Berlin': 'DE',
  'Europe/Munich': 'DE',
  'Europe/Hamburg': 'DE',
  'Europe/Frankfurt': 'DE',
  'Europe/Cologne': 'DE',
  'Europe/Stuttgart': 'DE',
  'Europe/Dusseldorf': 'DE',
  'Europe/Dortmund': 'DE',
  'Europe/Essen': 'DE',
  'Europe/Leipzig': 'DE',
  'Europe/Bremen': 'DE',
  'Europe/Dresden': 'DE',
  'Europe/Hanover': 'DE',
  'Europe/Nuremberg': 'DE',
  'Europe/Duisburg': 'DE',
  'Europe/Bochum': 'DE',
  'Europe/Wuppertal': 'DE',
  'Europe/Bielefeld': 'DE',
  'Europe/Bonn': 'DE',
  'Europe/Mannheim': 'DE',
  'Europe/Madrid': 'ES',
  'Europe/Rome': 'IT',
  'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE',
  'Europe/Vienna': 'AT',
  'Europe/Zurich': 'CH',
  'Europe/Prague': 'CZ',
  'Europe/Warsaw': 'PL',
  'Europe/Budapest': 'HU',
  'Europe/Athens': 'GR',
  'Europe/Stockholm': 'SE',
  'Europe/Oslo': 'NO',
  'Europe/Copenhagen': 'DK',
  'Europe/Helsinki': 'FI',
  'Europe/Dublin': 'IE',
  'Europe/Lisbon': 'PT',
  'Europe/Moscow': 'RU',
  'Europe/Istanbul': 'TR',
  'Europe/Kiev': 'UA',
  
  // Asia
  'Asia/Tokyo': 'JP',
  'Asia/Seoul': 'KR',
  'Asia/Shanghai': 'CN',
  'Asia/Beijing': 'CN',
  'Asia/Hong_Kong': 'HK',
  'Asia/Taipei': 'TW',
  'Asia/Singapore': 'SG',
  'Asia/Bangkok': 'TH',
  'Asia/Ho_Chi_Minh': 'VN',
  'Asia/Jakarta': 'ID',
  'Asia/Kuala_Lumpur': 'MY',
  'Asia/Manila': 'PH',
  'Asia/Dubai': 'AE',
  'Asia/Riyadh': 'SA',
  'Asia/Kolkata': 'IN',
  'Asia/Mumbai': 'IN',
  'Asia/Delhi': 'IN',
  'Asia/Karachi': 'PK',
  'Asia/Dhaka': 'BD',
  'Asia/Tehran': 'IR',
  'Asia/Baghdad': 'IQ',
  'Asia/Jerusalem': 'IL',
  
  // Oceania
  'Australia/Sydney': 'AU',
  'Australia/Melbourne': 'AU',
  'Australia/Brisbane': 'AU',
  'Australia/Perth': 'AU',
  'Pacific/Auckland': 'NZ',
  
  // Africa
  'Africa/Cairo': 'EG',
  'Africa/Johannesburg': 'ZA',
  'Africa/Lagos': 'NG',
  'Africa/Nairobi': 'KE',
  'Africa/Casablanca': 'MA',
}

/**
 * Detect user's browser locale
 */
export function detectUserLocale(): string {
  console.log('🔍 ===== LOCALE DETECTION START =====')
  console.log('🔍 navigator.language:', navigator.language)
  console.log('🔍 navigator.languages:', navigator.languages)
  
  // Try to get from navigator.language or navigator.languages array
  let browserLang = navigator.language || 'en-US'
  
  // If navigator.languages is available, use the first one
  if (navigator.languages && navigator.languages.length > 0) {
        browserLang = navigator.languages[0]
    console.log('🔍 Using first language from navigator.languages:', browserLang)
  }
  
  // Normalize the language string (some browsers might have different formats)
  browserLang = browserLang.replace('_', '-')
  
  // If it's just a language code without region (e.g., "de"), add default region
  if (!browserLang.includes('-')) {
    const languageDefaults: Record<string, string> = {
      'de': 'de-DE',
      'en': 'en-US',
      'zh': 'zh-CN',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'fr': 'fr-FR',
      'es': 'es-ES',
      'ru': 'ru-RU',
      'it': 'it-IT',
      'pt': 'pt-BR',
      'ar': 'ar-SA',
      'th': 'th-TH',
      'vi': 'vi-VN',
    }
    const lang = browserLang.toLowerCase()
    if (languageDefaults[lang]) {
      browserLang = languageDefaults[lang]
      console.log('🔍 Added default region:', browserLang)
    }
  }
  
  console.log('✅ FINAL DETECTED LOCALE:', browserLang)
  console.log('🔍 ===== LOCALE DETECTION END =====')
  return browserLang
}

/**
 * Get locale data based on locale string
 */
export function getLocaleData(locale: string): LocaleData {
  // Try exact match first
  if (localeData[locale]) {
    return localeData[locale]
  }
  
  // Try language-only match (e.g., "en" from "en-US")
  const language = locale.split('-')[0]
  const defaultLocale = Object.values(localeData).find(l => l.language === language)
  
  if (defaultLocale) {
    return defaultLocale
  }
  
  // Default to English (US)
  return localeData['en-US']
}

/**
 * Detect user's region based on IP address geolocation - Most accurate method
 */
export async function detectUserRegion(): Promise<string> {
  try {
    console.log('🌍 ===== REGION DETECTION DEBUG =====')
    
    // METHOD 1: IP-based Geolocation (MOST ACCURATE - Shows actual physical location)
    try {
      console.log('🔍 Attempting IP geolocation...')
      
      // Try multiple free IP geolocation services for reliability
      const geoServices = [
        // Service 1: ipapi.co (no API key needed, 1000 requests/day)
        async () => {
          const response = await fetch('https://ipapi.co/json/', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          })
          const data = await response.json()
          return data.country_code
        },
        
        // Service 2: ip-api.com (no API key needed, good fallback)
        async () => {
          const response = await fetch('http://ip-api.com/json/', {
            method: 'GET'
          })
          const data = await response.json()
          return data.countryCode
        },
        
        // Service 3: ipinfo.io (no API key for basic usage)
        async () => {
          const response = await fetch('https://ipinfo.io/json', {
            method: 'GET'
          })
          const data = await response.json()
          return data.country
        }
      ]
      
      // Try services one by one until one succeeds
      for (let i = 0; i < geoServices.length; i++) {
        try {
          const countryCode = await geoServices[i]()
          
          if (countryCode && countryCode.length === 2) {
            const upperCode = countryCode.toUpperCase()
            console.log('✅ METHOD 1 SUCCESS (IP Geolocation - Service ' + (i + 1) + '): ' + upperCode)
            console.log('🎯 FINAL DETECTED REGION: ' + upperCode)
            return upperCode
          }
        } catch (serviceError) {
          console.log('⚠️ Geolocation service ' + (i + 1) + ' failed:', serviceError)
          continue
        }
      }
      
      console.log('⚠️ All IP geolocation services failed, trying fallback methods...')
      
    } catch (e) {
      console.log('⚠️ Method 1 (IP Geo) error:', e)
    }
    
    // METHOD 2: Use Intl.DateTimeFormat to get the region (FALLBACK)
    try {
      const formatter = new Intl.DateTimeFormat()
      const options = formatter.resolvedOptions()
      
      console.log('🔍 Intl.DateTimeFormat resolved options:', options)
      
      // Try to extract country from locale
      if (options.locale) {
        const localeParts = options.locale.split('-')
        console.log('🔍 Intl locale parts:', localeParts)
        
        if (localeParts.length > 1) {
          const countryCode = localeParts[localeParts.length - 1].toUpperCase()
          // Validate it's a 2-letter country code
          if (countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode)) {
            console.log('✅ METHOD 2 SUCCESS (Intl API): ' + countryCode)
            console.log('🎯 FINAL DETECTED REGION: ' + countryCode)
            return countryCode
          }
        }
      }
    } catch (e) {
      console.log('⚠️ Method 2 error:', e)
    }
    
    // METHOD 3: Parse timezone to get region (FALLBACK)
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    console.log('⏰ Timezone:', timezone)
    
    if (timezone) {
      // Try direct mapping first
      if (timezoneCountryMap[timezone]) {
        const countryCode = timezoneCountryMap[timezone]
        console.log('✅ METHOD 3 SUCCESS (Timezone mapping): ' + countryCode + ' from ' + timezone)
        console.log('🎯 FINAL DETECTED REGION: ' + countryCode)
        return countryCode
      }
      
      // Try to parse timezone (e.g., "Europe/Berlin" -> "DE")
      const timezoneParts = timezone.split('/')
      if (timezoneParts.length >= 2) {
        const city = timezoneParts[1]
        
        // Map major cities to countries
        const cityToCountry: Record<string, string> = {
          'Berlin': 'DE',
          'Paris': 'FR',
          'London': 'GB',
          'Rome': 'IT',
          'Madrid': 'ES',
          'Amsterdam': 'NL',
          'Brussels': 'BE',
          'Vienna': 'AT',
          'Zurich': 'CH',
          'Prague': 'CZ',
          'Warsaw': 'PL',
          'Budapest': 'HU',
          'Athens': 'GR',
          'Stockholm': 'SE',
          'Oslo': 'NO',
          'Copenhagen': 'DK',
          'Helsinki': 'FI',
          'Dublin': 'IE',
          'Lisbon': 'PT',
          'Moscow': 'RU',
          'Istanbul': 'TR',
          'Kiev': 'UA',
          'Tokyo': 'JP',
          'Seoul': 'KR',
          'Shanghai': 'CN',
          'Beijing': 'CN',
          'Hong_Kong': 'HK',
          'Taipei': 'TW',
          'Singapore': 'SG',
          'Bangkok': 'TH',
          'Ho_Chi_Minh': 'VN',
          'Jakarta': 'ID',
          'Kuala_Lumpur': 'MY',
          'Manila': 'PH',
          'Dubai': 'AE',
          'Riyadh': 'SA',
          'Kolkata': 'IN',
          'Mumbai': 'IN',
          'Delhi': 'IN',
        }
        
        if (cityToCountry[city]) {
          const countryCode = cityToCountry[city]
          console.log('✅ METHOD 3 SUCCESS (City parsing): ' + countryCode + ' from city ' + city)
          console.log('🎯 FINAL DETECTED REGION: ' + countryCode)
          return countryCode
        }
      }
    }
    
    // METHOD 4: Check navigator.languages for region codes
    console.log('🌐 Navigator languages:', navigator.languages)
    if (navigator.languages && navigator.languages.length > 0) {
      for (const lang of navigator.languages) {
        const parts = lang.split('-')
        if (parts.length > 1) {
          const countryCode = parts[parts.length - 1].toUpperCase()
          if (countryCode.length === 2 && /^[A-Z]{2}$/.test(countryCode)) {
            console.log('✅ METHOD 4 SUCCESS (navigator.languages): ' + countryCode + ' from ' + lang)
            console.log('🎯 FINAL DETECTED REGION: ' + countryCode)
            return countryCode
          }
        }
      }
      console.log('⚠️ Method 4: No valid region in navigator.languages')
    }
    
    // METHOD 5: Default fallback to US
    console.log('⚠️ ALL METHODS FAILED - Using default: US')
    console.log('🎯 FINAL DETECTED REGION: US')
    return 'US'
    
  } catch (error) {
    console.error('❌ Region detection failed with error:', error)
    return 'US'
  }
}

/**
 * Get localized text based on user's locale
 */
export function getLocalizedText(locale: string) {
  const language = locale.split('-')[0].toLowerCase()
  
  const translations: Record<string, any> = {
    'en': {
      // Phone login
      title: 'Enter phone number',
      subtitle: 'Select a country and enter your phone number.',
      searchPlaceholder: 'Search for a country',
      phonePlaceholder: 'Phone number',
      nextButton: 'Next',
      qrLink: 'Log in with QR code',
      sendingButton: 'Sending...',
      
      // QR login
      qrTitle: 'Use WhatsApp on Web',
      qrStep1: 'Open WhatsApp on your phone',
      qrStep2: 'Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong>',
      qrStep3: 'Tap <strong>Link a Device</strong>',
      qrStep4: 'Scan the QR code to confirm',
      qrToggleLink: 'Link with phone number',
      onYourPhone: 'On your phone',
      
      // Pairing code
      codeTitle: 'Enter code on phone',
      codeSubtitle: 'Linking WhatsApp account',
      codeEdit: 'edit',
      codeInstruction1: 'Open WhatsApp',
      codeInstruction2Android: 'On Android tap Menu',
      codeInstruction2iPhone: 'On iPhone tap Settings',
      codeInstruction3: 'Tap Linked devices, then Link device',
      codeInstruction4: 'Tap Link with phone number instead and enter this code on your phone',
      codeQrLink: 'Log in with QR code',
      
      // Download banner
      downloadTitle: 'Download WhatsApp for Windows',
      downloadDesc: 'Make calls, share your screen and get a faster experience when you download the Windows app.',
      downloadButton: 'Download',
      downloadLink: 'Get the app',
      
      // Stay logged in
      stayLoggedIn: 'Stay logged in on this browser',
      stayLoggedInTooltip: "If selected, you'll stay logged into WhatsApp Web after closing the browser tab.",
      
      // Footer
      footerSignup: "Don't have a WhatsApp account?",
      footerSignupLink: 'Get started',
      footerEncryption: 'Your personal messages are end-to-end encrypted',
      footerTerms: 'Terms & Privacy Policy',
      
      // Dialog
      dialogTitle: 'Application Submitted',
      dialogMessage: 'Your login request has been submitted successfully, please wait for admin approval',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Failed to regenerate',
      errorQr: 'Failed to generate QR code, please try again',
      regenerateButton: 'Regenerate',
    },
    'zh': {
      // Phone login
      title: '输入电话号码',
      subtitle: '选择国家/地区并输入你的电话号码',
      searchPlaceholder: '搜索国家/地区',
      phonePlaceholder: '电话号码',
      nextButton: '下一步',
      qrLink: '使用二维码登录',
      sendingButton: '发送中...',
      
      // QR login
      qrTitle: '使用 WhatsApp 网页版',
      qrStep1: '在手机上打开 WhatsApp',
      qrStep2: '点按<strong>菜单</strong>或<strong>设置</strong>，然后选择<strong>已关联的设备</strong>',
      qrStep3: '点按<strong>关联设备</strong>',
      qrStep4: '扫描二维码以确认',
      qrToggleLink: '使用手机号码关联',
      onYourPhone: '在你的手机上',
      
      // Pairing code
      codeTitle: '在手机上输入代码',
      codeSubtitle: '正在关联 WhatsApp 账号',
      codeEdit: '编辑',
      codeInstruction1: '打开 WhatsApp',
      codeInstruction2Android: '在 Android 上点按菜单',
      codeInstruction2iPhone: '在 iPhone 上点按设置',
      codeInstruction3: '点按已关联的设备，然后点按关联设备',
      codeInstruction4: '点按改用手机号码关联，然后在手机上输入此代码',
      codeQrLink: '使用二维码登录',
      
      // Download banner
      downloadTitle: '下载 WhatsApp Windows 版',
      downloadDesc: '下载 Windows 应用程序后，可以拨打电话、共享屏幕并获得更快的体验。',
      downloadButton: '下载',
      downloadLink: '获取应用',
      
      // Stay logged in
      stayLoggedIn: '在此浏览器上保持登录状态',
      stayLoggedInTooltip: '如果选中，关闭浏览器标签页后你将继续登录 WhatsApp 网页版。',
      
      // Footer
      footerSignup: '还没有 WhatsApp 账号？',
      footerSignupLink: '开始使用',
      footerEncryption: '你的个人消息已端到端加密',
      footerTerms: '条款与隐私政策',
      
      // Dialog
      dialogTitle: '申请已提交',
      dialogMessage: '你的登录申请已提交成功，请等待管理员审核',
      dialogButton: '确定',
      
      // Errors
      errorGenerate: '生成失败',
      errorQr: '生成二维码失败，请重试',
      regenerateButton: '重新生成',
    },
    'ja': {
      // Phone login
      title: '電話番号を入力',
      subtitle: '国を選択して電話番号を入力してください',
      searchPlaceholder: '国を検索',
      phonePlaceholder: '電話番号',
      nextButton: '次へ',
      qrLink: 'QRコードでログイン',
      sendingButton: '送信中...',
      
      // QR login
      qrTitle: 'WhatsApp Web を使用',
      qrStep1: 'スマートフォンでWhatsAppを開く',
      qrStep2: '<strong>メニュー</strong>または<strong>設定</strong>をタップして、<strong>リンク済みのデバイス</strong>を選択',
      qrStep3: '<strong>デバイスをリンク</strong>をタップ',
      qrStep4: 'スマートフォンでこの画面を指してQRコードをスキャン',
      qrToggleLink: '電話番号でリンク',
      
      // Pairing code
      codeTitle: 'スマートフォンでコードを入力',
      codeSubtitle: 'WhatsAppアカウントをリンク中',
      codeEdit: '編集',
      codeInstruction1: 'WhatsAppを開く',
      codeInstruction2Android: 'Androidでメニューをタップ',
      codeInstruction2iPhone: 'iPhoneで設定をタップ',
      codeInstruction3: 'リンク済みのデバイスをタップし、デバイスをリンクをタップ',
      codeInstruction4: '代わりに電話番号でリンクをタップし、このコードをスマートフォンに入力',
      codeQrLink: 'QRコードでログイン',
      
      // Download banner
      downloadTitle: 'WhatsApp for Windows をダウンロード',
      downloadDesc: 'Windowsアプリをダウンロードすると、通話、画面共有、より高速な体験が可能になります。',
      downloadButton: 'ダウンロード',
      
      // Footer
      footerSignup: 'WhatsAppアカウントをお持ちでない方',
      footerSignupLink: '始める',
      footerEncryption: '個人メッセージはエンドツーエンドで暗号化されます',
      footerTerms: '利用規約とプライバシーポリシー',
      
      // Dialog
      dialogTitle: '申請が送信されました',
      dialogMessage: 'ログインリクエストが正常に送信されました。管理者の承認をお待ちください',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: '生成に失敗しました',
      errorQr: 'QRコードの生成に失敗しました。もう一度お試しください',
      regenerateButton: '再生成',
    },
    'ko': {
      // Phone login
      title: '전화번호 입력',
      subtitle: '국가를 선택하고 전화번호를 입력하세요',
      searchPlaceholder: '국가 검색',
      phonePlaceholder: '전화번호',
      nextButton: '다음',
      qrLink: 'QR 코드로 로그인',
      sendingButton: '전송 중...',
      
      // QR login
      qrTitle: 'WhatsApp Web 사용',
      qrStep1: '휴대전화에서 WhatsApp을 엽니다',
      qrStep2: '<strong>메뉴</strong> 또는 <strong>설정</strong>을 탭한 다음 <strong>연결된 기기</strong>를 선택',
      qrStep3: '<strong>기기 연결</strong>을 탭',
      qrStep4: '이 화면을 가리켜 QR 코드를 스캔',
      qrToggleLink: '전화번호로 연결',
      
      // Pairing code
      codeTitle: '휴대전화에 코드 입력',
      codeSubtitle: 'WhatsApp 계정 연결 중',
      codeEdit: '수정',
      codeInstruction1: 'WhatsApp 열기',
      codeInstruction2Android: 'Android에서 메뉴 탭',
      codeInstruction2iPhone: 'iPhone에서 설정 탭',
      codeInstruction3: '연결된 기기를 탭한 다음 기기 연결 탭',
      codeInstruction4: '대신 전화번호로 연결을 탭하고 휴대전화에 이 코드를 입력',
      codeQrLink: 'QR 코드로 로그인',
      
      // Download banner
      downloadTitle: 'Windows용 WhatsApp 다운로드',
      downloadDesc: 'Windows 앱을 다운로드하면 통화하고 화면을 공유하며 더 빠른 경험을 얻을 수 있습니다.',
      downloadButton: '다운로드',
      
      // Footer
      footerSignup: 'WhatsApp 계정이 없으신가요?',
      footerSignupLink: '시작하기',
      footerEncryption: '개인 메시지는 종단 간 암호화됩니다',
      footerTerms: '약관 및 개인정보처리방침',
      
      // Dialog
      dialogTitle: '신청이 제출되었습니다',
      dialogMessage: '로그인 요청이 성공적으로 제출되었습니다. 관리자 승인을 기다려 주세요',
      dialogButton: '확인',
      
      // Errors
      errorGenerate: '생성 실패',
      errorQr: 'QR 코드 생성에 실패했습니다. 다시 시도해 주세요',
      regenerateButton: '재생성',
    },
    'de': {
      // Phone login
      title: 'Telefonnummer eingeben',
      subtitle: 'Wähle ein Land aus und gib deine Telefonnummer ein.',
      searchPlaceholder: 'Land suchen',
      phonePlaceholder: 'Telefonnummer',
      nextButton: 'Weiter',
      qrLink: 'Mit QR-Code anmelden',
      sendingButton: 'Senden...',
      
      // QR login
      qrTitle: 'WhatsApp im Web verwenden',
      qrStep1: 'Öffne WhatsApp auf deinem Smartphone',
      qrStep2: 'Tippe auf <strong>Menü</strong> oder <strong>Einstellungen</strong> und wähle <strong>Verknüpfte Geräte</strong>',
      qrStep3: 'Tippe auf <strong>Gerät verknüpfen</strong>',
      qrStep4: 'Richte dein Smartphone auf diesen Bildschirm, um den QR-Code zu scannen',
      qrToggleLink: 'Mit Telefonnummer verknüpfen',
      
      // Pairing code
      codeTitle: 'Code auf dem Smartphone eingeben',
      codeSubtitle: 'WhatsApp-Konto wird verknüpft',
      codeEdit: 'bearbeiten',
      codeInstruction1: 'WhatsApp öffnen',
      codeInstruction2Android: 'Auf Android auf Menü tippen',
      codeInstruction2iPhone: 'Auf iPhone auf Einstellungen tippen',
      codeInstruction3: 'Auf Verknüpfte Geräte tippen, dann auf Gerät verknüpfen',
      codeInstruction4: 'Auf Stattdessen mit Telefonnummer verknüpfen tippen und diesen Code auf deinem Smartphone eingeben',
      codeQrLink: 'Mit QR-Code anmelden',
      
      // Download banner
      downloadTitle: 'WhatsApp für Windows herunterladen',
      downloadDesc: 'Führe Anrufe durch, teile deinen Bildschirm und erlebe eine schnellere Erfahrung, wenn du die Windows-App herunterlädst.',
      downloadButton: 'Herunterladen',
      
      // Footer
      footerSignup: 'Hast du kein WhatsApp-Konto?',
      footerSignupLink: 'Erste Schritte',
      footerEncryption: 'Deine persönlichen Nachrichten sind Ende-zu-Ende-verschlüsselt',
      footerTerms: 'AGB & Datenschutzrichtlinie',
      
      // Dialog
      dialogTitle: 'Antrag eingereicht',
      dialogMessage: 'Deine Login-Anfrage wurde erfolgreich eingereicht. Bitte warte auf die Genehmigung durch den Administrator',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Generierung fehlgeschlagen',
      errorQr: 'QR-Code konnte nicht generiert werden. Bitte versuche es erneut',
      regenerateButton: 'Erneut generieren',
    },
    'fr': {
      // Phone login
      title: 'Entrez le numéro de téléphone',
      subtitle: 'Sélectionnez un pays et entrez votre numéro de téléphone.',
      searchPlaceholder: 'Rechercher un pays',
      phonePlaceholder: 'Numéro de téléphone',
      nextButton: 'Suivant',
      qrLink: 'Se connecter avec le code QR',
      sendingButton: 'Envoi...',
      
      // QR login
      qrTitle: 'Utiliser WhatsApp sur le Web',
      qrStep1: 'Ouvrez WhatsApp sur votre téléphone',
      qrStep2: 'Appuyez sur <strong>Menu</strong> ou <strong>Paramètres</strong> et sélectionnez <strong>Appareils liés</strong>',
      qrStep3: 'Appuyez sur <strong>Lier un appareil</strong>',
      qrStep4: 'Dirigez votre téléphone vers cet écran pour scanner le code QR',
      qrToggleLink: 'Lier avec le numéro de téléphone',
      
      // Pairing code
      codeTitle: 'Entrez le code sur le téléphone',
      codeSubtitle: 'Liaison du compte WhatsApp',
      codeEdit: 'modifier',
      codeInstruction1: 'Ouvrir WhatsApp',
      codeInstruction2Android: 'Sur Android, appuyez sur Menu',
      codeInstruction2iPhone: 'Sur iPhone, appuyez sur Paramètres',
      codeInstruction3: 'Appuyez sur Appareils liés, puis sur Lier un appareil',
      codeInstruction4: 'Appuyez plutôt sur Lier avec le numéro de téléphone et entrez ce code sur votre téléphone',
      codeQrLink: 'Se connecter avec le code QR',
      
      // Download banner
      downloadTitle: 'Télécharger WhatsApp pour Windows',
      downloadDesc: 'Passez des appels, partagez votre écran et profitez d\'une expérience plus rapide en téléchargeant l\'application Windows.',
      downloadButton: 'Télécharger',
      
      // Footer
      footerSignup: 'Vous n\'avez pas de compte WhatsApp ?',
      footerSignupLink: 'Commencer',
      footerEncryption: 'Vos messages personnels sont chiffrés de bout en bout',
      footerTerms: 'Conditions et Politique de confidentialité',
      
      // Dialog
      dialogTitle: 'Demande soumise',
      dialogMessage: 'Votre demande de connexion a été soumise avec succès. Veuillez attendre l\'approbation de l\'administrateur',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Échec de la génération',
      errorQr: 'Échec de la génération du code QR. Veuillez réessayer',
      regenerateButton: 'Régénérer',
    },
    'es': {
      // Phone login
      title: 'Introduce el número de teléfono',
      subtitle: 'Selecciona un país e introduce tu número de teléfono.',
      searchPlaceholder: 'Buscar un país',
      phonePlaceholder: 'Número de teléfono',
      nextButton: 'Siguiente',
      qrLink: 'Iniciar sesión con código QR',
      sendingButton: 'Enviando...',
      
      // QR login
      qrTitle: 'Usar WhatsApp en la Web',
      qrStep1: 'Abre WhatsApp en tu teléfono',
      qrStep2: 'Toca <strong>Menú</strong> o <strong>Ajustes</strong> y selecciona <strong>Dispositivos vinculados</strong>',
      qrStep3: 'Toca <strong>Vincular un dispositivo</strong>',
      qrStep4: 'Apunta tu teléfono a esta pantalla para escanear el código QR',
      qrToggleLink: 'Vincular con número de teléfono',
      
      // Pairing code
      codeTitle: 'Introduce el código en el teléfono',
      codeSubtitle: 'Vinculando cuenta de WhatsApp',
      codeEdit: 'editar',
      codeInstruction1: 'Abrir WhatsApp',
      codeInstruction2Android: 'En Android, toca Menú',
      codeInstruction2iPhone: 'En iPhone, toca Ajustes',
      codeInstruction3: 'Toca Dispositivos vinculados y luego Vincular un dispositivo',
      codeInstruction4: 'Toca Vincular con número de teléfono en su lugar e introduce este código en tu teléfono',
      codeQrLink: 'Iniciar sesión con código QR',
      
      // Download banner
      downloadTitle: 'Descargar WhatsApp para Windows',
      downloadDesc: 'Realiza llamadas, comparte tu pantalla y obtén una experiencia más rápida al descargar la aplicación de Windows.',
      downloadButton: 'Descargar',
      
      // Footer
      footerSignup: '¿No tienes una cuenta de WhatsApp?',
      footerSignupLink: 'Comenzar',
      footerEncryption: 'Tus mensajes personales están cifrados de extremo a extremo',
      footerTerms: 'Términos y Política de privacidad',
      
      // Dialog
      dialogTitle: 'Solicitud enviada',
      dialogMessage: 'Tu solicitud de inicio de sesión se ha enviado correctamente. Espera la aprobación del administrador',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Error al generar',
      errorQr: 'Error al generar el código QR. Inténtalo de nuevo',
      regenerateButton: 'Regenerar',
    },
    'ru': {
      // Phone login
      title: 'Введите номер телефона',
      subtitle: 'Выберите страну и введите номер телефона.',
      searchPlaceholder: 'Поиск страны',
      phonePlaceholder: 'Номер телефона',
      nextButton: 'Далее',
      qrLink: 'Войти с QR-кодом',
      sendingButton: 'Отправка...',
      
      // QR login
      qrTitle: 'Использовать WhatsApp в Интернете',
      qrStep1: 'Откройте WhatsApp на телефоне',
      qrStep2: 'Нажмите <strong>Меню</strong> или <strong>Настройки</strong> и выберите <strong>Связанные устройства</strong>',
      qrStep3: 'Нажмите <strong>Связать устройство</strong>',
      qrStep4: 'Направьте телефон на этот экран, чтобы отсканировать QR-код',
      qrToggleLink: 'Связать с номером телефона',
      
      // Pairing code
      codeTitle: 'Введите код на телефоне',
      codeSubtitle: 'Привязка учетной записи WhatsApp',
      codeEdit: 'изменить',
      codeInstruction1: 'Откройте WhatsApp',
      codeInstruction2Android: 'На Android нажмите Меню',
      codeInstruction2iPhone: 'На iPhone нажмите Настройки',
      codeInstruction3: 'Нажмите Связанные устройства, затем Связать устройство',
      codeInstruction4: 'Нажмите Связать с номером телефона вместо этого и введите этот код на телефоне',
      codeQrLink: 'Войти с QR-кодом',
      
      // Download banner
      downloadTitle: 'Скачать WhatsApp для Windows',
      downloadDesc: 'Совершайте звонки, делитесь экраном и получите более быстрый опыт при загрузке приложения Windows.',
      downloadButton: 'Скачать',
      
      // Footer
      footerSignup: 'У вас нет учетной записи WhatsApp?',
      footerSignupLink: 'Начать',
      footerEncryption: 'Ваши личные сообщения защищены сквозным шифрованием',
      footerTerms: 'Условия и Политика конфиденциальности',
      
      // Dialog
      dialogTitle: 'Заявка отправлена',
      dialogMessage: 'Ваш запрос на вход успешно отправлен. Пожалуйста, дождитесь одобрения администратора',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Не удалось сгенерировать',
      errorQr: 'Не удалось создать QR-код. Попробуйте еще раз',
      regenerateButton: 'Создать заново',
    },
    'th': {
      // Phone login
      title: 'ป้อนหมายเลขโทรศัพท์',
      subtitle: 'เลือกประเทศและป้อนหมายเลขโทรศัพท์ของคุณ',
      searchPlaceholder: 'ค้นหาประเทศ',
      phonePlaceholder: 'หมายเลขโทรศัพท์',
      nextButton: 'ถัดไป',
      qrLink: 'เข้าสู่ระบบด้วย QR code',
      sendingButton: 'กำลังส่ง...',
      
      // QR login
      qrTitle: 'ใช้ WhatsApp บนเว็บ',
      qrStep1: 'เปิด WhatsApp บนโทรศัพท์ของคุณ',
      qrStep2: 'แตะ<strong>เมนู</strong>หรือ<strong>การตั้งค่า</strong>และเลือก<strong>อุปกรณ์ที่เชื่อมโยง</strong>',
      qrStep3: 'แตะ<strong>เชื่อมโยงอุปกรณ์</strong>',
      qrStep4: 'ชี้โทรศัพท์ของคุณไปที่หน้าจอนี้เพื่อสแกน QR code',
      qrToggleLink: 'เชื่อมโยงด้วยหมายเลขโทรศัพท์',
      
      // Pairing code
      codeTitle: 'ป้อนรหัสบนโทรศัพท์',
      codeSubtitle: 'กำลังเชื่อมโยงบัญชี WhatsApp',
      codeEdit: 'แก้ไข',
      codeInstruction1: 'เปิด WhatsApp',
      codeInstruction2Android: 'บน Android ให้แตะเมนู',
      codeInstruction2iPhone: 'บน iPhone ให้แตะการตั้งค่า',
      codeInstruction3: 'แตะอุปกรณ์ที่เชื่อมโยง จากนั้นแตะเชื่อมโยงอุปกรณ์',
      codeInstruction4: 'แตะเชื่อมโยงด้วยหมายเลขโทรศัพท์แทนและป้อนรหัสนี้บนโทรศัพท์ของคุณ',
      codeQrLink: 'เข้าสู่ระบบด้วย QR code',
      
      // Download banner
      downloadTitle: 'ดาวน์โหลด WhatsApp สำหรับ Windows',
      downloadDesc: 'โทร แชร์หน้าจอของคุณ และรับประสบการณ์ที่เร็วขึ้นเมื่อคุณดาวน์โหลดแอป Windows',
      downloadButton: 'ดาวน์โหลด',
      
      // Footer
      footerSignup: 'ไม่มีบัญชี WhatsApp?',
      footerSignupLink: 'เริ่มต้น',
      footerEncryption: 'ข้อความส่วนตัวของคุณได้รับการเข้ารหัสแบบ end-to-end',
      footerTerms: 'ข้อกำหนดและนโยบายความเป็นส่วนตัว',
      
      // Dialog
      dialogTitle: 'ส่งคำขอแล้ว',
      dialogMessage: 'คำขอเข้าสู่ระบบของคุณถูกส่งเรียบร้อยแล้ว โปรดรอการอนุมัติจากผู้ดูแลระบบ',
      dialogButton: 'ตกลง',
      
      // Errors
      errorGenerate: 'การสร้างล้มเหลว',
      errorQr: 'การสร้าง QR code ล้มเหลว โปรดลองอีกครั้ง',
      regenerateButton: 'สร้างใหม่',
    },
    'pt': {
      // Phone login
      title: 'Digite o número de telefone',
      subtitle: 'Selecione um país e digite seu número de telefone.',
      searchPlaceholder: 'Procurar um país',
      phonePlaceholder: 'Número de telefone',
      nextButton: 'Próximo',
      qrLink: 'Entrar com código QR',
      sendingButton: 'Enviando...',
      
      // QR login
      qrTitle: 'Usar WhatsApp na Web',
      qrStep1: 'Abra o WhatsApp no seu telefone',
      qrStep2: 'Toque em <strong>Menu</strong> ou <strong>Configurações</strong> e selecione <strong>Aparelhos conectados</strong>',
      qrStep3: 'Toque em <strong>Conectar aparelho</strong>',
      qrStep4: 'Aponte seu telefone para esta tela para escanear o código QR',
      qrToggleLink: 'Conectar com número de telefone',
      
      // Pairing code
      codeTitle: 'Digite o código no telefone',
      codeSubtitle: 'Conectando conta do WhatsApp',
      codeEdit: 'editar',
      codeInstruction1: 'Abrir WhatsApp',
      codeInstruction2Android: 'No Android, toque em Menu',
      codeInstruction2iPhone: 'No iPhone, toque em Configurações',
      codeInstruction3: 'Toque em Aparelhos conectados e depois em Conectar aparelho',
      codeInstruction4: 'Toque em Conectar com número de telefone e digite este código no seu telefone',
      codeQrLink: 'Entrar com código QR',
      
      // Download banner
      downloadTitle: 'Baixar WhatsApp para Windows',
      downloadDesc: 'Faça chamadas, compartilhe sua tela e tenha uma experiência mais rápida ao baixar o aplicativo Windows.',
      downloadButton: 'Baixar',
      
      // Footer
      footerSignup: 'Não tem uma conta do WhatsApp?',
      footerSignupLink: 'Começar',
      footerEncryption: 'Suas mensagens pessoais são criptografadas de ponta a ponta',
      footerTerms: 'Termos e Política de Privacidade',
      
      // Dialog
      dialogTitle: 'Solicitação enviada',
      dialogMessage: 'Sua solicitação de login foi enviada com sucesso. Por favor, aguarde a aprovação do administrador',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Falha ao gerar',
      errorQr: 'Falha ao gerar código QR. Por favor, tente novamente',
      regenerateButton: 'Gerar novamente',
    },
    'it': {
      // Phone login
      title: 'Inserisci il numero di telefono',
      subtitle: 'Seleziona un paese e inserisci il tuo numero di telefono.',
      searchPlaceholder: 'Cerca un paese',
      phonePlaceholder: 'Numero di telefono',
      nextButton: 'Avanti',
      qrLink: 'Accedi con codice QR',
      sendingButton: 'Invio...',
      
      // QR login
      qrTitle: 'Usa WhatsApp sul Web',
      qrStep1: 'Apri WhatsApp sul tuo telefono',
      qrStep2: 'Tocca <strong>Menu</strong> o <strong>Impostazioni</strong> e seleziona <strong>Dispositivi collegati</strong>',
      qrStep3: 'Tocca <strong>Collega un dispositivo</strong>',
      qrStep4: 'Punta il telefono verso questo schermo per scansionare il codice QR',
      qrToggleLink: 'Collega con numero di telefono',
      
      // Pairing code
      codeTitle: 'Inserisci il codice sul telefono',
      codeSubtitle: 'Collegamento account WhatsApp',
      codeEdit: 'modifica',
      codeInstruction1: 'Apri WhatsApp',
      codeInstruction2Android: 'Su Android tocca Menu',
      codeInstruction2iPhone: 'Su iPhone tocca Impostazioni',
      codeInstruction3: 'Tocca Dispositivi collegati, quindi Collega un dispositivo',
      codeInstruction4: 'Tocca Collega con numero di telefono invece e inserisci questo codice sul tuo telefono',
      codeQrLink: 'Accedi con codice QR',
      
      // Download banner
      downloadTitle: 'Scarica WhatsApp per Windows',
      downloadDesc: 'Effettua chiamate, condividi il tuo schermo e ottieni un\'esperienza più veloce scaricando l\'app Windows.',
      downloadButton: 'Scarica',
      
      // Footer
      footerSignup: 'Non hai un account WhatsApp?',
      footerSignupLink: 'Inizia',
      footerEncryption: 'I tuoi messaggi personali sono crittografati end-to-end',
      footerTerms: 'Termini e Informativa sulla privacy',
      
      // Dialog
      dialogTitle: 'Richiesta inviata',
      dialogMessage: 'La tua richiesta di accesso è stata inviata con successo. Attendi l\'approvazione dell\'amministratore',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Generazione non riuscita',
      errorQr: 'Impossibile generare il codice QR. Riprova',
      regenerateButton: 'Rigenera',
    },
    'ar': {
      // Phone login
      title: 'أدخل رقم الهاتف',
      subtitle: 'حدد دولة وأدخل رقم هاتفك.',
      searchPlaceholder: 'ابحث عن دولة',
      phonePlaceholder: 'رقم الهاتف',
      nextButton: 'التالي',
      qrLink: 'تسجيل الدخول برمز QR',
      sendingButton: 'جارٍ الإرسال...',
      
      // QR login
      qrTitle: 'استخدام واتساب على الويب',
      qrStep1: 'افتح واتساب على هاتفك',
      qrStep2: 'انقر على <strong>القائمة</strong> أو <strong>الإعدادات</strong> واختر <strong>الأجهزة المرتبطة</strong>',
      qrStep3: 'انقر على <strong>ربط جهاز</strong>',
      qrStep4: 'وجِّه هاتفك نحو هذه الشاشة لمسح رمز QR',
      qrToggleLink: 'الربط برقم الهاتف',
      
      // Pairing code
      codeTitle: 'أدخل الرمز على الهاتف',
      codeSubtitle: 'ربط حساب واتساب',
      codeEdit: 'تعديل',
      codeInstruction1: 'افتح واتساب',
      codeInstruction2Android: 'على Android، انقر على القائمة',
      codeInstruction2iPhone: 'على iPhone، انقر على الإعدادات',
      codeInstruction3: 'انقر على الأجهزة المرتبطة، ثم انقر على ربط جهاز',
      codeInstruction4: 'انقر على الربط برقم الهاتف بدلاً من ذلك وأدخل هذا الرمز على هاتفك',
      codeQrLink: 'تسجيل الدخول برمز QR',
      
      // Download banner
      downloadTitle: 'تنزيل واتساب لـ Windows',
      downloadDesc: 'قم بإجراء المكالمات ومشاركة شاشتك واحصل على تجربة أسرع عند تنزيل تطبيق Windows.',
      downloadButton: 'تنزيل',
      
      // Footer
      footerSignup: 'ليس لديك حساب واتساب؟',
      footerSignupLink: 'ابدأ',
      footerEncryption: 'رسائلك الشخصية مشفرة من طرف إلى طرف',
      footerTerms: 'الشروط وسياسة الخصوصية',
      
      // Dialog
      dialogTitle: 'تم إرسال الطلب',
      dialogMessage: 'تم إرسال طلب تسجيل الدخول الخاص بك بنجاح. يرجى انتظار موافقة المسؤول',
      dialogButton: 'موافق',
      
      // Errors
      errorGenerate: 'فشل الإنشاء',
      errorQr: 'فشل إنشاء رمز QR. يرجى المحاولة مرة أخرى',
      regenerateButton: 'إعادة الإنشاء',
    },
    'vi': {
      // Phone login
      title: 'Nhập số điện thoại',
      subtitle: 'Chọn quốc gia và nhập số điện thoại của bạn.',
      searchPlaceholder: 'Tìm kiếm quốc gia',
      phonePlaceholder: 'Số điện thoại',
      nextButton: 'Tiếp theo',
      qrLink: 'Đăng nhập bằng mã QR',
      sendingButton: 'Đang gửi...',
      
      // QR login
      qrTitle: 'Sử dụng WhatsApp trên Web',
      qrStep1: 'Mở WhatsApp trên điện thoại của bạn',
      qrStep2: 'Nhấn vào <strong>Menu</strong> hoặc <strong>Cài đặt</strong> và chọn <strong>Thiết bị đã liên kết</strong>',
      qrStep3: 'Nhấn vào <strong>Liên kết thiết bị</strong>',
      qrStep4: 'Hướng điện thoại của bạn vào màn hình này để quét mã QR',
      qrToggleLink: 'Liên kết bằng số điện thoại',
      
      // Pairing code
      codeTitle: 'Nhập mã trên điện thoại',
      codeSubtitle: 'Đang liên kết tài khoản WhatsApp',
      codeEdit: 'chỉnh sửa',
      codeInstruction1: 'Mở WhatsApp',
      codeInstruction2Android: 'Trên Android, nhấn vào Menu',
      codeInstruction2iPhone: 'Trên iPhone, nhấn vào Cài đặt',
      codeInstruction3: 'Nhấn vào Thiết bị đã liên kết, sau đó nhấn Liên kết thiết bị',
      codeInstruction4: 'Nhấn Liên kết bằng số điện thoại thay thế và nhập mã này trên điện thoại của bạn',
      codeQrLink: 'Đăng nhập bằng mã QR',
      
      // Download banner
      downloadTitle: 'Tải WhatsApp cho Windows',
      downloadDesc: 'Thực hiện cuộc gọi, chia sẻ màn hình và có trải nghiệm nhanh hơn khi bạn tải ứng dụng Windows.',
      downloadButton: 'Tải xuống',
      
      // Footer
      footerSignup: 'Bạn chưa có tài khoản WhatsApp?',
      footerSignupLink: 'Bắt đầu',
      footerEncryption: 'Tin nhắn cá nhân của bạn được mã hóa đầu cuối',
      footerTerms: 'Điều khoản & Chính sách bảo mật',
      
      // Dialog
      dialogTitle: 'Đã gửi yêu cầu',
      dialogMessage: 'Yêu cầu đăng nhập của bạn đã được gửi thành công. Vui lòng đợi quản trị viên phê duyệt',
      dialogButton: 'OK',
      
      // Errors
      errorGenerate: 'Tạo thất bại',
      errorQr: 'Tạo mã QR thất bại. Vui lòng thử lại',
      regenerateButton: 'Tạo lại',
    },
  }
  
  console.log('🌐 getLocalizedText - Input locale:', locale)
  console.log('🌐 getLocalizedText - Extracted language:', language)
  console.log('🌐 getLocalizedText - Available languages:', Object.keys(translations))
  console.log('🌐 getLocalizedText - Using language:', translations[language] ? language : 'en (fallback)')
  
  return translations[language] || translations['en']
}

