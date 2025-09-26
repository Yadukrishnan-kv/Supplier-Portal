"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "./AddSubCategory.css"

function AddSubCategory() {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const backendUrl = process.env.REACT_APP_BACKEND_IP

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/view`)
        setCategories(response.data)
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }
    fetchCategories()
  }, [backendUrl])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setError(null)
    try {
      const response = await axios.post(`${backendUrl}/api/subcategory/add`, {
        category: selectedCategory,
        subCategory,
      })
      setMessage(`Sub Category "${response.data.subCategory}" added successfully.`)
      setSelectedCategory("")
      setSubCategory("")
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
    <div className="addsubcategory-container">
      <Sidebar />
      <div className="addsubcategory-main-content">
        <Header />
        <div className="addsubcategory-content-main">
          <div className="addsubcategory-content-box">
            <div className="addsubcategory-header">
              <h2 className="addsubcategory-title">Add Sub Category</h2>
            </div>
            <form onSubmit={handleSubmit} className="addsubcategory-form">
              <div className="addsubcategory-form-group">
                <label htmlFor="category-select" className="addsubcategory-label">
                  Select Category
                </label>
                <select
                  id="category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="addsubcategory-input"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.category}>
                      {cat.category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="addsubcategory-form-group">
                <label htmlFor="subcategory-name" className="addsubcategory-label">
                  Sub Category Name
                </label>
                <input
                  type="text"
                  id="subcategory-name"
                  placeholder="e.g., Smartphones, T-Shirts, Fiction"
                  className="addsubcategory-input"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="addsubcategory-btn addsubcategory-btn-primary">
                Add Sub Category
              </button>
            </form>
            {message && (
              <div className="addsubcategory-message addsubcategory-success">
                <div className="addsubcategory-message-icon">✓</div>
                <span>{message}</span>
              </div>
            )}
            {error && (
              <div className="addsubcategory-message addsubcategory-error">
                <div className="addsubcategory-message-icon">✕</div>
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddSubCategory
