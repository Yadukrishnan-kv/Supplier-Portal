"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import "./ListSubCategory.css"
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

const ListSubCategory = () => {
  const [subCategories, setSubCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editedSubCategory, setEditedSubCategory] = useState("")
  const [editedCategory, setEditedCategory] = useState("")

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/subcategory/view`)
      setSubCategories(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/subcategory/delete/${id}`)
      fetchSubCategories()
    } catch (err) {
      console.error(err)
    }
  }

  const handleUpdate = async (id) => {
    try {
      await axios.put(`${backendUrl}/api/subcategory/update/${id}`, {
        category: editedCategory,
        subCategory: editedSubCategory,
      })
      setEditingId(null)
      setEditedSubCategory("")
      setEditedCategory("")
      fetchSubCategories()
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchSubCategories()
  }, [])

  return (
    <div className="ListSubCategory-container">
      <Sidebar />
      <div className="ListSubCategory-main-content">
        <Header />
        <div className="ListSubCategory-content-main">
          <div className="ListSubCategory-content-box">
            <div className="ListSubCategory-header">
              <h2 className="ListSubCategory-title">Sub Category List</h2>
              <Link to={"/addSubCategory"}>
                <button className="ListSubCategory-btn ListSubCategory-btn-primary">Add Sub Category</button>
              </Link>
            </div>
            <div className="ListSubCategory-table-container">
              <table className="ListSubCategory-table">
                <thead>
                  <tr>
                    <th>CATEGORY</th>
                    <th>SUB CATEGORY</th>
                    <th className="ListSubCategory-action-col">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {subCategories.map((item) => (
                    <tr key={item._id}>
                      <td>
                        {editingId === item._id ? (
                          <input
                            type="text"
                            value={editedCategory}
                            onChange={(e) => setEditedCategory(e.target.value)}
                            className="ListSubCategory-input"
                          />
                        ) : (
                          item.category
                        )}
                      </td>
                      <td>
                        {editingId === item._id ? (
                          <input
                            type="text"
                            value={editedSubCategory}
                            onChange={(e) => setEditedSubCategory(e.target.value)}
                            className="ListSubCategory-input"
                          />
                        ) : (
                          item.subCategory
                        )}
                      </td>
                      <td className="ListSubCategory-actions">
                        {editingId === item._id ? (
                          <button
                            onClick={() => handleUpdate(item._id)}
                            className="ListSubCategory-btn ListSubCategory-btn-success"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(item._id)
                              setEditedCategory(item.category)
                              setEditedSubCategory(item.subCategory)
                            }}
                            className="ListSubCategory-icon-btn ListSubCategory-edit"
                          >
                            <EditIcon />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="ListSubCategory-icon-btn ListSubCategory-delete"
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

export default ListSubCategory
