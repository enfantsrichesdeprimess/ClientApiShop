import { shopApi } from '@/services/api'

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem('token') || null,
        user: null,
        role: localStorage.getItem('userRole') || null, // Добавляем роль
        loading: false,
        error: null
    },

    mutations: {
        SET_TOKEN(state, token) {
            state.token = token
            if (token) {
                localStorage.setItem('token', token)
            } else {
                localStorage.removeItem('token')
            }
        },
        SET_USER(state, user) {
            state.user = user
            if (user && user.role) {
                localStorage.setItem('userRole', user.role)
                state.role = user.role
            }
        },
        SET_ROLE(state, role) {
            state.role = role
            if (role) {
                localStorage.setItem('userRole', role)
            } else {
                localStorage.removeItem('userRole')
            }
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
            localStorage.removeItem('token')
            localStorage.removeItem('userRole')
        }
    },

    actions: {
        async register({ commit }, userData) {
            commit('SET_LOADING', true)
            commit('SET_ERROR', null)

            try {
                const response = await shopApi.register(userData)

                if (response.token) {
                    commit('SET_TOKEN', response.token)
                    const user = {
                        username: userData.username,
                        email: userData.email,
                        role: 'client'
                    }
                    commit('SET_USER', user)
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
                const response = await shopApi.login(credentials.username, credentials.password)

                if (response.token) {
                    commit('SET_TOKEN', response.token)
                    const user = {
                        username: credentials.username,
                        role: 'client'
                    }
                    commit('SET_USER', user)
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
        isGuest: state => !state.token,
        authLoading: state => state.loading,
        authError: state => state.error,
        token: state => state.token
    }
}