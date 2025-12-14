import React, { useState, useEffect } from 'react'
import { productAPI, categoryAPI } from '../services/api'
import './Products.css'

const Products = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    costPrice: '',
    unit: 'kg',
    stock: '',
    minStockLevel: '10',
    barcode: '',
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = searchTerm ? { search: searchTerm } : {}
      const response = await productAPI.getAll(params)
      setProducts(response.data.data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      alert('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll()
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchTerm !== undefined) {
        fetchProducts()
      }
    }, 500)
    return () => clearTimeout(debounce)
  }, [searchTerm])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        stock: parseInt(formData.stock) || 0,
        minStockLevel: parseInt(formData.minStockLevel) || 10,
      }
      if (editingProduct) {
        await productAPI.update(editingProduct._id, data)
      } else {
        await productAPI.create(data)
      }
      setShowModal(false)
      resetForm()
      fetchProducts()
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description || '',
      category: product.category._id || product.category,
      price: product.price,
      costPrice: product.costPrice,
      unit: product.unit,
      stock: product.stock,
      minStockLevel: product.minStockLevel,
      barcode: product.barcode || '',
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id)
        fetchProducts()
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      costPrice: '',
      unit: 'kg',
      stock: '',
      minStockLevel: '10',
      barcode: '',
    })
    setEditingProduct(null)
  }

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Product
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div className="product-header">
                <h3>{product.name}</h3>
                <div className="product-actions">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(product._id)}>
                    🗑️
                  </button>
                </div>
              </div>
              {product.description && <p className="product-description">{product.description}</p>}
              <div className="product-details">
                <div className="detail-item">
                  <span className="detail-label">Category:</span>
                  <span className="detail-value">{product.category?.name || 'N/A'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">₹{product.price}/{product.unit}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Stock:</span>
                  <span className={`detail-value ${product.stock <= product.minStockLevel ? 'low-stock' : ''}`}>
                    {product.stock} {product.unit}
                  </span>
                </div>
              </div>
              <div className="product-footer">
                <span className={`status-badge ${product.isActive ? 'active' : 'inactive'}`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
                {product.stock <= product.minStockLevel && (
                  <span className="low-stock-badge">⚠️ Low Stock</span>
                )}
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="empty-state">
              <p>No products found. Create your first product!</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="form-input"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Cost Price (₹) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Unit *</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    required
                    className="form-input"
                  >
                    <option value="kg">kg</option>
                    <option value="piece">piece</option>
                    <option value="dozen">dozen</option>
                    <option value="pack">pack</option>
                    <option value="gram">gram</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Min Stock Level</label>
                  <input
                    type="number"
                    value={formData.minStockLevel}
                    onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Products

