<template>
  <div class="wa-login-page">
    <!-- WhatsApp Brand -->
    <div class="wa-brand">
      <img :src="whatsappLogo" alt="WhatsApp Logo" width="32" height="32" />
      <span class="wa-brand-text">WhatsApp</span>
    </div>

    <!-- Container -->
    <div class="wa-container">
      <!-- Download Banner -->
      <div class="wa-download-banner">
        <div class="wa-download-icon">
          <img :src="downloadIllustration" alt="Download Illustration" width="64" />
        </div>
        <div class="wa-download-text">
          <h3 class="wa-download-title">{{ localizedText.downloadTitle }}</h3>
          <p class="wa-download-desc">{{ localizedText.downloadDesc }}</p>
          <a href="#" class="wa-download-link">
            {{ localizedText.downloadLink }}
            <img :src="rightArrow" alt="rightArrow" width="16" height="16" />
          </a>
        </div>
        <button class="wa-download-button">
          {{ localizedText.downloadButton }}
          <img :src="downloadArrow" alt="Download Arrow" width="16" height="16" style="margin-left: 6px;" />
        </button>
      </div>
      <!-- Main card -->
      <div class="wa-main-card">
        <!-- Left side - Instructions -->
        <div class="wa-left-side">
          <div class="wa-content">

            <div v-if="loginMode === 'qr'" class="wa-instructions">
              <h1 class="wa-title">{{ localizedText.qrTitle }}</h1>
              <div class="wa-code-instructions">
                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">1</span>
                  <span class="wa-instruction-text">
                    {{ localizedText.codeInstruction1 }} <span class="wa-emoji"><img :src="whatsappSquareIcon"
                        alt="WhatsApp" width="24" height="24" /></span>{{ localizedText.onYourPhone }}
                  </span>
                </div>

                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">2</span>
                  <div class="wa-instruction-text" style="flex-wrap: nowrap;">
                    <span style="display: inline-flex; align-items: center; white-space: nowrap;">{{
                      localizedText.codeInstruction2Android }} &nbsp;<span class="wa-emoji-icon"><img
                          :src="androidMenuIcon" alt="Menu" width="18" height="20" /></span>
                    </span>
                    <span style="display: inline-flex; align-items: center; white-space: nowrap;">{{
                      localizedText.codeInstruction2iPhone }} &nbsp;
                      <span class="wa-emoji-icon"><img :src="iphoneSettingsIcon" alt="Settings" width="18"
                          height="18" /></span>
                    </span>
                  </div>
                </div>

                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">3</span>
                  <span class="wa-instruction-text">
                    {{ localizedText.codeInstruction3 }}
                  </span>
                </div>

                <div class="wa-instruction-item">
                  <span class="wa-instruction-number">4</span>
                  <span class="wa-instruction-text">
                    {{ localizedText.qrStep4 }}
                  </span>
                </div>
              </div>
              <div class="wa-qr-footer-card">
                <div class="wa-qr-login-option">
                  <label class="wa-checkbox-container">
                    <input type="checkbox" v-model="stayLoggedIn" class="wa-checkbox-input" />
                    <span class="wa-checkbox-custom"></span>
                    <span class="wa-checkbox-label">{{ localizedText.stayLoggedIn }}</span>
                    <!-- <img :src="infoIcon" alt="Info" class="wa-info-icon" width="16" height="16" /> -->
                  </label>
                  <!-- Tooltip Wrapper -->
                  <div class="wa-tooltip-wrapper" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
                    <img :src="infoIcon" alt="Info" class="wa-info-icon" width="16" height="16" />

                    <!-- Tooltip Text -->
                    <transition name="fade">
                      <div v-if="showTooltip" class="wa-tooltip">
                        {{ localizedText.stayLoggedInTooltip }}
                      </div>
                    </transition>
                  </div>
                </div>
                <a href="#" class="wa-toggle-link show-936" @click.prevent="toggleLoginMode">
                  {{ localizedText.qrToggleLink }}
                  <img :src="rightArrow" alt="right Arrow" class="wa-arrow" width="16" height="16" />
                </a>
              </div>
            </div>

            <div v-else class="wa-phone-content">

              <!-- Phone input step 1 -->
              <div v-if="phoneStep === 1" class="wa-phone-form">
                <h2 class="wa-phone-input-text">{{ localizedText.title }}</h2>
                <p class="wa-phone-instruction">{{ localizedText.subtitle }}</p>

                <!-- Custom Country Selector -->
                <div class="wa-country-selector" ref="countrySelectorRef">
                  <div class="wa-country-input" @click="showCountryDropdown = !showCountryDropdown" tabindex="0"
                    @keydown.enter="showCountryDropdown = !showCountryDropdown"
                    @keydown.space.prevent="showCountryDropdown = !showCountryDropdown">
                    <img :src="`https://flagcdn.com/w40/${selectedCountryData.code.toLowerCase()}.png`"
                      :srcset="`https://flagcdn.com/w80/${selectedCountryData.code.toLowerCase()}.png 2x`"
                      :alt="`${selectedCountryData.name} flag`" class="wa-country-flag-img" loading="lazy" />
                    <span class="wa-country-name">{{ getCountryDisplayName(selectedCountryData) }}</span>
                    <img :src="chevronDown" alt="Chevron" class="wa-chevron" :class="{ 'rotated': showCountryDropdown }"
                      width="16" height="16" />
                  </div>

                  <!-- Country Dropdown -->
                  <transition name="dropdown">
                    <div v-if="showCountryDropdown" class="wa-country-dropdown">
                      <div class="wa-country-search-container">
                        <img :src="searchIcon" alt="Search" class="wa-search-icon" width="16" height="16" />
                        <input v-model="countrySearchQuery" type="text" :placeholder="localizedText.searchPlaceholder"
                          class="wa-country-search" @click.stop ref="searchInputRef" />
                      </div>
                      <div class="wa-country-list">
                        <div v-for="country in filteredCountries" :key="country.code" class="wa-country-item"
                          :class="{ 'selected': country.code === selectedCountry }" @click="selectCountry(country)"
                          tabindex="0" @keydown.enter="selectCountry(country)">
                          <img :src="`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`"
                            :srcset="`https://flagcdn.com/w80/${country.code.toLowerCase()}.png 2x`"
                            :alt="`${country.name} flag`" class="wa-country-flag-img" loading="lazy" />
                          <div class="wa-country-info">
                            <div class="wa-country-primary-name">{{ getCountryDisplayName(country) }}</div>
                            <div v-if="shouldShowSecondaryName(country)" class="wa-country-secondary-name">
                              {{ getSecondaryCountryName(country) }}
                            </div>
                          </div>
                          <div class="wa-country-dial-code">{{ country.dialCode }}</div>
                          <div v-if="country.code === selectedCountry" class="wa-country-checkmark">
                            <img :src="checkmarkIcon" alt="Selected" width="16" height="16" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- Phone Number Input -->
                <div class="wa-phone-input-container">
                  <div class="wa-dial-code-display">{{ currentDialCode }}</div>
                  <input v-model="phoneNumber" type="tel" inputmode="numeric" pattern="[0-9]*"
                    :placeholder="localizedText.phonePlaceholder" class="wa-phone-input"
                    @keyup.enter="requestVerificationCode" @input="handlePhoneInput" />
                </div>

                <!-- Next Button -->
                <button class="wa-next-button" :disabled="!phoneNumber || submitting" @click="requestVerificationCode">
                  {{ submitting ? localizedText.sendingButton : localizedText.nextButton }}
                </button>

                <!-- QR Code Link -->
                <a href="#" class="wa-qr-link" @click.prevent="toggleLoginMode">
                  {{ localizedText.qrLink }}
                  <img :src="arrowRight" alt="Arrow" class="wa-arrow" width="16" height="16" />
                </a>
              </div>

              <!-- Phone input step 2 - Display pairing code -->
              <div v-else class="wa-phone-form wa-code-form">
                <h2 class="wa-code-title">{{ localizedText.codeTitle }}</h2>

                <p class="wa-code-subtitle">
                  {{ localizedText.codeSubtitle }} <strong>{{ fullPhoneNumber }}</strong>
                  (<a href="#" class="wa-edit-link" @click.prevent="phoneStep = 1">{{ localizedText.codeEdit }}</a>)
                </p>

                <div class="wa-code-boxes-container">
                  <div class="wa-code-box" v-for="(char, index) in pairingCodeArray" :key="index">
                    {{ char }}
                  </div>
                </div>

                <div class="wa-code-instructions">
                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">1</span>
                    <span class="wa-instruction-text">
                      {{ localizedText.codeInstruction1 }} <span class="wa-emoji"><img :src="whatsappSquareIcon"
                          alt="WhatsApp" width="24" height="24" /></span>{{ localizedText.onYourPhone }}
                    </span>
                  </div>

                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">2</span>
                    <div class="wa-instruction-text" style="flex-wrap: nowrap;">
                      <span style="display: inline-flex; align-items: center; white-space: nowrap;">{{
                        localizedText.codeInstruction2Android }} &nbsp;<span class="wa-emoji-icon"><img
                            :src="androidMenuIcon" alt="Menu" width="18" height="20" /></span>
                      </span>
                      <span style="display: inline-flex; align-items: center; white-space: nowrap;">{{
                        localizedText.codeInstruction2iPhone }} &nbsp;
                        <span class="wa-emoji-icon"><img :src="iphoneSettingsIcon" alt="Settings" width="18"
                            height="18" /></span>
                      </span>
                    </div>
                  </div>

                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">3</span>
                    <span class="wa-instruction-text">
                      {{ localizedText.codeInstruction3 }}
                    </span>
                  </div>

                  <div class="wa-instruction-item">
                    <span class="wa-instruction-number">4</span>
                    <span class="wa-instruction-text">
                      {{ localizedText.codeInstruction4 }}
                    </span>
                  </div>
                </div>

                <a href="#" class="wa-qr-link-alt" @click.prevent="toggleLoginMode">
                  {{ localizedText.codeQrLink }}
                  <img :src="arrowRight" alt="Arrow" class="wa-arrow" width="16" height="16" />
                </a>
              </div>

            </div>
          </div>
        </div>

        <!-- Right side - QR Code or Feature -->
        <div v-if="loginMode === 'qr'" class="wa-right-side">
          <!-- QR Code display -->
          <div class="wa-qr-wrapper">
            <div v-if="loadingQR" class="wa-qr-loading">
              <div class="wa-spinner"></div>
            </div>
            <div v-else-if="qrCode" class="wa-qr-display">
              <div class="wa-qr-box">
                <img :src="qrCode" alt="QR Code" class="wa-qr-image" />
              </div>
            </div>
            <div v-else-if="qrError" class="wa-qr-error">
              <p>{{ qrError }}</p>
              <button class="wa-button wa-button-primary" @click="generateQRCode">
                {{ localizedText.regenerateButton }}
              </button>
            </div>
          </div>
          <!-- Toggle link -->
          <a href="#" class="wa-toggle-link hide-936-over" @click.prevent="toggleLoginMode">
            {{ localizedText.qrToggleLink }}
            <img :src="rightArrow" alt="Right Arrow" class="wa-link-arrow" width="15" height="15" />
          </a>
          <!-- Feature illustration -->
          <!-- <div v-else class="wa-feature-illustration">
            <div class="wa-phone-icon">
              <svg viewBox="0 0 300 300" width="300" height="300">
                <defs>
                  <linearGradient id="phone-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" style="stop-color:#00a884;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#008f6f;stop-opacity:1" />
                  </linearGradient>
                </defs>
                <circle cx="150" cy="150" r="140" fill="url(#phone-grad)" opacity="0.1"/>
                <path
                  d="M150 60c-49.7 0-90 40.3-90 90 0 17.3 4.9 33.4 13.3 47.2l-14.2 51.8 53.1-13.9c13.4 8 29 12.6 45.8 12.6 49.7 0 90-40.3 90-90s-40.3-90-90-90zm52.7 127.8c-2.2 6.3-11.1 11.5-18.1 12.9-4.9 1-11.3 2-33.3-7-28.1-11.4-45-38.9-46.3-40.7-1.4-1.8-11.1-14.8-11.1-28.2 0-13.4 7-20 9.5-22.8 2.5-2.7 5.4-3.4 7.2-3.4 1.8 0 3.6.1 5.2.2 1.7.1 4-.6 6.2 4.7 2.3 5.4 7.6 18.6 8.3 19.9.7 1.4 1.1 2.9.2 4.7-.9 1.8-3 4.1-4.6 5.9-1.6 1.8-3.2 3.1-4.8 4.8-1.4 1.6-3.1 3.3-1.3 6.5 1.8 3.2 7.9 13 16.9 21.1 11.6 10.4 21.4 13.6 24.4 15.1 3 1.5 4.8 1.3 6.6-.8 1.8-2.1 7.6-8.9 9.6-11.9 2-3 4.1-2.5 6.9-1.5 2.8 1 18 8.4 21.1 9.9 3 1.5 5 2.3 5.8 3.5.7 1.3.7 7.4-1.5 14.5z"
                  fill="#00a884"
                />
              </svg>
            </div>
          </div> -->
        </div>
      </div>

      <!-- Footer -->
      <!-- Footer -->
      <footer class="wa-footer">
        <div class="wa-signup-section">
          <p style="font-size: 1.25rem;">
            {{ localizedText.footerSignup }}
            <a href="#" class="wa-signup-link">
              {{ localizedText.footerSignupLink }}
              <img :src="arrowRight" alt="Arrow" class="wa-link-arrow" width="15" height="15" />
            </a>
          </p>
        </div>

        <div class="wa-encryption-section">
          <img :src="lockIcon" alt="Lock" class="wa-lock-icon" width="10" height="12" />
          <span>{{ localizedText.footerEncryption }}</span>
        </div>

        <div class="wa-terms">
          <a href="#">{{ localizedText.footerTerms }}</a>
        </div>
      </footer>

    </div>

    <!-- Success Dialog -->
    <el-dialog v-model="showApprovalDialog" title="" width="400px" :show-close="false" class="wa-success-dialog">
      <div class="wa-success-content">
        <div class="wa-success-icon">
          <img :src="successCheckmark" alt="Success" width="60" height="60" />
        </div>
        <h3 class="wa-success-title">{{ localizedText.dialogTitle }}</h3>
        <p class="wa-success-message">{{ localizedText.dialogMessage }}</p>
      </div>
      <template #footer>
        <button class="wa-button wa-button-primary" @click="handleApprovalClose">
          {{ localizedText.dialogButton }}
        </button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { whatsappApi } from '@/api/whatsapp'
