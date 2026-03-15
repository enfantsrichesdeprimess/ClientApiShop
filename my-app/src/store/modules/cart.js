import { shopApi } from '@/services/api'

export default {
    namespaced: true,

    state: {
        items: [],
        loading: false,
        error: null,
        totalPrice: 0
    },

    mutations: {
        SET_CART_ITEMS(state, items) {
            state.items = items
            state.totalPrice = items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        REMOVE_ITEM(state, itemId) {
            state.items = state.items.filter(i => i.id !== itemId)
            state.totalPrice = state.items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0)
        },
        CLEAR_CART(state) {
            state.items = []
            state.totalPrice = 0
        }
    },

    actions: {
        async fetchCart({ commit, rootGetters }) {
            const token = rootGetters['auth/token']
            if (!token) {
                console.log('Нет токена для получения корзины')
                return
            }

            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const cartData = await shopApi.getCart(token)
                console.log('Корзина получена:', cartData)

                const groupedItems = []
                const itemMap = new Map()

                cartData.forEach(item => {
                    const key = item.product_id
                    if (itemMap.has(key)) {
                        const existingItem = itemMap.get(key)
                        existingItem.quantity++
                    } else {
                        itemMap.set(key, {
                            ...item,
                            quantity: 1
                        })
                    }
                })

                const items = Array.from(itemMap.values())
                commit('SET_CART_ITEMS', items)
                return items
            } catch (error) {
                commit('SET_ERROR', error.message)
                console.error('Ошибка загрузки корзины:', error)
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async addToCart({ commit, dispatch, rootGetters }, { productId }) {
            const token = rootGetters['auth/token']
            if (!token) {
                throw new Error('Необходимо авторизоваться')
            }

            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                await shopApi.addToCart(productId, token)

                await dispatch('fetchCart')
                return true
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async removeFromCart({ commit, dispatch, rootGetters }, cartItemId) {
            const token = rootGetters['auth/token']
            if (!token) return

            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                await shopApi.removeFromCart(cartItemId, token)
                await dispatch('fetchCart')
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        clearCart({ commit }) {
            commit('CLEAR_CART')
        }
    },

    getters: {
        cartItems: state => state.items,
        cartItemsCount: state => state.items.reduce((count, item) => count + (item.quantity || 1), 0),
        cartTotalPrice: state => state.totalPrice,
        isLoading: state => state.loading,
        hasError: state => state.error !== null,
        errorMessage: state => state.error
    }
}