import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { customerAPI } from '../services/api'
import './Login.css'

const CustomerLogin = () => {
  const [isRegistering, setIsRegistering] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [phone, setPhone] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: ''
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // For customer login, we'll use a simplified approach
      // In production, you might want to implement customer authentication
      // For now, we'll just store customer info in localStorage
      if (!phone || !name) {
        setError('Please enter both name and phone number')
        setLoading(false)
        return
      }

      // Store customer info (simplified - in production, verify with backend)
      localStorage.setItem('customerToken', 'customer_' + Date.now())
      localStorage.setItem('customerInfo', JSON.stringify({ name, phone }))
      
      // Redirect to customer dashboard or order page
      window.location.href = '/customer/dashboard'
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!name || !phone) {
        setError('Name and phone number are required')
        setLoading(false)
        return
      }

      const registrationData = {
        name,
        phone,
        email: email || undefined,
        address: (address.street || address.city || address.state || address.zipCode) ? address : undefined
      }

      const response = await customerAPI.register(registrationData)

      if (response.success) {
        setSuccess('Registration successful! You can now login.')
        // Clear form
        setName('')
        setPhone('')
        setEmail('')
        setAddress({ street: '', city: '', state: '', zipCode: '' })
        // Switch to login mode after 2 seconds
        setTimeout(() => {
          setIsRegistering(false)
          setSuccess('')
        }, 2000)
      } else {
        setError(response.message || 'Registration failed')
      }
    } catch (err) {
      setError(err.message || err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setName('')
    setPhone('')
    setEmail('')
    setAddress({ street: '', city: '', state: '', zipCode: '' })
    setError('')
    setSuccess('')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🛒 Gourmet Marketplace</h1>
          <p>{isRegistering ? 'Customer Registration' : 'Customer Login'}</p>
        </div>
        
        <div className="toggle-buttons" style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => { setIsRegistering(false); resetForm(); }}
            className={!isRegistering ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => { setIsRegistering(true); resetForm(); }}
            className={isRegistering ? 'btn-primary' : 'btn-secondary'}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Register
          </button>
        </div>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="form-input"
              required
            />
          </div>
          
          {isRegistering && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email (optional)"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  placeholder="Enter street address (optional)"
                  className="form-input"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="City (optional)"
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    placeholder="State (optional)"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                  placeholder="Zip code (optional)"
                  className="form-input"
                />
              </div>
            </>
          )}

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
          
          <button type="submit" className="login-btn" disabled={loading}>
            {loading 
              ? (isRegistering ? 'Registering...' : 'Logging in...') 
              : (isRegistering ? 'Register' : 'Login as Customer')
            }
          </button>
          
          <div className="login-footer">
            <Link to="/admin/login" className="switch-link">
              Admin Login →
            </Link>
            <Link to="/" className="switch-link">
              ← Back to Home
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerLogin

