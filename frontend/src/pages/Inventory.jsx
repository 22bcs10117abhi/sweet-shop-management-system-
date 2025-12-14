import React, { useState, useEffect } from 'react'
import { inventoryAPI, productAPI } from '../services/api'
import './Inventory.css'

const Inventory = () => {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [restockQuantity, setRestockQuantity] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const response = await inventoryAPI.getAll()
      setInventory(response.data.data.inventory || [])
    } catch (error) {
      console.error('Error fetching inventory:', error)
      alert('Failed to fetch inventory')
    } finally {
      setLoading(false)
    }
  }

  const handleRestock = async (e) => {
    e.preventDefault()
    try {
      await inventoryAPI.restock(selectedProduct.product._id, { quantity: parseInt(restockQuantity) })
      setShowRestockModal(false)
      setRestockQuantity('')
      setSelectedProduct(null)
      fetchInventory()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to restock')
    }
  }

  const getStockStatus = (item) => {
    const available = item.availableQuantity || 0
    const minLevel = item.minStockLevel || 10
    
    if (available <= 0) return { status: 'Out of Stock', color: '#e74c3c', class: 'out-of-stock' }
    if (available <= minLevel) return { status: 'Low Stock', color: '#f39c12', class: 'low-stock' }
    if (available >= item.maxStockLevel) return { status: 'Overstocked', color: '#3498db', class: 'overstocked' }
    return { status: 'In Stock', color: '#27ae60', class: 'in-stock' }
  }

  return (
    <div className="inventory-page">
      <div className="page-header">
        <h1>Inventory</h1>
        <button className="btn-secondary" onClick={fetchInventory}>
          🔄 Refresh
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading inventory...</div>
      ) : (
        <div className="inventory-grid">
          {inventory.map((item) => {
            const stockStatus = getStockStatus(item)
            return (
              <div key={item._id} className={`inventory-card ${stockStatus.class}`}>
                <div className="inventory-header">
                  <h3>{item.product?.name || 'Unknown Product'}</h3>
                  <span className="stock-status-badge" style={{ background: stockStatus.color }}>
                    {stockStatus.status}
                  </span>
                </div>
                <div className="inventory-details">
                  <div className="inventory-stat">
                    <span className="stat-label">Available Quantity</span>
                    <span className="stat-value">{item.availableQuantity || 0}</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Total Quantity</span>
                    <span className="stat-value">{item.quantity || 0}</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Reserved</span>
                    <span className="stat-value">{item.reservedQuantity || 0}</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Min Level</span>
                    <span className="stat-value">{item.minStockLevel || 10}</span>
                  </div>
                  <div className="inventory-stat">
                    <span className="stat-label">Max Level</span>
                    <span className="stat-value">{item.maxStockLevel || 1000}</span>
                  </div>
                </div>
                <div className="inventory-footer">
                  <button
                    className="btn-restock"
                    onClick={() => {
                      setSelectedProduct(item)
                      setShowRestockModal(true)
                    }}
                  >
                    📦 Restock
                  </button>
                  {item.lastRestocked && (
                    <span className="last-restocked">
                      Last restocked: {new Date(item.lastRestocked).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
          {inventory.length === 0 && (
            <div className="empty-state">
              <p>No inventory items found. Products will appear here after creation.</p>
            </div>
          )}
        </div>
      )}

      {showRestockModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowRestockModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Restock {selectedProduct.product?.name}</h2>
              <button className="modal-close" onClick={() => setShowRestockModal(false)}>×</button>
            </div>
            <form onSubmit={handleRestock} className="modal-form">
              <div className="form-group">
                <label>Current Stock: {selectedProduct.quantity || 0}</label>
              </div>
              <div className="form-group">
                <label>Quantity to Add *</label>
                <input
                  type="number"
                  min="1"
                  value={restockQuantity}
                  onChange={(e) => setRestockQuantity(e.target.value)}
                  required
                  className="form-input"
                  placeholder="Enter quantity"
                />
              </div>
              <div className="form-group">
                <label>New Stock: {selectedProduct.quantity + (parseInt(restockQuantity) || 0)}</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowRestockModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Inventory

