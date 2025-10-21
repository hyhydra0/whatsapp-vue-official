<template>
  <div class="wa-code-boxes-container">
    <div class="wa-code-box" v-for="(char, index) in codeArray" :key="index" v-memo="[char]">
      {{ char }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  code: string
}

const props = defineProps<Props>()

const codeArray = computed(() => {
  if (!props.code) return []
  return props.code.split('')
})
</script>

<style scoped lang="scss">
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

@media (max-width: 768px) {
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
}

@media (max-width: 480px) {
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
}
</style>

