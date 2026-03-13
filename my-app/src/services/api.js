const API_BASE_URL = 'http://lifestealer86.ru/api-shop'

const handleResponse = async (response) => {
    const data = await response.json()

    if (!response.ok) {
        const error = data.error || { message: 'Произошла ошибка' }
        throw new Error(error.message)
    }

    return data.data
}

export const api = {
    get: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`)
        return handleResponse(response)
    },

    post: async (endpoint, body) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
        return handleResponse(response)
    },

    delete: async (endpoint) => {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'DELETE',
        })
        return handleResponse(response)
    },
}

export const shopApi = {
    getProducts: () => api.get('products'),
    getCart: (token) => api.get('cart', token),
    addToCart: (productId, quantity = 1, token) =>
        api.post('cart', { product_id: productId, quantity }, token),
    updateCartItem: (itemId, quantity, token) =>
        api.put(`cart/${itemId}`, { quantity }, token),
    removeFromCart: (itemId, token) => api.delete(`cart/${itemId}`, token),
    createOrder: (token) => api.post('order', {}, token),
    login: (username, password) =>
        api.post('login', { username, password }),
    register: (userData) =>
        api.post('register', userData),
}