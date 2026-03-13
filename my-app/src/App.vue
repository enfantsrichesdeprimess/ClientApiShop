<!-- src/App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Каталог</router-link> |
      <template v-if="isAuthenticated">
        <router-link to="/cart">Корзина</router-link> |
        <router-link to="/orders">Заказы</router-link> |
        <span class="user-info">Привет, {{ username }}!</span> |
        <a href="#" @click.prevent="handleLogout">Выйти</a>
      </template>
      <template v-else>
        <router-link to="/login">Вход</router-link> |
        <router-link to="/register">Регистрация</router-link>
      </template>
    </nav>
    <Notification
        :message="notificationMessage"
        :type="notificationType"
    />
    <router-view/>
  </div>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'
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
  watch: {
    'authError'(newError) {
      if (newError) {
        this.showNotification(newError, 'error')
      }
    }
  },
  computed: {
    ...mapState('auth', {
      authError: state => state.error
    })
  },
  methods: {
    showNotification(message, type = 'error') {
      this.notificationMessage = message
      this.notificationType = type

      if (this.notificationTimeout) {
        clearTimeout(this.notificationTimeout)
      }

      this.notificationTimeout = setTimeout(() => {
        this.notificationMessage = ''
      }, 3000)
    },

    computed: {
      ...mapGetters('auth', ['isAuthenticated', 'currentUser']),

      username() {
        return this.currentUser?.username || 'Гость'
      }
    },

    methods: {
      ...mapActions('auth', ['logout']),

      handleLogout() {
        this.logout()
        this.$router.push('/')
      }
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

nav {
  padding: 30px;
  text-align: center;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

nav a, nav span {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

.user-info {
  color: #4c6ef5;
  font-weight: normal;
}
</style>