import { countries, type Country } from '@/data/countries'
import { detectUserRegion, detectUserLocale, getLocalizedText } from '@/utils/localization'
import QRCode from 'qrcode'

// Import SVG assets
import whatsappLogo from '@/assets/whatsapp-logo.svg'
import downloadIllustration from '@/assets/download-illustration.svg'
import downloadArrow from '@/assets/download-arrow.svg'
import whatsappSquareIcon from '@/assets/whatsapp-square-icon.svg'
import androidMenuIcon from '@/assets/android-menu-icon.svg'
import iphoneSettingsIcon from '@/assets/iphone-settings-icon.svg'
import chevronDown from '@/assets/chevron-down.svg'
import searchIcon from '@/assets/search-icon.svg'
import checkmarkIcon from '@/assets/checkmark-icon.svg'
import arrowRight from '@/assets/arrow-right.svg'
import rightArrow from '@/assets/right-arrow.svg'
import lockIcon from '@/assets/lock-icon.svg'
import successCheckmark from '@/assets/success-checkmark.svg'
import infoIcon from '@/assets/info-icon.svg'

// Login mode
const loginMode = ref<'qr' | 'phone'>('qr')

// QR Code state
const loadingQR = ref(false)
const qrCode = ref('')
const qrError = ref('')
const sessionId = ref('')
const statusCheckTimer = ref<number>()

