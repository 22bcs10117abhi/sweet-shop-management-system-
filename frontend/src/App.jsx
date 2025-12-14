import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import AdminLogin from './pages/AdminLogin'
import CustomerLogin from './pages/CustomerLogin'
import CustomerDashboard from './pages/CustomerDashboard'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Products from './pages/Products'
import Customers from './pages/Customers'
import Orders from './pages/Orders'
import Inventory from './pages/Inventory'
import Layout from './components/Layout'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="customers" element={<Customers />} />
            <Route path="orders" element={<Orders />} />
            <Route path="inventory" element={<Inventory />} />
          </Route>
          {/* Legacy routes for backward compatibility */}
          <Route path="/login" element={<Navigate to="/admin/login" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

