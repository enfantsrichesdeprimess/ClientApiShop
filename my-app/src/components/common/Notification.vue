<template>
  <transition name="slide">
    <div v-if="isVisible" class="notification" :class="type">
      <span class="notification-icon">{{ icon }}</span>
      <span class="notification-message">{{ message }}</span>
      <button class="notification-close" @click="close">×</button>
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
      default: 'info',
      validator: value => ['error', 'success', 'info', 'warning'].includes(value)
    },
    duration: {
      type: Number,
      default: 3000
    }
  },

  data() {
    return {
      isVisible: false,
      timer: null
    }
  },

  computed: {
    icon() {
      const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
      }
      return icons[this.type] || 'ℹ️'
    }
  },

  watch: {
    message: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.show()
        } else {
          this.hide()
        }
      }
    }
  },

  methods: {
    show() {
      this.isVisible = true

      if (this.timer) {
        clearTimeout(this.timer)
      }

      if (this.duration > 0) {
        this.timer = setTimeout(() => {
          this.close()
        }, this.duration)
      }
    },

    hide() {
      this.isVisible = false
    },

    close() {
      this.hide()
      this.$emit('close')
    }
  },

  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  }
}
</script>

<style scoped>
.notification {
  position: fixed;
  top: 90px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  max-width: 350px;
  min-width: 280px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.3s ease;
  backdrop-filter: blur(10px);
}

.notification.error {
  background: rgba(250, 82, 82, 0.95);
  border-left: 4px solid #c92a2a;
}

.notification.success {
  background: rgba(64, 192, 87, 0.95);
  border-left: 4px solid #2b8a3e;
}

.notification.warning {
  background: rgba(253, 126, 20, 0.95);
  border-left: 4px solid #e8590c;
}

.notification.info {
  background: rgba(76, 110, 245, 0.95);
  border-left: 4px solid #364fc7;
}

.notification-icon {
  font-size: 1.5rem;
}

.notification-message {
  flex: 1;
  font-size: 0.95rem;
  line-height: 1.4;
}

.notification-close {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  opacity: 0.7;
  transition: opacity 0.2s;
  line-height: 1;
}

.notification-close:hover {
  opacity: 1;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
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