import React, { useState, useEffect } from 'react'
import { orderAPI, customerAPI, productAPI } from '../services/api'
import './Orders.css'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [viewingOrder, setViewingOrder] = useState(null)
  const [formData, setFormData] = useState({
    customer: '',
    items: [{ product: '', quantity: 1 }],
    discount: 0,
    tax: 0,
    paymentMethod: 'cash',
    notes: '',
  })

  useEffect(() => {
    fetchOrders()
    fetchCustomers()
    fetchProducts()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      // Increase limit to get all orders, or use pagination
      const response = await orderAPI.getAll({ limit: 1000 })
      console.log('Orders API Response:', response.data)
      
      // Handle different response structures
      if (response.data && response.data.data) {
        if (response.data.data.orders) {
          setOrders(response.data.data.orders || [])
        } else if (Array.isArray(response.data.data)) {
          // If data is directly an array
          setOrders(response.data.data)
        } else {
          setOrders([])
        }
      } else if (Array.isArray(response.data)) {
        setOrders(response.data)
      } else {
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      console.error('Error response:', error.response)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders'
      setError(errorMessage)
      
      if (error.response?.status === 401) {
        alert('Authentication required. Please login again.')
        window.location.href = '/admin/login'
      }
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll()
      setCustomers(response.data.data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll()
      setProducts(response.data.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await orderAPI.create(formData)
      setShowModal(false)
      resetForm()
      fetchOrders()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create order')
    }
  }

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product: '', quantity: 1 }],
    })
  }

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    })
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]
    newItems[index][field] = value
    setFormData({ ...formData, items: newItems })
  }

  const handleApproveOrder = async (id) => {
    if (window.confirm('Are you sure you want to approve this order?')) {
      try {
        await orderAPI.approve(id)
        fetchOrders()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to approve order')
      }
    }
  }

  const handleRejectOrder = async (id) => {
    const reason = window.prompt('Enter rejection reason (optional):')
    if (reason !== null) {
      try {
        await orderAPI.reject(id, reason)
        fetchOrders()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to reject order')
      }
    }
  }

  const handleCancelOrder = async (id) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await orderAPI.cancel(id)
        fetchOrders()
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to cancel order')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      customer: '',
      items: [{ product: '', quantity: 1 }],
      discount: 0,
      tax: 0,
      paymentMethod: 'cash',
      notes: '',
    })
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      confirmed: '#3498db',
      preparing: '#9b59b6',
      ready: '#1abc9c',
      completed: '#27ae60',
      cancelled: '#e74c3c',
    }
    return colors[status] || '#95a5a6'
  }

  return (
    <div className="orders-page">
      <div className="page-header">
        <h1>Orders</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-secondary" onClick={fetchOrders} style={{ padding: '10px 20px' }}>
            🔄 Refresh
          </button>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Create Order
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner" style={{ 
          background: '#fee', 
          color: '#c33', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #c33'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {loading ? (
        <div className="loading">Loading orders...</div>
      ) : (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.orderNumber || 'N/A'}</td>
                    <td>{order.customer?.name || order.customer || 'N/A'}</td>
                    <td>{order.items?.length || 0} items</td>
                    <td>₹{order.total || 0}</td>
                    <td>
                      <span className="status-badge" style={{ background: getStatusColor(order.orderStatus || 'pending') }}>
                        {order.orderStatus || 'pending'}
                      </span>
                    </td>
                    <td>{order.paymentStatus || 'pending'}</td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-view" onClick={() => setViewingOrder(order)} title="View Details">
                        👁️
                      </button>
                      {order.orderStatus === 'pending' && (
                        <>
                          <button className="btn-approve" onClick={() => handleApproveOrder(order._id)} title="Approve Order">
                            ✅
                          </button>
                          <button className="btn-reject" onClick={() => handleRejectOrder(order._id)} title="Reject Order">
                            ❌
                          </button>
                        </>
                      )}
                      {(order.orderStatus === 'confirmed' || order.orderStatus === 'preparing' || order.orderStatus === 'ready') && (
                        <button className="btn-cancel" onClick={() => handleCancelOrder(order._id)} title="Cancel Order">
                          🚫
                        </button>
                      )}
                    </div>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="empty-state">
                      <p>No orders found. Create your first order!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Order</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Customer *</label>
                <select
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  required
                  className="form-input"
                >
                  <option value="">Select Customer</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name} - {customer.phone}
                    </option>
                  ))}
                </select>
              </div>
              <div className="order-items">
                <div className="items-header">
                  <h3>Items</h3>
                  <button type="button" className="btn-add-item" onClick={handleAddItem}>
                    + Add Item
                  </button>
                </div>
                {formData.items.map((item, index) => (
                  <div key={index} className="order-item-row">
                    <select
                      value={item.product}
                      onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                      required
                      className="form-input"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} - ₹{product.price}/{product.unit}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                      required
                      className="form-input"
                      placeholder="Qty"
                    />
                    {formData.items.length > 1 && (
                      <button type="button" className="btn-remove-item" onClick={() => handleRemoveItem(index)}>
                        🗑️
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Discount (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Tax (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.tax}
                    onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="form-input"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="online">Online</option>
                </select>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewingOrder && (
        <div className="modal-overlay" onClick={() => setViewingOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Order Details - {viewingOrder.orderNumber}</h2>
              <button className="modal-close" onClick={() => setViewingOrder(null)}>×</button>
            </div>
            <div className="order-details-view">
              <div className="detail-section">
                <h3>Customer</h3>
                <p>{viewingOrder.customer?.name || 'N/A'}</p>
                <p>{viewingOrder.customer?.phone || ''}</p>
              </div>
              <div className="detail-section">
                <h3>Items</h3>
                {viewingOrder.items?.map((item, index) => (
                  <div key={index} className="order-item-detail">
                    <span>{item.productName} - {item.quantity} {item.unit}</span>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
              <div className="detail-section">
                <h3>Summary</h3>
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{viewingOrder.subtotal}</span>
                </div>
                <div className="summary-row">
                  <span>Discount:</span>
                  <span>₹{viewingOrder.discount}</span>
                </div>
                <div className="summary-row">
                  <span>Tax:</span>
                  <span>₹{viewingOrder.tax}</span>
                </div>
                <div className="summary-row total">
                  <span>Total:</span>
                  <span>₹{viewingOrder.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Orders