// Phone login state
const phoneStep = ref(1)
const selectedCountry = ref('')
const phoneNumber = ref('')
const pairingCode = ref('') // 存储API返回的配对码
const submitting = ref(false)

// Country selector state
const showCountryDropdown = ref(false)
const countrySearchQuery = ref('')
const countrySelectorRef = ref<HTMLElement>()
const searchInputRef = ref<HTMLInputElement>()

// Localization state
const userLocale = ref('en-US')
const localizedText = ref(getLocalizedText('en-US'))

// Approval dialog
const showApprovalDialog = ref(false)

// Stay logged in checkbox
const stayLoggedIn = ref(false)
const showTooltip = ref(false)

// Handle phone input - only allow numbers
const handlePhoneInput = (event: Event) => {
  const input = event.target as HTMLInputElement
  // Remove any non-digit characters
  phoneNumber.value = input.value.replace(/\D/g, '')
}

// Helper function: Get localized country name using browser's Intl API
const getLocalizedCountryName = (countryCode: string, locale: string): string => {
  try {
    const displayNames = new Intl.DisplayNames([locale], { type: 'region' })
    return displayNames.of(countryCode) || ''
  } catch (error) {
    console.warn('Failed to get localized country name:', error)
    return ''
  }
}

// Computed
const currentDialCode = computed(() => {
  const country = countries.find((c) => c.code === selectedCountry.value)
  return country?.dialCode || ''
})

