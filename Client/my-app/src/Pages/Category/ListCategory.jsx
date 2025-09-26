"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./ListCategory.css"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import { Link } from "react-router-dom"

// Custom icons as SVG components
const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
)

const backendUrl = process.env.REACT_APP_BACKEND_IP

const ListCategory = () => {
  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editedCategory, setEditedCategory] = useState("")

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/category/view`)
      setCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/category/delete/${id}`)
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdateCategory = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/category/update/${id}`, {
        category: editedCategory,
      })
      setEditingId(null)
      setEditedCategory("")
      fetchCategories()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <div className="ListCategory-container">
      <Sidebar />
      <div className="ListCategory-main-content">
        <Header />
        <div className="ListCategory-content-main">
          <div className="ListCategory-content-box">
            <div className="ListCategory-header">
              <h2 className="ListCategory-title">Category List</h2>
              <Link to={"/addCategory"}>
                <button className="ListCategory-btn ListCategory-btn-primary">Add Category</button>
              </Link>
            </div>
            <div className="ListCategory-table-container">
              <table className="ListCategory-table">
                <thead>
                  <tr>
                    <th>CATEGORY NAME</th>
                    <th className="ListCategory-action-col">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat._id}>
                      <td>
                        {editingId === cat._id ? (
                          <input
                            type="text"
                            value={editedCategory}
                            onChange={(e) => setEditedCategory(e.target.value)}
                            className="ListCategory-input"
                          />
                        ) : (
                          cat.category
                        )}
                      </td>
                      <td className="ListCategory-actions">
                        {editingId === cat._id ? (
                          <button
                            onClick={() => handleUpdateCategory(cat._id)}
                            className="ListCategory-btn ListCategory-btn-success"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(cat._id)
                              setEditedCategory(cat.category)
                            }}
                            className="ListCategory-icon-btn ListCategory-edit"
                          >
                            <EditIcon />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="ListCategory-icon-btn ListCategory-delete"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListCategory
