<template>
  <div class="catalog">
    <h1>Каталог товаров</h1>
    <div v-if="loading">Загрузка...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="products-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <h3>{{ product.name }}</h3>
        <p>{{ product.price }} руб.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'CatalogView',
  computed: {
    ...mapState('products', {
      products: state => state.items,
      loading: state => state.loading,
      error: state => state.error
    })
  },
  methods: {
    ...mapActions('products', ['fetchProducts'])
  },
  created() {
    this.fetchProducts()
  }
}
</script>

<style scoped>
.catalog {
  padding: 20px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  text-align: center;
}

.error {
  color: red;
  padding: 20px;
  text-align: center;
}
</style>