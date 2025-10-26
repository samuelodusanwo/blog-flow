import React, { useState } from 'react'
import { useBlog } from '../../Context/BlogContext'
import './CategoryList.css'

const CategoryList = () => {
  const { categories, createCategory, loading } = useBlog()
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Category name is required')
      return
    }

    const categoryData = {
      ...formData,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-')
    }

    await createCategory(categoryData)
    setFormData({ name: '', slug: '', description: '' })
    setShowForm(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="category-list">
      <div className="category-header">
        <h1>Categories</h1>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h3>Add New Category</h3>
          <div className="form-group">
            <label>Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Category name"
              required
            />
          </div>
          <div className="form-group">
            <label>Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="URL-friendly slug"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Category description"
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Creating...' : 'Create Category'}
          </button>
        </form>
      )}

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.id} className="category-card">
            <h3 className="category-name">{category.name}</h3>
            <p className="category-slug">{category.slug}</p>
            {category.description && (
              <p className="category-description">{category.description}</p>
            )}
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="empty-state">
          <h2>No categories yet</h2>
          <p>Create your first category to organize your posts.</p>
        </div>
      )}
    </div>
  )
}

export default CategoryList