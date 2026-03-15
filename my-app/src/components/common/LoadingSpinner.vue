<template>
  <div class="loading-container" :class="{ 'fullscreen': fullscreen }">
    <div class="spinner" :style="{ width: size, height: size }">
      <div class="spinner-inner"></div>
    </div>
    <p v-if="text" class="loading-text">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: '40px'
    },
    text: {
      type: String,
      default: 'Загрузка...'
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.loading-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  padding: 0;
}

.spinner {
  position: relative;
  animation: rotate 2s linear infinite;
}

.spinner-inner {
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: #4c6ef5;
  border-right-color: #4c6ef5;
  border-radius: 50%;
  animation: spin 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.loading-text {
  margin-top: 20px;
  color: #495057;
  font-size: 1rem;
  font-weight: 500;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>