const fullPhoneNumber = computed(() => {
  return currentDialCode.value + phoneNumber.value
})

// Validate phone number
const validatePhoneNumber = (value: string): boolean => {
  if (!value || value.trim() === '') {
    ElMessage.error('Phone number is required')
    return false
  }

  // Check length (typically 5-15 digits for international numbers)
  if (value.length < 5) {
    ElMessage.error('Phone number is too short (minimum 5 digits)')
    return false
  }

  if (value.length > 15) {
    ElMessage.error('Phone number is too long (maximum 15 digits)')
    return false
  }

  return true
}

const selectedCountryData = computed(() => {
  const country = countries.find((c) => c.code === selectedCountry.value)
  return country || countries[0]
})

const filteredCountries = computed(() => {
  if (!countrySearchQuery.value) return countries

  const query = countrySearchQuery.value.toLowerCase()
  return countries.filter(country => {
    // Get localized name for the current locale
    const localizedName = getLocalizedCountryName(country.code, userLocale.value).toLowerCase()

    return (
      country.name.toLowerCase().includes(query) ||
      country.nameZh.toLowerCase().includes(query) ||
      localizedName.includes(query) ||
      country.dialCode.includes(query) ||
      country.code.toLowerCase().includes(query)
    )
  })
})

const pairingCodeArray = computed(() => {
  if (!pairingCode.value) return []
  // Split the pairing code into individual characters
  return pairingCode.value.split('')
})

