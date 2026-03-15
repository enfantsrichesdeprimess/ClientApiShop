<template>
  <div class="cart">
    <h1>Корзина</h1>

    <div v-if="loading" class="loading-state">
      <LoadingSpinner text="Загрузка корзины..." />
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <button @click="fetchCart" class="retry-btn">
        Попробовать снова
      </button>
    </div>

    <div v-else-if="cartItems.length === 0" class="empty-cart">
      <div class="empty-icon">🛒</div>
      <h2>Корзина пуста</h2>
      <p>Добавьте товары из каталога, чтобы оформить заказ</p>
      <router-link to="/" class="continue-shopping-btn">
        Перейти в каталог
      </router-link>
    </div>

    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <div class="item-image">
            <img
                :src="getImageUrl(item.image)"
                :alt="item.name"
                @error="handleImageError"
            >
          </div>

          <div class="item-info">
            <h3 class="item-name">{{ item.name }}</h3>
            <p class="item-price">{{ formatPrice(item.price) }}</p>
          </div>

          <div class="item-quantity">
            <span class="quantity-value">{{ item.quantity || 1 }} шт.</span>
          </div>

          <div class="item-total">
            {{ formatPrice((item.price) * (item.quantity || 1)) }}
          </div>

          <button
              @click="removeItem(item.id)"
              class="remove-btn"
              title="Удалить товар"
          >
            ×
          </button>
        </div>
      </div>

      <div class="cart-summary">
        <h2>Итого</h2>

        <div class="summary-row">
          <span>Товаров:</span>
          <span>{{ cartItemsCount }} шт.</span>
        </div>

        <div class="summary-row total">
          <span>Общая стоимость:</span>
          <span>{{ formatPrice(cartTotalPrice) }}</span>
        </div>

        <button
            class="checkout-btn"
            @click="checkout"
            :disabled="cartItems.length === 0"
        >
          Оформить заказ
        </button>

        <router-link to="/" class="continue-link">
          Продолжить покупки
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'CartView',

  components: {
    LoadingSpinner
  },

  computed: {
    ...mapGetters('cart', [
      'cartItems',
      'cartItemsCount',
      'cartTotalPrice',
      'isLoading',
      'errorMessage'
    ]),

    loading() {
      return this.isLoading
    },

    error() {
      return this.errorMessage
    }
  },

  methods: {
    ...mapActions('cart', [
      'fetchCart',
      'removeFromCart'
    ]),

    getImageUrl(imagePath) {
      if (!imagePath) return 'https://via.placeholder.com/100x100?text=Нет+изображения'
      if (imagePath.startsWith('http')) return imagePath
      return `http://lifestealer86.ru/api-shop/${imagePath}`
    },

    handleImageError(e) {
      e.target.src = 'https://via.placeholder.com/100x100?text=Ошибка'
    },

    formatPrice(price) {
      return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2
      }).format(price)
    },

    async removeItem(itemId) {
      if (confirm('Удалить товар из корзины?')) {
        try {
          await this.removeFromCart(itemId)
        } catch (error) {
          console.error('Ошибка удаления товара:', error)
        }
      }
    },

    checkout() {
      this.$router.push({ name: 'orders' })
    }
  },

  created() {
    if (this.$store.getters['auth/isAuthenticated']) {
      this.fetchCart()
    }
  }
}
</script>

<style scoped>
.cart {
  max-width: 1200px;
  margin: 0 auto;
}

.cart h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.loading-state,
.error-state,
.empty-cart {
  min-height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.empty-icon,
.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-cart h2,
.error-state h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.empty-cart p,
.error-state p {
  color: #6c757d;
  margin-bottom: 20px;
  max-width: 400px;
}

.continue-shopping-btn,
.retry-btn {
  padding: 12px 30px;
  background: #4c6ef5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
}

.continue-shopping-btn:hover,
.retry-btn:hover {
  background: #364fc7;
  transform: scale(1.05);
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 30px;
}

.cart-items {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.cart-item {
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 20px;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e9ecef;
}

.cart-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  min-width: 200px;
}

.item-name {
  margin: 0 0 5px 0;
  font-size: 1rem;
  color: #2c3e50;
}

.item-price {
  color: #6c757d;
  font-size: 0.9rem;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-btn {
  width: 30px;
  height: 30px;
  border: 1px solid #dee2e6;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.quantity-btn:hover:not(:disabled) {
  background: #4c6ef5;
  color: white;
  border-color: #4c6ef5;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-value {
  font-size: 1rem;
  font-weight: 600;
  min-width: 30px;
  text-align: center;
}

.item-total {
  font-weight: 600;
  color: #4c6ef5;
  min-width: 100px;
  text-align: right;
}

.remove-btn {
  width: 30px;
  height: 30px;
  border: none;
  background: none;
  font-size: 1.5rem;
  color: #fa5252;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #fff5f5;
  transform: scale(1.1);
}

.cart-summary {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
  position: sticky;
  top: 90px;
}

.cart-summary h2 {
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #6c757d;
}

.summary-row.total {
  color: #2c3e50;
  font-weight: 600;
  font-size: 1.2rem;
  padding-top: 15px;
  border-top: 1px solid #e9ecef;
  margin-top: 15px;
}

.checkout-btn {
  width: 100%;
  padding: 15px;
  background: #40c057;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin: 20px 0 15px;
}

.checkout-btn:hover:not(:disabled) {
  background: #2f9e44;
  transform: scale(1.02);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.continue-link {
  display: block;
  text-align: center;
  color: #4c6ef5;
  text-decoration: none;
  font-size: 0.9rem;
}

.continue-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 60px 1fr;
    grid-template-rows: auto auto auto;
    gap: 10px;
  }

  .item-quantity {
    grid-column: 2;
    justify-content: flex-start;
  }

  .item-total {
    grid-column: 2;
    text-align: left;
  }

  .remove-btn {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .cart-summary {
    position: static;
  }
}
</style>