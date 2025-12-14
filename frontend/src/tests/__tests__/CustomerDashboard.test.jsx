import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CustomerDashboard from '../../pages/CustomerDashboard'

describe('CustomerDashboard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    localStorage.setItem('customerInfo', JSON.stringify({
      name: 'Test Customer',
      phone: '1234567890'
    }))
  })

  it('should render customer dashboard', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          products: [],
          pagination: { total: 0 }
        }
      })
    })

    render(<CustomerDashboard />)

    expect(screen.getByText('Gourmet Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Our Products')).toBeInTheDocument()
  })

  it('should display products', async () => {
    const mockProducts = [
      {
        _id: '1',
        name: 'Gulab Jamun',
        price: 200,
        unit: 'kg',
        stock: 50,
        minStockLevel: 10
      }
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          products: mockProducts,
          pagination: { total: 1 }
        }
      })
    })

    render(<CustomerDashboard />)

    await waitFor(() => {
      expect(screen.getByText('Gulab Jamun')).toBeInTheDocument()
    })
  })

  it('should add product to cart', async () => {
    const mockProducts = [
      {
        _id: '1',
        name: 'Gulab Jamun',
        price: 200,
        unit: 'kg',
        stock: 50,
        minStockLevel: 10
      }
    ]

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          products: mockProducts,
          pagination: { total: 1 }
        }
      })
    })

    render(<CustomerDashboard />)

    await waitFor(() => {
      const addButton = screen.getByText('Add to Cart')
      fireEvent.click(addButton)
    })

    const cartButton = screen.getByText(/Cart \(1\)/)
    expect(cartButton).toBeInTheDocument()
  })
})

