"use client"

import { useState, useEffect } from "react" // Import useEffect
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "./AddCategory.css"

function AddCategory() {
  const [category, setCategory] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const backendUrl = process.env.REACT_APP_BACKEND_IP

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      const response = await axios.post(`${backendUrl}/api/category/add`, { category })
      setMessage(`Category "${response.data.category}" added successfully.`)
      setCategory("")
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong."
      setError(errorMsg)
    }
  }

  // Effect to clear messages after 10 seconds
  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null)
        setError(null)
      }, 10000) // 10 seconds

      return () => clearTimeout(timer) // Clean up the timer
    }
  }, [message, error]) // Re-run effect when message or error changes

  return (
    <div className="addcategory-container">
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="addcategory-main-content">
        <Header />
        <div className="addcategory-content-main">
          <div className="addcategory-content-box">
            <div className="addcategory-header">
              <h2 className="addcategory-title">Add New Category</h2>
            </div>
            <form onSubmit={handleSubmit} className="addcategory-form">
              <div className="addcategory-form-group">
                <label htmlFor="category-name" className="addcategory-label">
                  Category Name
                </label>
                <input
                  type="text"
                  id="category-name"
                  placeholder="e.g., Electronics, Clothing, Books"
                  className="addcategory-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="addcategory-btn addcategory-btn-primary">
                Submit Category
              </button>
            </form>
            {message && (
              <div className="addcategory-message addcategory-success">
                <div className="addcategory-message-icon">✓</div>
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="addcategory-message addcategory-error">
                <div className="addcategory-message-icon">✕</div>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCategory
