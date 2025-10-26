import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useBlog } from '../../Context/BlogContext'
import './SinglePost.css'

const SinglePost = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getPostById, categories, deletePost } = useBlog()
  const post = getPostById(id)

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId)
    return category ? category.name : 'Uncategorized'
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await deletePost(id)
      navigate('/posts')
    }
  }

  if (!post) {
    return (
      <div className="not-found">
        <h1>Post Not Found</h1>
        <p>The post you're looking for doesn't exist.</p>
        <Link to="/posts" className="btn btn-primary">
          Back to Posts
        </Link>
      </div>
    )
  }

  return (
    <article className="single-post">
      <header className="post-header">
        <Link to="/posts" className="back-link">
          ← Back to Posts
        </Link>
        
        <h1 className="post-title">{post.title}</h1>
        
        <div className="post-meta">
          <div className="meta-left">
            <span className="post-author">By {post.author}</span>
            <span className="post-date">
              Published on {formatDate(post.createdAt)}
            </span>
            {post.updatedAt > post.createdAt && (
              <span className="post-updated">
                Updated on {formatDate(post.updatedAt)}
              </span>
            )}
          </div>
          
          <div className="post-category-badge">
            {getCategoryName(post.category)}
          </div>
        </div>

        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      </header>

      <div className="post-content">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <footer className="post-footer">
        <div className="post-actions">
          <Link to={`/edit-post/${post.id}`} className="btn btn-primary">
            Edit Post
          </Link>
          <button onClick={handleDelete} className="btn btn-danger">
            Delete Post
          </button>
          <Link to="/posts" className="btn btn-secondary">
            Back to All Posts
          </Link>
        </div>
      </footer>
    </article>
  )
}

export default SinglePost