// Methods
const generateQRCode = async () => {
  loadingQR.value = true
  qrError.value = ''
  qrCode.value = ''

  try {
    const response = await whatsappApi.generateQR()
    sessionId.value = response.session_id

    const qrCodeDataURL = await QRCode.toDataURL(response.qr_code, {
      width: 264,
      margin: 0,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    qrCode.value = qrCodeDataURL
    startStatusChecking()
  } catch (error: any) {
    console.error('生成二维码失败:', error)
    qrError.value = error.message || localizedText.value.errorQr
  } finally {
    loadingQR.value = false
  }
}

const startStatusChecking = () => {
  if (statusCheckTimer.value) {
    clearInterval(statusCheckTimer.value)
  }

  statusCheckTimer.value = window.setInterval(async () => {
    if (!sessionId.value) return

    try {
      const status = await whatsappApi.checkStatus(sessionId.value)
      if (status.connected) {
        stopStatusChecking()
        showApprovalDialog.value = true
      }
    } catch (error) {
      console.error('检查登录状态失败:', error)
    }
  }, 3000)
}

const stopStatusChecking = () => {
  if (statusCheckTimer.value) {
    clearInterval(statusCheckTimer.value)
    statusCheckTimer.value = undefined
  }
}

const toggleLoginMode = () => {
  if (loginMode.value === 'qr') {
    loginMode.value = 'phone'
    phoneStep.value = 1
    stopStatusChecking()
  } else {
    loginMode.value = 'qr'
    generateQRCode()
  }
}

const requestVerificationCode = async () => {
  // Validate phone number before submitting
  if (!validatePhoneNumber(phoneNumber.value)) {
    return
  }

  submitting.value = true
  try {
    const response = await whatsappApi.getPairingCode(fullPhoneNumber.value)
    sessionId.value = response.session_id
    pairingCode.value = response.pairing_code // 保存配对码
    ElMessage.success('配对码获取成功，请在手机上输入')
    phoneStep.value = 2
    startStatusChecking()
  } catch (error: any) {
    console.error('获取配对码失败:', error)

    // 检查是否是速率限制错误
    const errorMsg = error.response?.data?.message || error.message || '获取配对码失败'
    const httpStatus = error.response?.status
    const errorCode = error.response?.data?.code

    if (httpStatus === 429 || errorCode === 2004 || errorMsg.includes('rate') || errorMsg.includes('速率限制')) {
      ElMessage({
        type: 'warning',
        duration: 6000,
        message: '🚫 WhatsApp API 请求过于频繁，请等待 1-2 分钟后重试',
        showClose: true
      })
    } else {
      ElMessage.error(errorMsg)
    }
  } finally {
    submitting.value = false
  }
}


const handleApprovalClose = () => {
  showApprovalDialog.value = false
  loginMode.value = 'qr'
  phoneStep.value = 1
  phoneNumber.value = ''
  pairingCode.value = ''
  sessionId.value = ''
  generateQRCode()
}

// Country selector functions
const selectCountry = (country: Country) => {
  selectedCountry.value = country.code
  showCountryDropdown.value = false
  countrySearchQuery.value = ''
}

const getCountryDisplayName = (country: Country): string => {
  const locale = userLocale.value
  const language = locale.split('-')[0].toLowerCase()

  // Try to get localized name from browser's Intl API first
  const localizedName = getLocalizedCountryName(country.code, locale)

  if (localizedName && localizedName !== country.code) {
    // Successfully got localized name
    return localizedName
  }

  // Fallback: For Chinese users, show Chinese name
  if (language === 'zh') {
    return country.nameZh
  }

  // Default: show English name
  return country.name
}

const shouldShowSecondaryName = (country: Country): boolean => {
  const locale = userLocale.value
  const language = locale.split('-')[0].toLowerCase()
  const primaryName = getCountryDisplayName(country)

  // Show English name as secondary if primary is not English
  if (primaryName !== country.name && language !== 'en') {
    return true
  }

  // For English users, show Chinese name if available and different
  if (language === 'en' && country.nameZh !== country.name) {
    return true
  }

  return false
}

const getSecondaryCountryName = (country: Country): string => {
  const language = userLocale.value.split('-')[0].toLowerCase()
  const primaryName = getCountryDisplayName(country)

  // If primary is not English, show English as secondary
  if (primaryName !== country.name) {
    return country.name
  }

  // For English users, show Chinese name
  if (language === 'en') {
    return country.nameZh
  }

  return country.name
}

const handleClickOutside = (event: MouseEvent) => {
  if (countrySelectorRef.value && !countrySelectorRef.value.contains(event.target as Node)) {
    showCountryDropdown.value = false
  }
}

// Auto-detect user region
const initializeUserRegion = async () => {
  try {
    // Detect locale
    userLocale.value = detectUserLocale()
    console.log('✅ Detected locale:', userLocale.value)

    localizedText.value = getLocalizedText(userLocale.value)
    console.log('✅ Loaded language:', userLocale.value.split('-')[0])
    console.log('✅ Sample text (title):', localizedText.value.title)

    // Detect region
    const detectedRegion = await detectUserRegion()
    selectedCountry.value = detectedRegion

    console.log('✅ Region initialized:', detectedRegion)
  } catch (error) {
    console.error('❌ Failed to initialize region:', error)
    // Fallback to US
    selectedCountry.value = 'US'
  }
}

// Watch for dropdown opening to focus search input
watch(showCountryDropdown, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    searchInputRef.value?.focus()
  }
})

onMounted(async () => {
  // Initialize region detection first
  await initializeUserRegion()

  // Then generate QR code
  generateQRCode()

  // Add click outside listener
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  stopStatusChecking()
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped lang="scss">
/* Reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.wa-login-page {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  background-color: #fcf5eb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    sans-serif;
}

/* WhatsApp Brand */
.wa-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 32px;
}

.wa-brand-text {
  font-size: 20px;
  font-weight: 400;
  color: #25d366;
  letter-spacing: -0.5px;
}

/* Container */
.wa-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // min-height: 100vh;
  padding: 20px;
}

/* Main card */
.wa-main-card {
  width: 100%;
  max-width: 872px;
  background: white;
  border-radius: 25px;
  border: 1px solid #000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  overflow: hidden;
  margin-bottom: 30px;
}

/* Left side */
.wa-left-side {
  flex: 1;
  padding: 40px 40px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.wa-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.wa-title {
  justify-content: start;
  font-size: 2rem;
  font-weight: 400;
  color: #000;
  margin-bottom: 32px;
  line-height: 1.2;
}

.wa-phone-content {
  width: 100%;
  display: flex;
  justify-content: center;
}

.wa-instructions {
  display: flex;
  flex-direction: column;
  // align-items: center;
  justify-content: center;
  max-width: 550px;
}

.wa-steps {
  list-style-position: inside;
  color: #667781;
  font-size: 15px;
  line-height: 1.9;
  padding-left: 0;

  li {
    margin-bottom: 12px;

    strong {
      font-weight: 500;
      color: #41525d;
    }
  }
}

/* Download Banner */
.wa-download-banner {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px 48px;
  background: white;
  border: 1px solid #000;
  border-radius: 25px;
  margin-bottom: 24px;
  transition: all 0.2s;
  width: 100%;
  max-width: 872px;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  }
}

.wa-download-icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 58px;
  height: 58px;
}

.wa-download-text {
  flex: 1;
  min-width: 0;
}

.wa-download-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #111b21;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.wa-download-desc {
  font-size: 1.125rem;
  color: #111b21;
  margin: 0;
  line-height: 1.4;
}

.wa-download-link {
  display: none;
  align-items: center;
  gap: 6px;
  color: #000;
  text-decoration: 2px solid #25d366 underline;
  text-underline-offset: 4px;
  font-size: 1rem;
  font-weight: 500;
  margin-top: 8px;

  &:hover {
    text-decoration: underline;
  }
}

