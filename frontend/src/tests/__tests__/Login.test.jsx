import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import AdminLogin from '../../pages/AdminLogin'

describe('AdminLogin Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  it('should render login form', () => {
    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    )

    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument()
    expect(screen.getByText('Login as Admin')).toBeInTheDocument()
  })

  it('should show error on failed login', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Invalid credentials' })
    })

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    )

    const usernameInput = screen.getByPlaceholderText('Enter username')
    const passwordInput = screen.getByPlaceholderText('Enter password')
    const submitButton = screen.getByText('Login as Admin')

    fireEvent.change(usernameInput, { target: { value: 'test' } })
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should submit form with correct data', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: { token: 'test-token' } })
    })

    render(
      <BrowserRouter>
        <AdminLogin />
      </BrowserRouter>
    )

    const usernameInput = screen.getByPlaceholderText('Enter username')
    const passwordInput = screen.getByPlaceholderText('Enter password')
    const submitButton = screen.getByText('Login as Admin')

    fireEvent.change(usernameInput, { target: { value: 'admin' } })
    fireEvent.change(passwordInput, { target: { value: 'admin123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8000/api/v1/users/admin/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            username: 'admin',
            password: 'admin123'
          })
        })
      )
    })
  })
})

