<template>
  <div class="wa-qr-wrapper">
    <!-- Loading State -->
    <div v-if="loading" class="wa-qr-loading">
      <div class="wa-spinner"></div>
    </div>

    <!-- QR Code Display -->
    <div v-else-if="qrCode && !error" class="wa-qr-display">
      <div class="wa-qr-box">
        <img :src="qrCode" alt="QR Code" class="wa-qr-image" />
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="wa-qr-error">
      <p>{{ error }}</p>
      <button class="wa-button wa-button-primary" @click="$emit('regenerate')">
        {{ regenerateText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  loading: boolean
  qrCode: string
  error: string
  regenerateText: string
}

defineProps<Props>()
defineEmits<{
  regenerate: []
}>()
</script>

<style scoped lang="scss">
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
</style>