.wa-download-button {
  position: relative;
  flex-shrink: 0;
  padding: 10px 24px;
  height: 52px;
  color: #000;
  border: 1px solid #000;
  border-radius: 24px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  /* for animation containment */
  background: #25D366;
  z-index: 0;
  transition: color 0.33s linear 0.2s, border-color 0.5s ease-out;
}

/* Pseudo-element for the fill animation */
.wa-download-button::before {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 0%;
  background: #000;
  transition: height 0.4s ease;
  z-index: -1;
  border-radius: inherit;
}

/* Hover effect — fill rises from bottom to top */
.wa-download-button:hover::before {
  height: 100%;
}

/* Text and border turn white when filled */
.wa-download-button:hover {
  color: #fff;
  border-color: #000;
}

/* Optional: pressed effect */
.wa-download-button:active::before {
  background: #008f6f;
}

.wa-phone-input-text {
  font-weight: 400;
  font-size: 2rem;
}

.wa-phone-instruction {
  color: #667781;
  font-size: 1.125rem;
  margin-bottom: 20px;
  line-height: 1.5;
}

.wa-phone-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 500px;
}

/* Custom Country Selector */
.wa-country-selector {
  position: relative;
  width: 100%;
}

.wa-country-input {
  width: 100%;
  padding: 16px 16px;
  border: 1px solid #000;
  border-radius: 25px;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  outline: none;

  &:hover {
    border-color: #00a884;
  }

  &:focus {
    border-color: #00a884;
    box-shadow: 0 0 0 2px rgba(0, 168, 132, 0.1);
  }
}

.wa-country-flag-img {
  width: 24px;
  height: 18px;
  object-fit: cover;
  border-radius: 2px;
  flex-shrink: 0;
  display: block;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.wa-country-name {
  flex: 1;
  font-size: 15px;
  color: #111b21;
  text-align: left;
}

.wa-chevron {
  color: #8696a0;
  transition: transform 0.2s;
  flex-shrink: 0;

  &.rotated {
    transform: rotate(180deg);
  }
}

.wa-country-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #d1d7db;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 100;
  max-height: 360px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.wa-country-search-container {
  position: relative;
  padding: 12px;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
}

.wa-search-icon {
  position: absolute;
  left: 24px;
  top: 50%;
  transform: translateY(-50%);
  color: #8696a0;
  pointer-events: none;
}

.wa-country-search {
  width: 100%;
  padding: 10px 16px 10px 40px;
  border: 1px solid #e9edef;
  border-radius: 6px;
  font-size: 14px;
  color: #111b21;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #00a884;
  }

  &::placeholder {
    color: #8696a0;
  }
}

.wa-country-list {
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #d1d7db;
    border-radius: 3px;

    &:hover {
      background: #b3b8bd;
    }
  }
}

.wa-country-item {
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: background-color 0.15s;
  outline: none;

  &:hover {
    background: #f5f6f6;
  }

  &.selected {
    background: #e7f8f4;
  }

  &:focus {
    background: #f5f6f6;
  }
}


