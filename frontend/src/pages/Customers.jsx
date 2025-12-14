import React, { useState, useEffect } from 'react'
import { customerAPI } from '../services/api'
import './Customers.css'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: { street: '', city: '', state: '', zipCode: '' },
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const params = searchTerm ? { search: searchTerm } : {}
      const response = await customerAPI.getAll(params)
      setCustomers(response.data.data.customers || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      alert('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchCustomers()
      }
    }, 500)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        await customerAPI.update(editingCustomer._id, formData)
      } else {
        await customerAPI.create(formData)
      }
      setShowModal(false)
      resetForm()
      fetchCustomers()
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone,
      address: customer.address || { street: '', city: '', state: '', zipCode: '' },
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerAPI.delete(id)
        fetchCustomers()
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: { street: '', city: '', state: '', zipCode: '' },
    })
    setEditingCustomer(null)
  }

  return (
    <div className="customers-page">
      <div className="page-header">
        <h1>Customers</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Customer
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search customers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading customers...</div>
      ) : (
        <div className="customers-grid">
          {customers.map((customer) => (
            <div key={customer._id} className="customer-card">
              <div className="customer-header">
                <h3>{customer.name}</h3>
                <div className="customer-actions">
                  <button className="btn-edit" onClick={() => handleEdit(customer)}>
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(customer._id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="customer-details">
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <span>{customer.phone}</span>
                </div>
                {customer.email && (
                  <div className="detail-item">
                    <span className="detail-icon">✉️</span>
                    <span>{customer.email}</span>
                  </div>
                )}
                {customer.address?.city && (
                  <div className="detail-item">
                    <span className="detail-icon">📍</span>
                    <span>{customer.address.city}, {customer.address.state}</span>
                  </div>
                )}
              </div>
              <div className="customer-stats">
                <div className="stat-item">
                  <span className="stat-label">Orders</span>
                  <span className="stat-value">{customer.totalOrders || 0}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Spent</span>
                  <span className="stat-value">₹{customer.totalSpent || 0}</span>
                </div>
              </div>
            </div>
          ))}
          {customers.length === 0 && (
            <div className="empty-state">
              <p>No customers found. Create your first customer!</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCustomer ? 'Edit Customer' : 'Add Customer'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, street: e.target.value } })}
                  className="form-input"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData({ ...formData, address: { ...formData.address, zipCode: e.target.value } })}
                  className="form-input"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Customers

