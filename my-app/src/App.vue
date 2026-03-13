<template>
  <div id="app">
    <nav>
      <router-link to="/">Каталог</router-link> |
      <router-link to="/cart">Корзина</router-link> |
      <router-link to="/orders">Заказы</router-link> |
      <router-link to="/login">Вход</router-link> |
      <router-link to="/register">Регистрация</router-link>
    </nav>
    <router-view/>
  </div>
</template>

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
}

nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>