const API_BASE_URL = 'http://lifestealer86.ru/api-shop'

const handleResponse = async (response) => {
    let data
    const contentType = response.headers.get('content-type')

    if (contentType && contentType.includes('application/json')) {
        data = await response.json()
    } else {
        const text = await response.text()
        throw new Error(`Неожиданный ответ от сервера: ${text}`)
    }

    if (!response.ok) {
        const error = data.error || { message: 'Произошла ошибка' }
        throw new Error(error.message)
    }

    return data.data || data
}

export const api = {
    get: async (endpoint, token = null) => {
        const headers = {}
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'GET',
            headers
        })
        return handleResponse(response)
    },

    post: async (endpoint, body = {}, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        })
        return handleResponse(response)
    },

    delete: async (endpoint, token = null) => {
        const headers = {}
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
            headers
        })
        return handleResponse(response)
    },
}

export const shopApi = {
    getProducts: () => api.get('products'),
    login: (email, password) =>
        api.post('login', { email, password }),
    register: (userData) =>
        api.post('signup', {
            fio: userData.fio,
            email: userData.email,
            password: userData.password
        }),
    getCart: (token) => api.get('cart', token),
    addToCart: (productId, token) =>
        api.post(`cart/${productId}`, {}, token),
    removeFromCart: (cartItemId, token) =>
        api.delete(`cart/${cartItemId}`, token),
}