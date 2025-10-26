import React, { createContext, useContext, useState, useEffect } from 'react';
import { postsAPI, categoriesAPI, authAPI } from '../services/api';

const BlogContext = createContext();

export const BlogProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Load initial data
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      checkAuth();
    }
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([loadPosts(), loadCategories()]);
    } catch (error) {
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.data.data);
    } catch (error) {
      logout();
    }
  };

  // ✅ FIXED: Complete Auth Functions
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.login(credentials);
      const { token, data: userData } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, data: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authAPI.register(userData);
      const { token, data: newUser } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true, data: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPosts([]);
    setCategories([]);
  };

  // ✅ FIXED: Complete Post Functions
  const loadPosts = async (params = {}) => {
    try {
      setLoading(true);
      const response = await postsAPI.getAll(params);
      setPosts(response.data.data);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load posts';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getPostById = async (id) => {
    try {
      setLoading(true);
      const response = await postsAPI.getById(id);
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load post';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.create(postData);
      const newPost = response.data.data;
      
      // Optimistic update
      setPosts(prev => [newPost, ...prev]);
      return { success: true, data: newPost };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create post';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Update Post with Real API
  const updatePost = async (id, postData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await postsAPI.update(id, postData);
      const updatedPost = response.data.data;
      
      // Update in local state
      setPosts(prev => prev.map(post => 
        post._id === id ? updatedPost : post
      ));
      return { success: true, data: updatedPost };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update post';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Delete Post with Real API
  const deletePost = async (id) => {
    try {
      setLoading(true);
      setError(null);
      await postsAPI.delete(id);
      
      // Remove from local state
      setPosts(prev => prev.filter(post => post._id !== id));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to delete post';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED: Complete Category Functions
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      setCategories(response.data.data);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to load categories';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await categoriesAPI.create(categoryData);
      const newCategory = response.data.data;
      
      // Add to local state
      setCategories(prev => [...prev, newCategory]);
      return { success: true, data: newCategory };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to create category';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // State
    posts,
    categories,
    loading,
    error,
    user,
    
    // Auth actions
    login,
    register,
    logout,
    
    // Post actions
    loadPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
    
    // Category actions
    loadCategories,
    createCategory,
    
    // Utility
    clearError: () => setError(null),
  };

  return (
    <BlogContext.Provider value={value}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};