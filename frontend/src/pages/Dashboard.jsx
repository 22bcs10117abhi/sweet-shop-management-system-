import React, { useState, useEffect } from 'react'
import { orderAPI, productAPI, customerAPI, inventoryAPI } from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0,
    lowStockItems: 0,
  })
  const [loading, setLoading] = useState(true)
  const [recentOrders, setRecentOrders] = useState([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [ordersRes, productsRes, customersRes, lowStockRes, ordersListRes] = await Promise.all([
        orderAPI.getStats(),
        productAPI.getAll({ limit: 1 }),
        customerAPI.getAll({ limit: 1 }),
        inventoryAPI.getLowStock(),
        orderAPI.getAll({ limit: 5 }),
      ])

      setStats({
        totalOrders: ordersRes.data.data.totalOrders || 0,
        totalRevenue: ordersRes.data.data.totalRevenue || 0,
        totalProducts: productsRes.data.data.pagination?.total || 0,
        totalCustomers: customersRes.data.data.pagination?.total || 0,
        lowStockItems: lowStockRes.data.data?.length || 0,
      })

      setRecentOrders(ordersListRes.data.data.orders || [])
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome to Gourmet Marketplace Management System</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card revenue">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="stat-card orders">
          <div className="stat-icon">🛒</div>
          <div className="stat-content">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>

        <div className="stat-card products">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="stat-card customers">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Customers</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="stat-card inventory">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Low Stock Items</h3>
            <p className="stat-value">{stats.lowStockItems}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Recent Orders</h2>
          {recentOrders.length > 0 ? (
            <div className="orders-list">
              {recentOrders.map((order) => (
                <div key={order._id} className="order-item">
                  <div className="order-info">
                    <span className="order-number">{order.orderNumber}</span>
                    <span className="order-customer">{order.customer?.name || 'N/A'}</span>
                  </div>
                  <div className="order-details">
                    <span className="order-total">₹{order.total}</span>
                    <span className={`order-status ${order.orderStatus}`}>{order.orderStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-state">No recent orders</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

