<template>
  <div class="catalog">
    <div class="catalog-header">
      <h1>Каталог товаров</h1>
      <p class="catalog-subtitle">
        {{ products.length }} товаров доступно
      </p>
    </div>

    <div v-if="loading" class="loading-state">
      <LoadingSpinner text="Загрузка товаров..." />
    </div>

    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Ошибка загрузки</h2>
      <p>{{ error }}</p>
      <button @click="retryLoad" class="retry-btn">
        Попробовать снова
      </button>
    </div>

    <div v-else class="products-grid">
      <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
      />
    </div>

    <div v-if="!loading && products.length === 0" class="empty-state">
      <div class="empty-icon">📦</div>
      <h2>Товаров пока нет</h2>
      <p>Загляните позже, мы постоянно пополняем ассортимент</p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProductCard from '@/components/catalog/ProductCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

export default {
  name: 'CatalogView',

  components: {
    ProductCard,
    LoadingSpinner
  },

  computed: {
    ...mapState('products', {
      products: state => state.items,
      loading: state => state.loading,
      error: state => state.error
    })
  },

  methods: {
    ...mapActions('products', ['fetchProducts']),

    retryLoad() {
      this.fetchProducts()
    }
  },

  created() {
    this.fetchProducts()
  }
}
</script>

<style scoped>
.catalog {
  max-width: 1200px;
  margin: 0 auto;
}

.catalog-header {
  text-align: center;
  margin-bottom: 40px;
}

.catalog-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 10px;
  font-weight: 600;
}

.catalog-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 30px;
  padding: 20px 0;
}

.loading-state,
.error-state,
.empty-state {
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

.error-icon,
.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.error-state h2,
.empty-state h2 {
  color: #2c3e50;
  margin-bottom: 10px;
  font-size: 1.5rem;
}

.error-state p,
.empty-state p {
  color: #6c757d;
  margin-bottom: 20px;
  max-width: 400px;
}

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
}

.retry-btn:hover {
  background: #364fc7;
  transform: scale(1.05);
}

@media (max-width: 768px) {
  .catalog-header h1 {
    font-size: 2rem;
  }

  .products-grid {
    gap: 20px;
  }
}
</style>