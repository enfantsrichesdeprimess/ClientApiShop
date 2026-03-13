import { shopApi } from '@/services/api'

export default {
    namespaced: true,

    state: {
        token: localStorage.getItem('token') || null,
        user: null,
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
            localStorage.removeItem('token')
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
                    commit('SET_USER', response.user || { username: userData.username })
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
                    commit('SET_USER', { username: credentials.username })
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
        authLoading: state => state.loading,
        authError: state => state.error,
        token: state => state.token
    }
}