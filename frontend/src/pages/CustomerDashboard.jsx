import React, { useState, useEffect } from 'react'
import { productAPI, orderAPI, customerAPI } from '../services/api'
import './CustomerDashboard.css'

const CustomerDashboard = () => {
  const [customerInfo, setCustomerInfo] = useState(null)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState([])
  const [showCart, setShowCart] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [orderFormData, setOrderFormData] = useState({
    customer: '',
    items: [],
    discount: 0,
    tax: 0,
    paymentMethod: 'cash',
    notes: ''
  })

  useEffect(() => {
    const info = localStorage.getItem('customerInfo')
    if (info) {
      setCustomerInfo(JSON.parse(info))
    }
    fetchProducts()
    fetchCustomerOrders()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await productAPI.getAll({ isActive: 'true' })
      setProducts(response.data.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomerOrders = async () => {
    try {
      const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')
      
      if (!customerInfo.phone) {
        setOrders([])
        return
      }

      // Fetch orders using customer phone (no auth required)
      const response = await fetch(`http://localhost:8000/api/v1/orders/customer?phone=${encodeURIComponent(customerInfo.phone)}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setOrders(data.data.orders || [])
      } else {
        console.error('Failed to fetch customer orders')
        setOrders([])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    }
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.product._id === product._id)
    if (existingItem) {
      setCart(cart.map(item =>
        item.product._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ))
    } else {
      setCart([...cart, { product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product._id !== productId))
  }

  const updateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.product._id === productId
          ? { ...item, quantity }
          : item
      ))
    }
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      return total + (item.product.price * item.quantity)
    }, 0)
  }

  const handlePlaceOrder = async () => {
    try {
      if (cart.length === 0) {
        alert('Your cart is empty. Add some products first!')
        return
      }

      const customerInfo = JSON.parse(localStorage.getItem('customerInfo') || '{}')
      
      if (!customerInfo.name || !customerInfo.phone) {
        alert('Please login first')
        window.location.href = '/customer/login'
        return
      }

      const orderData = {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerEmail: customerInfo.email || '',
        items: cart.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        discount: orderFormData.discount || 0,
        tax: orderFormData.tax || 0,
        paymentMethod: orderFormData.paymentMethod || 'cash',
        notes: orderFormData.notes || ''
      }

      const response = await fetch('http://localhost:8000/api/v1/orders/customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(orderData)
      })

      if (response.ok) {
        const data = await response.json()
        const orderNumber = data.data.orderNumber || 'N/A'
        alert(`Order placed successfully!\nOrder Number: ${orderNumber}\nTotal: ₹${data.data.total}\n\nYour order is pending approval. You can check the status in "My Orders" section.`)
        setCart([])
        setShowOrderForm(false)
        setOrderFormData({
          customer: '',
          items: [],
          discount: 0,
          tax: 0,
          paymentMethod: 'cash',
          notes: ''
        })
        // Refresh orders to show the new order
        setTimeout(() => {
          fetchCustomerOrders()
        }, 1000)
      } else {
        const errorData = await response.json()
        alert('Failed to place order: ' + (errorData.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Order placement error:', error)
      alert('Failed to place order: ' + (error.message || 'Unknown error'))
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('customerToken')
    localStorage.removeItem('customerInfo')
    window.location.href = '/'
  }

  if (loading) {
    return <div className="customer-dashboard-loading">Loading...</div>
  }

  return (
    <div className="customer-dashboard">
      <header className="customer-header">
        <div className="header-content">
          <h1>🛒 Gourmet Marketplace</h1>
          <div className="header-actions">
            <button className="cart-btn" onClick={() => setShowCart(!showCart)}>
              🛒 Cart ({cart.length})
            </button>
            <div className="customer-info">
              <span>Welcome, {customerInfo?.name || 'Customer'}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="customer-content">
        <div className="products-section">
          <h2>Our Products</h2>
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image">
                  {product.image ? (
                    <img src={product.image} alt={product.name} />
                  ) : (
                    <div className="product-placeholder">🍬</div>
                  )}
                </div>
                <h3>{product.name}</h3>
                {product.description && <p className="product-description">{product.description}</p>}
                <div className="product-details">
                  <span className="product-price">₹{product.price}/{product.unit}</span>
                  <span className={`product-stock ${product.stock <= product.minStockLevel ? 'low' : ''}`}>
                    {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                  </span>
                </div>
                <button
                  className="add-to-cart-btn"
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            ))}
            {products.length === 0 && (
              <div className="empty-state">
                <p>No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {showCart && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h3>Shopping Cart</h3>
              <button className="close-cart" onClick={() => setShowCart(false)}>×</button>
            </div>
            <div className="cart-items">
              {cart.length === 0 ? (
                <p className="empty-cart">Your cart is empty</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.product._id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.product.name}</h4>
                        <p>₹{item.product.price}/{item.product.unit}</p>
                      </div>
                      <div className="cart-item-controls">
                        <button onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}>-</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}>+</button>
                        <button className="remove-btn" onClick={() => removeFromCart(item.product._id)}>🗑️</button>
                      </div>
                      <div className="cart-item-total">
                        ₹{item.product.price * item.quantity}
                      </div>
                    </div>
                  ))}
                  <div className="cart-total">
                    <strong>Total: ₹{getCartTotal()}</strong>
                  </div>
                  <button className="checkout-btn" onClick={() => setShowOrderForm(true)}>
                    Place Order
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        <div className="orders-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>My Orders</h2>
            <button className="btn-secondary" onClick={fetchCustomerOrders} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
              🔄 Refresh
            </button>
          </div>
          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <span className="order-number">{order.orderNumber}</span>
                    <span className={`order-status ${order.orderStatus}`}>
                      {order.orderStatus === 'pending' && '⏳ Pending Approval'}
                      {order.orderStatus === 'confirmed' && '✅ Approved'}
                      {order.orderStatus === 'preparing' && '👨‍🍳 Preparing'}
                      {order.orderStatus === 'ready' && '📦 Ready'}
                      {order.orderStatus === 'completed' && '✅ Completed'}
                      {order.orderStatus === 'cancelled' && '❌ Cancelled'}
                    </span>
                  </div>
                  <div className="order-items">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="order-item">
                        <span>{item.productName} - {item.quantity} {item.unit}</span>
                        <span>₹{item.subtotal}</span>
                      </div>
                    ))}
                  </div>
                  <div className="order-footer">
                    <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="order-total">Total: ₹{order.total}</span>
                  </div>
                  {order.orderStatus === 'pending' && (
                    <div className="order-pending-note">
                      ⏳ Your order is pending approval. We'll notify you once it's approved.
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state-card">
              <p>No orders yet. Start shopping!</p>
              <p className="order-note-text">
                Your order history will appear here once you place orders. Orders will show their approval status.
              </p>
            </div>
          )}
        </div>
      </div>

      {showOrderForm && (
        <div className="modal-overlay" onClick={() => setShowOrderForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Place Order</h2>
              <button className="modal-close" onClick={() => setShowOrderForm(false)}>×</button>
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              {cart.map((item) => (
                <div key={item.product._id} className="summary-item">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>₹{item.product.price * item.quantity}</span>
                </div>
              ))}
              <div className="summary-total">
                <strong>Total: ₹{getCartTotal()}</strong>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowOrderForm(false)}>Cancel</button>
              <button className="btn-primary" onClick={handlePlaceOrder}>Confirm Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerDashboard

