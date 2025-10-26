import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useBlog } from '../../context/BlogContext'
import './Layout.css'

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useBlog();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="container">
          <Link to="/" className="logo">
            BlogApp
          </Link>
          <nav className="nav">
            <Link 
              to="/posts" 
              className={location.pathname === '/posts' ? 'nav-link active' : 'nav-link'}
            >
              All Posts
            </Link>
            <Link 
              to="/create-post" 
              className={location.pathname === '/create-post' ? 'nav-link active' : 'nav-link'}
            >
              Write Post
            </Link>
            <Link 
              to="/categories" 
              className={location.pathname === '/categories' ? 'nav-link active' : 'nav-link'}
            >
              Categories
            </Link>
          </nav>
          
          <div className="user-section">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">Hello, {user.username}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {children}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2023 BlogApp. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout