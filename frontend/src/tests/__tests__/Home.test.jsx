import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Home from '../../pages/Home'

describe('Home Component', () => {
  it('should render home page with login options', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    expect(screen.getByText('Gourmet Marketplace')).toBeInTheDocument()
    expect(screen.getByText('Admin Login')).toBeInTheDocument()
    expect(screen.getByText('Customer Login')).toBeInTheDocument()
  })

  it('should have links to admin and customer login', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    )

    const adminLink = screen.getByText('Admin Login').closest('a')
    const customerLink = screen.getByText('Customer Login').closest('a')

    expect(adminLink).toHaveAttribute('href', '/admin/login')
    expect(customerLink).toHaveAttribute('href', '/customer/login')
  })
})

