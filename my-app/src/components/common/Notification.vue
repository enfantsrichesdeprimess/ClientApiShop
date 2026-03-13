<template>
  <transition name="fade">
    <div v-if="message" class="notification" :class="type">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'error',
      validator: value => ['error', 'success', 'info'].includes(value)
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  animation: slideIn 0.3s ease;
}

.notification.error {
  background: #fa5252;
}

.notification.success {
  background: #40c057;
}

.notification.info {
  background: #4c6ef5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>