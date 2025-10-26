import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../../context/BlogContext';
import './PostList.css';

const PostList = () => {
  const { posts, categories, loading, error, deletePost, loadPosts } = useBlog();

  useEffect(() => {
    loadPosts(); // Load posts from API when component mounts
  }, []);

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category.name : 'Uncategorized';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(postId);
      if (!result.success) {
        alert('Failed to delete post: ' + result.error);
      }
    }
  };

  if (loading && posts.length === 0) {
    return <div className="loading">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="error-state">
        <h2>Error loading posts</h2>
        <p>{error}</p>
        <button onClick={() => loadPosts()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="post-list-header">
        <h1>Blog Posts</h1>
        <Link to="/create-post" className="btn btn-primary">
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="empty-state">
          <h2>No posts yet</h2>
          <p>Be the first to create a blog post!</p>
          <Link to="/create-post" className="btn btn-primary">
            Create Your First Post
          </Link>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <article key={post._id} className="post-card">
              <div className="post-card-header">
                <h2 className="post-title">
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h2>
                <div className="post-meta">
                  <span className="post-author">By {post.author?.username || 'Unknown'}</span>
                  <span className="post-date">{formatDate(post.createdAt)}</span>
                </div>
              </div>
              
              <div className="post-category">
                {getCategoryName(post.category)}
              </div>
              
              <p className="post-excerpt">{post.excerpt}</p>
              
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag._id || tag} className="tag">
                      {typeof tag === 'object' ? tag.name : tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="post-actions">
                <Link to={`/posts/${post._id}`} className="btn btn-secondary">
                  Read More
                </Link>
                <Link to={`/edit-post/${post._id}`} className="btn btn-outline">
                  Edit
                </Link>
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="btn btn-danger"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostList;