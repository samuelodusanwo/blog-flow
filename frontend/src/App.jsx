import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { BlogProvider } from './context/BlogContext'
import Layout from './components/Layout/Layout'
import PostList from './components/Posts/PostList'
import SinglePost from './components/Posts/SinglePost'
import PostForm from './components/Posts/PostForm'
import CategoryList from './components/Categories/CategoryList'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

function App() {
  return (
    <BlogProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<PostList />} />
            <Route path="/posts" element={<PostList />} />
            <Route path="/posts/:id" element={<SinglePost />} />
            <Route path="/create-post" element={<PostForm />} />
            <Route path="/edit-post/:id" element={<PostForm />} />
            <Route path="/categories" element={<CategoryList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </Router>
    </BlogProvider>
  )
}

export default App