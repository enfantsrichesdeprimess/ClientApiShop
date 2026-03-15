import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
    {
        path: '/',
        name: 'catalog',
        component: () => import('@/views/catalog/CatalogView.vue'),
        meta: {
            title: 'Каталог товаров',
            requiresAuth: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: {
            title: 'Вход в систему',
            requiresAuth: false,
            guestOnly: true
        }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('@/views/auth/RegisterView.vue'),
        meta: {
            title: 'Регистрация',
            requiresAuth: false,
            guestOnly: true
        }
    },
    {
        path: '/cart',
        name: 'cart',
        component: () => import('@/views/cart/CartView.vue'),
        meta: {
            title: 'Корзина',
            requiresAuth: true,
            requiredRole: 'client'
        }
    },
    {
        path: '/orders',
        name: 'orders',
        component: () => import('@/views/orders/OrdersView.vue'),
        meta: {
            title: 'Мои заказы',
            requiresAuth: true,
            requiredRole: 'client'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/errors/NotFoundView.vue'),
        meta: { title: 'Страница не найдена' }
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

router.beforeEach((to, from, next) => {
    // Устанавливаем заголовок страницы
    document.title = to.meta.title || 'Интернет-магазин'

    const isAuthenticated = store.getters['auth/isAuthenticated']
    const userRole = store.getters['auth/userRole']

    if (to.meta.requiresAuth && !isAuthenticated) {
        next({
            name: 'login',
            query: { redirect: to.fullPath }
        })
        return
    }

    if (to.meta.guestOnly && isAuthenticated) {
        next({ name: 'catalog' })
        return
    }

    if (to.meta.requiredRole && to.meta.requiredRole !== userRole) {
        next({ name: 'catalog' })
        return
    }

    next()
})

router.afterEach((to, from) => {
    console.log(`Переход с ${from.name} на ${to.name}`)
})

export default router