import React, { useState, useEffect } from 'react'
import { categoryAPI } from '../services/api'
import './Categories.css'

const Categories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await categoryAPI.getAll()
      setCategories(response.data.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      alert('Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await categoryAPI.update(editingCategory._id, formData)
      } else {
        await categoryAPI.create(formData)
      }
      setShowModal(false)
      setFormData({ name: '', description: '' })
      setEditingCategory(null)
      fetchCategories()
    } catch (error) {
      alert(error.response?.data?.message || 'Operation failed')
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setFormData({ name: category.name, description: category.description || '' })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryAPI.delete(id)
        fetchCategories()
      } catch (error) {
        alert(error.response?.data?.message || 'Delete failed')
      }
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setFormData({ name: '', description: '' })
    setEditingCategory(null)
  }

  return (
    <div className="categories-page">
      <div className="page-header">
        <h1>Categories</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add Category
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading categories...</div>
      ) : (
        <div className="categories-grid">
          {categories.map((category) => (
            <div key={category._id} className="category-card">
              <div className="category-header">
                <h3>{category.name}</h3>
                <div className="category-actions">
                  <button className="btn-edit" onClick={() => handleEdit(category)}>
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(category._id)}>
                    🗑️
                  </button>
                </div>
              </div>
              {category.description && <p className="category-description">{category.description}</p>}
              <div className="category-status">
                <span className={`status-badge ${category.isActive ? 'active' : 'inactive'}`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          ))}
          {categories.length === 0 && (
            <div className="empty-state">
              <p>No categories found. Create your first category!</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Edit Category' : 'Add Category'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Category Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-textarea"
                  rows="4"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Categories

