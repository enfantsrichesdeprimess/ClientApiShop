import { shopApi } from '@/services/api'

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem('user_token') || null,
        user: null,
        role: localStorage.getItem('userRole') || 'client', // Все пользователи - клиенты
        loading: false,
        error: null
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            if (token) {
                localStorage.setItem('user_token', token)
            } else {
                localStorage.removeItem('user_token')
            }
        },
        SET_USER(state, user) {
            state.user = user
        },
        SET_ROLE(state, role) {
            state.role = role
            localStorage.setItem('userRole', role)
        },
        SET_LOADING(state, status) {
            state.loading = status
        },
        SET_ERROR(state, error) {
            state.error = error
        },
        CLEAR_AUTH(state) {
            state.token = null
            state.user = null
            state.role = null
            localStorage.removeItem('user_token')
            localStorage.removeItem('userRole')
        }
    },

    actions: {
        async register({ commit }, userData) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const response = await shopApi.register(userData)
                console.log('Register response:', response)

                const token = response.user_token || response.token

                if (token) {
                    commit('SET_TOKEN', token)
                    commit('SET_USER', {
                        fio: userData.fio,
                        email: userData.email,
                        role: 'client'
                    })
                    commit('SET_ROLE', 'client')
                }

                return response
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        async login({ commit }, credentials) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const response = await shopApi.login(credentials.email, credentials.password)
                console.log('Login response:', response)

                const token = response.user_token || response.token

                if (token) {
                    commit('SET_TOKEN', token)
                    commit('SET_USER', {
                        email: credentials.email,
                        role: 'client'
                    })
                    commit('SET_ROLE', 'client')
                }

                return response
            } catch (error) {
                commit('SET_ERROR', error.message)
                throw error
            } finally {
                commit('SET_LOADING', false)
            }
        },

        logout({ commit }) {
            commit('CLEAR_AUTH')
        },

        clearError({ commit }) {
            commit('SET_ERROR', null)
        }
    },

    getters: {
        isAuthenticated: state => !!state.token,
        currentUser: state => state.user,
        userRole: state => state.role,
        isClient: state => state.role === 'client',
        authLoading: state => state.loading,
        authError: state => state.error,
        token: state => state.token
    }
}