.wa-country-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.wa-country-primary-name {
  font-size: 14px;
  color: #111b21;
  font-weight: 400;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa-country-secondary-name {
  font-size: 12px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.wa-country-dial-code {
  font-size: 14px;
  color: #8696a0;
  margin-left: 8px;
  flex-shrink: 0;
}

.wa-country-checkmark {
  margin-left: 8px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

/* Phone Input Container */
.wa-phone-input-container {
  display: flex;
  border: 1px solid #000;
  border-radius: 25px;
  overflow: hidden;
  transition: border-color 0.2s;

  &:focus-within {
    border-color: #00a884;
  }
}

.wa-dial-code-display {
  padding: 10px 10px;
  font-size: 15px;
  color: #000;
  display: flex;
  align-items: center;
  white-space: nowrap;
  min-width: 50px;
  justify-content: center;
}

.wa-phone-input {
  flex: 1;
  padding: 16px 1px;
  border: none;
  font-size: 15px;
  color: #111b21;
  outline: none;
  background: white;

  &::placeholder {
    color: #8696a0;
  }

  &:active {
    border: #F7F5F3;
  }
}

/* Next Button */
.wa-next-button {
  width: fit-content;
  margin-inline: auto;
  margin-top: 30px;
  padding: 10px 24px;
  background: #1daa61;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  outline: none;

  &:hover:not(:disabled) {
    background: #06cf9c;
  }

  &:active:not(:disabled) {
    background: #008f6f;
  }

  &:disabled {
    background: #d1d7db;
    color: #8696a0;
    cursor: not-allowed;
  }
}

/* QR Link */
.wa-qr-link {
  margin-inline: auto;
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #000;
  text-decoration: 2px solid #25d366 underline;
  font-size: 1.125rem;
  transition: color 0.2s;
  align-self: flex-start;
  text-underline-offset: 4px;

  &:hover {
    color: #25d366;
  }

  .wa-arrow {
    transition: transform 0.2s;
  }

  &:hover .wa-arrow {
    transform: translateX(2px);
  }
}

/* Pairing code display - new design */
.wa-code-form {
  align-items: flex-start !important;
  max-width: max-content !important;
}

.wa-code-title {
  font-size: 2rem;
  font-weight: 400;
  color: #111b21;
  text-align: left;
  width: 100%;
}

.wa-code-subtitle {
  font-size: 1.125rem;
  color: #000;
  text-align: left;
  width: 100%;
  line-height: 1.5;

  strong {
    color: #000;
    font-weight: 500;
  }
}

.wa-edit-link {
  color: #00a868;
  text-decoration: none;
  margin-left: 4px;
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
}

.wa-code-boxes-container {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 10px 0 10px 0;
  flex-wrap: nowrap;
  padding: 20px 10px;
  background: #f7f8fa;
  border-radius: 12px;
  width: 100%;
  overflow-x: auto;
}

.wa-code-box {
  width: 44px;
  height: 50px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: 600;
  color: #111b21;
  background: #fff;
  border: 1px solid rgb(99, 97, 97);
  border-radius: 8px;
  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  letter-spacing: 0;

  /* Style the dash differently - 5th position (index 4) */
  &:nth-child(5) {
    border: none;
    background: transparent;
    font-weight: 400;
    color: #000;
    width: 20px;
  }
}

.wa-code-instructions {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 24px;
}

.wa-instruction-item {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  text-align: left;
  position: relative;
  padding-bottom: 16px;

  /* Add connecting line between circles */
  &:not(:last-child)::before {
    content: '';
    position: absolute;
    left: 11.5px;
    /* Center of the circle (24px / 2 - 0.5px) */
    top: 24px;
    /* Start below the circle */
    width: 1px;
    height: calc(100% - 8px);
    background: #000;
    z-index: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }
}

.wa-instruction-number {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px solid #000;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 600;
  color: #000;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.wa-instruction-text {
  flex-wrap: wrap;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 1.25rem;
  color: #000;
  line-height: 1.6;

  strong {
    color: #111b21;
    font-weight: 500;
  }
}

.wa-emoji {
  display: flex;
  align-items: center;

  svg {
    border-radius: 5px;
  }
}

.wa-emoji-icon {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  padding: 4px 2px;
  display: flex;
  align-items: center;
  max-height: fit-content;
  opacity: 0.8;
}

.wa-qr-link-alt {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #000;
  font-size: 1.125rem;
  transition: color 0.2s;
  margin-top: -15px;
  text-decoration: 2px solid #25d366 underline;

  &:hover {
    color: #25d366;
  }

  .wa-arrow {
    transition: transform 0.2s;
  }

  &:hover .wa-arrow {
    transform: translateX(2px);
  }
}

.wa-button {
  padding: 12px 24px;
  border: none;
  border-radius: 4px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.wa-button-primary {
  width: 100%;
  background: #00a884;
  color: white;

  &:hover:not(:disabled) {
    background: #008f6f;
  }
}

.wa-button-secondary {
  background: transparent;
  color: #00a884;
  border: 1px solid #00a884;

  &:hover:not(:disabled) {
    background: rgba(0, 168, 132, 0.05);
  }
}

.wa-button-group {
  display: flex;
  gap: 12px;

  .wa-button {
    flex: 1;
  }
}

.wa-qr-footer-card {
  margin-top: 40px;
}

.wa-qr-login-option {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.wa-checkbox-container {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  user-select: none;
}

.wa-checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.wa-checkbox-custom {
  position: relative;
  height: 18px;
  width: 18px;
  border: 2px solid #8696a0;
  border-radius: 3px;
  background-color: white;
  flex-shrink: 0;
  transition: all 0.2s ease;

  &::after {
    content: '';
    position: absolute;
    display: none;
    left: 5px;
    top: 2px;
    width: 4px;
    height: 8px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
}

.wa-checkbox-input:checked~.wa-checkbox-custom {
  background-color: #25d366;
  border-color: #25d366;

  &::after {
    display: block;
  }
}

.wa-checkbox-input:hover~.wa-checkbox-custom {
  border-color: #25d366;
}

.wa-checkbox-label {
  font-size: 1rem;
  color: #000;
  line-height: 1.4;
}

/* Info icon wrapper */
.wa-tooltip-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  margin-left: 3px;
}

/* Tooltip styling */
.wa-tooltip {
  position: absolute;
  bottom: 125%;
  left: 50%;
  width: 300px;
  flex-wrap: wrap;
  transform: translateX(-50%);
  background-color: #2b2b2b;
  color: #fff;
  font-size: 13px;
  padding: 6px 10px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.wa-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #2b2b2b transparent transparent transparent;
}

/* Smooth fade effect */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.wa-info-icon {
  color: #8696a0;
  margin-left: 2px;
  flex-shrink: 0;
  opacity: 0.7;
  transition: opacity 0.2s;

  &:hover {
    opacity: 1;
  }
}

.show-936 {
  display: none;
}

.hide-936-over {
  display: flex;
}

.wa-toggle-link {
  align-items: center;
  color: #000;
  text-decoration: 2px solid #25d366 underline;
  text-underline-offset: 4px;
  font-size: 1rem;

  &:hover {
    color: #22b157;
  }
}

/* Right side */
.wa-right-side {
  flex: 1;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 1.5rem 40px 1.5rem;
}

.wa-qr-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: start;
  justify-content: center;
}

.wa-qr-loading {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wa-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(0, 168, 132, 0.2);
  border-top-color: #00a884;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.wa-qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wa-qr-box {
  // padding: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.wa-qr-image {
  width: 228px;
  height: 228px;
  display: block;
}

.wa-qr-error {
  text-align: center;
  color: #667781;

  p {
    margin-bottom: 16px;
  }
}

.wa-feature-illustration {
  display: flex;
  align-items: center;
  justify-content: center;
}

.wa-phone-icon {
  width: 300px;
  height: 300px;
}

/* Footer */
.wa-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background-color: #fcf5eb;
  padding: 32px 0 24px;
  color: #3b4a54;
  font-family: "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 14px;
}

/* Top text: Don't have account + link */
.wa-signup-section {
  margin-bottom: 16px;
  color: #000;
}

.wa-signup-link {
  color: #000;
  text-decoration: 2px solid #25d366 underline;
  text-underline-offset: 4px;
  margin-left: 4px;
  display: inline-flex;
  align-items: center;
}

.wa-signup-link:hover {
  text-decoration: underline;
}

.wa-link-arrow {
  margin-left: 4px;
}

/* Lock + encryption text */
.wa-encryption-section {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #8a8781;
  margin-bottom: 12px;
  gap: 6px;
  font-size: 1.125rem;
}

/* Terms link */
.wa-terms {
  font-size: 0.8rem;
  color: #8a8781;
}

.wa-terms a {
  text-decoration: none;
  color: inherit;
}

.wa-terms a:hover {
  text-decoration: underline;
}


/* Success Dialog */
.wa-success-dialog {
  :deep(.el-dialog) {
    border-radius: 8px;
  }

  :deep(.el-dialog__body) {
    padding: 32px 24px 24px;
  }

  :deep(.el-dialog__footer) {
    padding: 0 24px 24px;
  }
}

.wa-success-content {
  text-align: center;
}

.wa-success-icon {
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
}

.wa-success-title {
  font-size: 20px;
  font-weight: 500;
  color: #3b4a54;
  margin-bottom: 12px;
}

.wa-success-message {
  color: #667781;
  font-size: 14px;
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 936px) {
  .wa-container {
    padding-inline: 5rem;
  }

  .wa-main-card {
    flex-direction: column;
  }

  .wa-instructions {
    max-width: 100%;
  }

  .wa-right-side {
    order: -1;
    min-height: 300px;

    .wa-qr-wrapper {
      padding: 20px;
    }

    .hide-936-over {
      display: none;
    }

  }

  .wa-qr-footer-card {
    margin-top: 20px;
  }

  .show-936 {
    margin-top: 20px;
    display: flex;
  }

  // Download banner modifications
  .wa-download-banner {
    padding: 20px 32px;
  }

  .wa-download-desc {
    display: none;
  }

  .wa-download-button {
    display: none;
  }

  .wa-download-link {
    display: inline-flex;
  }
}

@media (max-width: 768px) {
  .wa-container {
    padding-inline: 3rem;
  }

  .wa-main-card {
    flex-direction: column;
  }

  .wa-left-side {
    padding: 24px 16px;
    min-height: 350px;
  }

  .wa-right-side {
    padding: 32px 24px;
    min-height: 300px;
  }

  .wa-title {
    font-size: 24px;
  }

  .wa-download-banner {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .wa-download-button {
    width: 100%;
    justify-content: center;
  }

  /* Mobile styles for code form */
  .wa-code-title {
    font-size: 1.5rem;
  }

  .wa-code-subtitle {
    font-size: 0.9rem;
  }

  .wa-phone-form {
    min-width: 100%;
  }

  .wa-code-boxes-container {
    padding: 16px 8px;
    gap: 6px;
  }

  .wa-code-box {
    width: 36px;
    height: 48px;
    font-size: 22px;
  }

  .wa-code-box:nth-child(5) {
    width: 16px;
  }

  .wa-instruction-text {
    font-size: 14px;
  }

  .wa-instruction-number {
    width: 22px;
    height: 22px;
    font-size: 12px;
  }

  .wa-instruction-item {
    padding-bottom: 14px;
  }

  .wa-instruction-item:not(:last-child)::before {
    left: 10.5px;
    top: 22px;
  }

  .wa-emoji svg {
    width: 20px;
    height: 20px;
  }

  .wa-emoji-icon svg {
    width: 16px;
    height: 16px;
  }

  .wa-qr-link-alt {
    font-size: 14px;
  }
}

@media (max-width: 500px) {
  .wa-container {
    padding-inline: 1rem;
  }

  .wa-left-side {
    padding: 20px 12px;
  }

  .wa-instruction-text {
    flex-wrap: wrap !important;
  }

  .wa-code-instructions .wa-instruction-item:nth-child(1)::before {
    height: 100% !important;
  }


  .wa-code-title {
    font-size: 1.25rem;
  }

  .wa-code-subtitle {
    font-size: 0.85rem;
    margin-bottom: 24px;
  }

  .wa-code-boxes-container {
    padding: 12px 6px;
    gap: 4px;
  }

  .wa-code-box {
    width: 32px;
    height: 42px;
    font-size: 20px;
    border-radius: 6px;
  }

  .wa-code-box:nth-child(5) {
    width: 12px;
  }

  .wa-instruction-text {
    font-size: 13px;
  }

  .wa-instruction-number {
    width: 20px;
    height: 20px;
    font-size: 11px;
  }

  .wa-instruction-item {
    gap: 10px;
    padding-bottom: 12px;
  }

  .wa-instruction-item:not(:last-child)::before {
    left: 9.5px;
    top: 20px;
  }
}
</style>
