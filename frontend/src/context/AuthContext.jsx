import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      // You can decode token here to get user info
    }
    setLoading(false)
  }, [])

  const login = async (message, signature) => {
    try {
      const response = await authAPI.verify(message, signature)
      const token = response.data.data
      localStorage.setItem('token', token)
      setIsAuthenticated(true)
      setUser({ address: 'admin' }) // You can decode token to get actual user
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Login failed' }
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setIsAuthenticated(false)
      setUser(null)
      window.location.href = '/'
    }
  }

  const getNonce = async () => {
    try {
      const response = await authAPI.getNonce()
      return response.data.data.nonce
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to get nonce')
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getNonce,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

