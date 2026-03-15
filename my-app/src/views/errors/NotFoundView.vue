<template>
  <div class="not-found">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Страница не найдена</h2>
      <p>Извините, запрашиваемая страница не существует или была перемещена.</p>
      <router-link to="/" class="home-link">Вернуться на главную</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFoundView'
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  padding: 20px;
  text-align: center;
}

.not-found-content {
  max-width: 500px;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.not-found h1 {
  font-size: 6rem;
  color: #4c6ef5;
  margin: 0;
  line-height: 1;
  animation: bounce 2s infinite;
}

.not-found h2 {
  font-size: 2rem;
  color: #2c3e50;
  margin: 20px 0 10px;
}

.not-found p {
  color: #868e96;
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.home-link {
  display: inline-block;
  padding: 12px 30px;
  background: #4c6ef5;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}

.home-link:hover {
  background: #364fc7;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
</style>