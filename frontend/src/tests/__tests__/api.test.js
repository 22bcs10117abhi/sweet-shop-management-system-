import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authAPI, categoryAPI, productAPI, orderAPI } from '../../services/api'

describe('API Service Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    localStorage.clear()
  })

  describe('authAPI', () => {
    it('should call admin login endpoint', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { token: 'test-token' } })
      })

      await authAPI.adminLogin('admin', 'password')

      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('categoryAPI', () => {
    it('should fetch all categories', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] })
      })

      const result = await categoryAPI.getAll()

      expect(result).toBeDefined()
    })
  })

  describe('productAPI', () => {
    it('should fetch products with params', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { products: [] } })
      })

      await productAPI.getAll({ search: 'test' })

      expect(global.fetch).toHaveBeenCalled()
    })
  })

  describe('orderAPI', () => {
    it('should create customer order', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: { orderNumber: 'ORD-123' } })
      })

      await orderAPI.createCustomerOrder({
        customerName: 'Test',
        customerPhone: '1234567890',
        items: []
      })

      expect(global.fetch).toHaveBeenCalled()
    })
  })
})

