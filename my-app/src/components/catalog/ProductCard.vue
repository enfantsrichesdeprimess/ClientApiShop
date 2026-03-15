<template>
  <div class="product-card">
    <div class="product-image">
      <img
          :src="getImageUrl(product.image)"
          :alt="product.name"
          @error="handleImageError"
      >
    </div>

    <div class="product-content">
      <h3 class="product-title">{{ product.name }}</h3>
      <p class="product-description">{{ truncatedDescription }}</p>

      <div class="product-footer">
        <span class="product-price">{{ formatPrice(product.price) }}</span>

        <button
            v-if="isAuthenticated && isClient"
            class="add-to-cart-btn"
            @click="addToCart"
            :disabled="addingToCart"
        >
          <span v-if="addingToCart" class="spinner"></span>
          <span v-else>В корзину</span>
        </button>

        <button
            v-else-if="!isAuthenticated"
            class="login-to-buy-btn"
            @click="redirectToLogin"
        >
          Войдите, чтобы купить
        </button>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showSuccess" class="add-success">
        ✓ Товар добавлен в корзину
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'ProductCard',

  props: {
    product: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      addingToCart: false,
      showSuccess: false,
      successTimeout: null
    }
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'userRole']),

    isClient() {
      return this.userRole === 'client'
    },

    truncatedDescription() {
      const maxLength = 100
      if (this.product.description && this.product.description.length > maxLength) {
        return this.product.description.slice(0, maxLength) + '...'
      }
      return this.product.description || 'Нет описания'
    }
  },

  methods: {
    ...mapActions('cart', ['addToCart', 'fetchCart']),

    getImageUrl(imagePath) {
      if (!imagePath) return 'https://via.placeholder.com/300x200?text=Нет+изображения'
      if (imagePath.startsWith('http')) return imagePath
      return `http://lifestealer86.ru/api-shop/${imagePath}`
    },

    handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/300x200?text=Ошибка+загрузки'
    },

    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
      }).format(price)
    },

    async addToCart() {
      if (this.addingToCart) return

      this.addingToCart = true

      try {
        await this.addToCart({
          productId: this.product.id
        })

        this.showSuccess = true
        if (this.successTimeout) {
          clearTimeout(this.successTimeout)
        }
        this.successTimeout = setTimeout(() => {
          this.showSuccess = false
        }, 2000)

      } catch (error) {
        console.error('Ошибка добавления в корзину:', error)
      } finally {
        this.addingToCart = false
      }
    },

    redirectToLogin() {
      this.$router.push({
        name: 'login',
        query: { redirect: this.$route.fullPath }
      })
    }
  },

  beforeUnmount() {
    if (this.successTimeout) {
      clearTimeout(this.successTimeout)
    }
  }
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f8f9fa;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  color: #2c3e50;
  font-weight: 600;
}

.product-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 15px;
  flex: 1;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
}

.product-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #4c6ef5;
}

.add-to-cart-btn {
  padding: 8px 16px;
  background: #4c6ef5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-to-cart-btn:hover:not(:disabled) {
  background: #364fc7;
  transform: scale(1.05);
}

.add-to-cart-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-to-buy-btn {
  padding: 8px 16px;
  background: #f8f9fa;
  color: #4c6ef5;
  border: 1px solid #4c6ef5;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.login-to-buy-btn:hover {
  background: #e7f5ff;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
}

.add-success {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  background: #40c057;
  color: white;
  padding: 10px;
  border-radius: 8px;
  text-align: center;
  font-size: 0.9rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(64, 192, 87, 0.3);
  z-index: 10;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 576px) {
  .product-footer {
    flex-direction: column;
    gap: 10px;
  }

  .add-to-cart-btn,
  .login-to-buy-btn {
    width: 100%;
  }
}
</style>