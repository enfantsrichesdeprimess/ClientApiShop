import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'catalog',
        component: () => import('@/views/catalog/CatalogView.vue')
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue')
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/cart/CartView.vue')
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/orders/OrdersView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router