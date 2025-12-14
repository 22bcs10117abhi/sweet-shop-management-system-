import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  getNonce: () => api.get('/users/nonce'),
  verify: (message, signature) => api.post('/users/verify', { message, signature }),
  adminLogin: (username, password) => api.post('/users/admin/login', { username, password }),
  logout: () => api.post('/users/logout'),
}

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getLowStock: () => api.get('/products/low-stock'),
}

// Customer APIs
export const customerAPI = {
  getAll: (params) => api.get('/customers', { params }),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
  register: (data) => fetch(`${API_BASE_URL}/customers/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }).then(res => res.json()),
}

// Order APIs
export const orderAPI = {
  getAll: (params) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (data) => api.post('/orders', data),
  createCustomerOrder: (data) => fetch(`${API_BASE_URL}/orders/customer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data)
  }),
  getCustomerOrders: (phone) => fetch(`${API_BASE_URL}/orders/customer?phone=${phone}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  }),
  update: (id, data) => api.put(`/orders/${id}`, data),
  approve: (id) => api.post(`/orders/${id}/approve`),
  reject: (id, reason) => api.post(`/orders/${id}/reject`, { reason }),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getStats: (params) => api.get('/orders/stats', { params }),
}

// Inventory APIs
export const inventoryAPI = {
  getAll: (params) => api.get('/inventory', { params }),
  getByProduct: (productId) => api.get(`/inventory/product/${productId}`),
  update: (productId, data) => api.put(`/inventory/product/${productId}`, data),
  restock: (productId, data) => api.post(`/inventory/product/${productId}/restock`, data),
  getLowStock: () => api.get('/inventory/low-stock'),
}

export default api

