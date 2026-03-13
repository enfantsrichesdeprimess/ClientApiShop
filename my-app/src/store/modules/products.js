import { shopApi } from '@/services/api'

export default {
    namespaced: true,

    state: {
        items: [],
        loading: false,
        error: null
    },

    mutations: {
        SET_PRODUCTS(state, products) {
            state.items = products
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        }
    },

    actions: {
        async fetchProducts({ commit }) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const products = await shopApi.getProducts()
                commit('SET_PRODUCTS', products)
            } catch (error) {
                commit('SET_ERROR', error.message)
                console.error('Ошибка загрузки товаров:', error)
            } finally {
                commit('SET_LOADING', false)
            }
        }
    },

    getters: {
        allProducts: state => state.items,
        isLoading: state => state.loading,
        hasError: state => state.error !== null,
        errorMessage: state => state.error
    }
}