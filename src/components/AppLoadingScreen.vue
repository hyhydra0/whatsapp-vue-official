<template>
  <div 
    v-if="isVisible" 
    class="app-loading-screen"
    :class="{ 'fade-out': isFadingOut }"
  >
    <div class="loading-content">
      <!-- WhatsApp Logo with Animation -->
      <div class="logo-container">
        <div class="whatsapp-logo">
          <div class="logo-icon">
            <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" fill="#25D366"/>
            </svg>
          </div>
          <div class="loading-spinner">
            <div class="spinner-ring"></div>
          </div>
        </div>
      </div>
      
      <!-- WhatsApp Text -->
      <div class="whatsapp-text">
        WhatsApp
      </div>
      
      <!-- Loading Dots Animation -->
      <div class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  duration?: number // minimum duration to show loading screen in ms
}

const props = withDefaults(defineProps<Props>(), {
  duration: 3000 // 3 seconds default to match WhatsApp Web timing
})

const emit = defineEmits<{
  'loading-complete': []
}>()

const isVisible = ref(true)
const isFadingOut = ref(false)

const hideLoadingScreen = () => {
  setTimeout(() => {
    isFadingOut.value = true
    // Wait for fade animation to complete before removing from DOM
    setTimeout(() => {
      isVisible.value = false
      emit('loading-complete')
    }, 500) // Match CSS transition duration
  }, props.duration)
}

onMounted(() => {
  hideLoadingScreen()
})
</script>

<style scoped>
.app-loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #111b21; /* WhatsApp Web dark background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
  opacity: 1;
}

.app-loading-screen.fade-out {
  opacity: 0;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  text-align: center;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.whatsapp-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.logo-icon svg {
  animation: logoPulse 2s ease-in-out infinite;
}

.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
}

.spinner-ring {
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid #00a884;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.whatsapp-text {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 28px;
  font-weight: 300;
  color: #ffffff;
  letter-spacing: -0.5px;
  margin-top: 8px;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #8696a0;
  animation: dotBounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.dot:nth-child(3) {
  animation-delay: 0s;
}

/* Animations */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes logoPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}

@keyframes dotBounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .whatsapp-text {
    font-size: 24px;
  }
  
  .logo-icon svg {
    width: 50px;
    height: 50px;
  }
  
  .loading-spinner {
    width: 70px;
    height: 70px;
  }
  
  .loading-content {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .whatsapp-text {
    font-size: 22px;
  }
  
  .logo-icon svg {
    width: 45px;
    height: 45px;
  }
  
  .loading-spinner {
    width: 60px;
    height: 60px;
  }
  
  .loading-content {
    gap: 18px;
  }
}

/* Ensure it covers everything */
.app-loading-screen * {
  box-sizing: border-box;
}
</style>
