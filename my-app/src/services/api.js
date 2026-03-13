const API_BASE_URL = 'http://lifestealer86.ru/api-shop'

const handleResponse = async (response) => {
    if (!response) {
        throw new Error('Нет ответа от сервера')
    }

    const contentType = response.headers.get('content-type')
    const isJson = contentType && contentType.includes('application/json')

    let data
    if (isJson) {
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

    put: async (endpoint, body = {}, token = null) => {
        const headers = {
            'Content-Type': 'application/json',
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'PUT',
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
    login: (username, password) =>
        api.post('login', { username, password }),
    register: (userData) =>
        api.post('register', userData),
    getCart: (token) => api.get('cart', token),
    addToCart: (productId, quantity = 1, token) =>
        api.post('cart', { product_id: productId, quantity }, token),
    updateCartItem: (itemId, quantity, token) =>
        api.put(`cart/${itemId}`, { quantity }, token),
    removeFromCart: (itemId, token) => api.delete(`cart/${itemId}`, token),
    createOrder: (token) => api.post('order', {}, token),
}