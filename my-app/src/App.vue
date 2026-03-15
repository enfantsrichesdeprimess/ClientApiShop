<template>
  <div id="app">
    <header class="header">
      <div class="header-container">
        <div class="logo">
          <router-link to="/">
            <span class="logo-text">Интернет-магазин</span>
          </router-link>
        </div>

        <nav class="nav">
          <router-link to="/" class="nav-link" exact-active-class="active">
            Каталог
          </router-link>

          <template v-if="isAuthenticated">
            <router-link to="/cart" class="nav-link" active-class="active">
              Корзина
              <span v-if="cartItemsCount > 0" class="badge">{{ cartItemsCount }}</span>
            </router-link>

            <router-link to="/orders" class="nav-link" active-class="active">
              Мои заказы
            </router-link>

            <div class="user-menu">
              <span class="user-name">
                👤 {{ username }}
                <span class="user-role">{{ userRole === 'client' ? 'Клиент' : userRole }}</span>
              </span>
              <button @click="handleLogout" class="logout-btn">
                Выйти
              </button>
            </div>
          </template>

          <template v-else>
            <router-link to="/login" class="nav-link" active-class="active">
              Вход
            </router-link>
            <router-link to="/register" class="nav-link register-link" active-class="active">
              Регистрация
            </router-link>
          </template>
        </nav>
      </div>
    </header>

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>


    <Notification
        :message="notificationMessage"
        :type="notificationType"
        @close="notificationMessage = ''"
    />
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import Notification from '@/components/common/Notification.vue'

export default {
  name: 'App',

  components: {
    Notification
  },

  data() {
    return {
      notificationMessage: '',
      notificationType: 'error',
      notificationTimeout: null
    }
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser', 'userRole']),
    ...mapState('auth', {
      authError: state => state.error
    }),

    username() {
      return this.currentUser?.username || 'Гость'
    },

    cartItemsCount() {
      return 0
    }
  },

  watch: {
    authError(newError) {
      if (newError) {
        this.showNotification(newError, 'error')
      }
    },

    isAuthenticated(newValue, oldValue) {
      if (newValue && !oldValue) {
        this.showNotification('Вы успешно вошли в систему', 'success')
      } else if (!newValue && oldValue) {
        this.showNotification('Вы вышли из системы', 'info')
      }
    }
  },

  methods: {
    ...mapActions('auth', ['logout']),

    handleLogout() {
      this.logout()
      if (this.$route.name !== 'catalog') {
        this.$router.push('/')
      }
    },

    showNotification(message, type = 'error') {
      this.notificationMessage = message
      this.notificationType = type

      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout)
      }

      this.notificationTimeout = setTimeout(() => {
        this.notificationMessage = ''
      }, 3000)
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8f9fa;
  min-height: 100vh;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Шапка */
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 70px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: bold;
  color: #2c3e50;
}


.logo-text {
  background: linear-gradient(135deg, #4c6ef5, #748ffc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-link {
  color: #495057;
  text-decoration: none;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  color: #4c6ef5;
  background: #e7f5ff;
}

.nav-link.active {
  color: #4c6ef5;
  background: #e7f5ff;
  font-weight: 600;
}

.register-link {
  background: #4c6ef5;
  color: white !important;
}

.register-link:hover {
  background: #364fc7;
  color: white !important;
}

.badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #fa5252;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  padding-left: 15px;
  border-left: 1px solid #dee2e6;
}

.user-name {
  display: flex;
  flex-direction: column;
  font-size: 0.9rem;
  color: #495057;
}

.user-role {
  font-size: 0.7rem;
  color: #868e96;
}

.logout-btn {
  padding: 6px 12px;
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #495057;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #fff5f5;
  border-color: #fa5252;
  color: #fa5252;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 10px;
  }

  .user-menu {
    margin-left: 0;
    padding-left: 0;
    border-left: none;
  }
}
</style>