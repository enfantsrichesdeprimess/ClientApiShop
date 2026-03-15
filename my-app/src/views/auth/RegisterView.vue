<template>
  <div class="auth-container">
    <form class="auth-form" @submit.prevent="handleRegister">
      <h1>Регистрация</h1>

      <div class="form-group">
        <label for="fio">ФИО *</label>
        <input
            id="fio"
            type="text"
            v-model="form.fio"
            required
            :class="{ error: errors.fio }"
            placeholder="Иванов Иван Иванович"
        />
        <span v-if="errors.fio" class="error-text">{{ errors.fio }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email *</label>
        <input
            id="email"
            type="email"
            v-model="form.email"
            required
            :class="{ error: errors.email }"
            placeholder="example@mail.ru"
        />
        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label for="password">Пароль *</label>
        <input
            id="password"
            type="password"
            v-model="form.password"
            required
            :class="{ error: errors.password }"
            placeholder="Минимум 6 символов"
        />
        <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Подтверждение пароля *</label>
        <input
            id="confirmPassword"
            type="password"
            v-model="form.confirmPassword"
            required
            :class="{ error: errors.confirmPassword }"
            placeholder="Повторите пароль"
        />
        <span v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</span>
      </div>

      <div v-if="storeError" class="error-message">
        {{ storeError }}
      </div>

      <div class="form-actions">
        <button type="submit" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <router-link to="/login">Уже есть аккаунт? Войти</router-link>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RegisterView',

  data() {
    return {
      form: {
        fio: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      errors: {}
    }
  },

  computed: {
    ...mapState('auth', {
      loading: state => state.loading,
      storeError: state => state.error
    }),

    ...mapState('auth', ['isAuthenticated'])
  },

  watch: {
    isAuthenticated(newValue) {
      if (newValue) {
        this.$router.push('/')
      }
    }
  },

  methods: {
    ...mapActions('auth', ['register', 'clearError']),

    validateForm() {
      this.errors = {}
      let isValid = true

      if (!this.form.fio.trim()) {
        this.errors.fio = 'ФИО обязательно'
        isValid = false
      }

      if (!this.form.email.trim()) {
        this.errors.email = 'Email обязателен'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Введите корректный email'
        isValid = false
      }

      if (!this.form.password) {
        this.errors.password = 'Пароль обязателен'
        isValid = false
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Пароль должен быть не менее 6 символов'
        isValid = false
      }

      if (this.form.password !== this.form.confirmPassword) {
        this.errors.confirmPassword = 'Пароли не совпадают'
        isValid = false
      }

      return isValid
    },

    async handleRegister() {
      this.clearError()

      if (!this.validateForm()) {
        return
      }

      try {
        const { confirmPassword, ...userData } = this.form
        await this.register(userData)
      } catch (error) {
        console.error('Ошибка регистрации:', error)
      }
    }
  },

  beforeUnmount() {
    this.clearError()
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
}

.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.auth-form h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 2rem;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #495057;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4c6ef5;
  box-shadow: 0 0 0 3px rgba(76, 110, 245, 0.1);
}

.form-group input.error {
  border-color: #fa5252;
  background-color: #fff5f5;
}

.error-text {
  display: block;
  margin-top: 5px;
  color: #fa5252;
  font-size: 0.85rem;
}

.error-message {
  padding: 12px;
  background: #fff5f5;
  border: 1px solid #ffc9c9;
  border-radius: 8px;
  color: #fa5252;
  margin-bottom: 20px;
  text-align: center;
}

.form-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-actions button {
  padding: 12px;
  background: #4c6ef5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.form-actions button:hover:not(:disabled) {
  background: #364fc7;
}

.form-actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-actions a {
  text-align: center;
  color: #4c6ef5;
  text-decoration: none;
  font-size: 0.9rem;
}

.form-actions a:hover {
  text-decoration: underline;
}
</style>