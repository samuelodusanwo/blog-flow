import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import './PostForm.css';

const PostForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createPost, updatePost, getPostById, categories, loading, error, user } = useBlog();
  
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    published: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing && id) {
      loadPostForEditing();
    }
  }, [isEditing, id]);

  const loadPostForEditing = async () => {
    try {
      const post = await getPostById(id);
      setFormData({
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category?._id || post.category,
        tags: Array.isArray(post.tags) ? post.tags.map(tag => typeof tag === 'object' ? tag.name : tag).join(', ') : '',
        published: post.published
      });
    } catch (error) {
      console.error('Failed to load post for editing:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Convert tags string to array
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    };

    try {
      let result;
      if (isEditing) {
        result = await updatePost(id, postData);
      } else {
        result = await createPost(postData);
      }
      
      if (result.success) {
        navigate('/posts');
      } else {
        alert(result.error || 'Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('An error occurred while saving the post');
    }
  };

  if (!user) {
    return (
      <div className="not-found">
        <h1>Authentication Required</h1>
        <p>Please log in to create or edit posts.</p>
        <Link to="/login" className="btn btn-primary">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="post-form">
      <h1>{isEditing ? 'Edit Post' : 'Create New Post'}</h1>
      
      {error && <div className="error-message global-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter post title"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="excerpt">Excerpt *</label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows="3"
            className={errors.excerpt ? 'error' : ''}
            placeholder="Brief description of the post"
          />
          {errors.excerpt && <span className="error-message">{errors.excerpt}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="content">Content *</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            className={errors.content ? 'error' : ''}
            placeholder="Write your post content here..."
          />
          {errors.content && <span className="error-message">{errors.content}</span>}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="Enter tags separated by commas (react, javascript, web)"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
            />
            Published
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </button>
          <button
            type="button"
            onClick={() => navigate('/posts')}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;