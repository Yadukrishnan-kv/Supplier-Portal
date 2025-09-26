"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import "./Profile.css"

// Custom edit icon as SVG component
const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)

const backendUrl = process.env.REACT_APP_BACKEND_IP

const Profile = () => {
  const [adminData, setAdminData] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
  })

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const res = await axios.get(`${backendUrl}/api/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAdminData(res.data)
      setFormData({
        username: res.data.username,
        email: res.data.email,
      })
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(`${backendUrl}/api/admin/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setEditMode(false)
      fetchProfile()
    } catch (err) {
      console.error("Update failed:", err)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  if (!adminData) return null

  return (
    <div className="Profile-container">
      <Sidebar />
      <div className="Profile-main-content">
        <Header />
        <div className="Profile-content-main">
          <div className="Profile-content-box">
            <div className="Profile-header">
              <h2 className="Profile-title">Admin Profile</h2>
              <button className="Profile-icon-btn Profile-edit" onClick={() => setEditMode(!editMode)}>
                <EditIcon />
              </button>
            </div>
            <div className="Profile-content-container">
              {editMode ? (
                <div className="Profile-form">
                  <div className="Profile-form-group">
                    <label>Username:</label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="Profile-input"
                    />
                  </div>
                  <div className="Profile-form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="Profile-input"
                    />
                  </div>
                  <div className="Profile-form-group">
                    <label>Role:</label>
                    <input
                      type="text"
                      value={adminData.role}
                      disabled
                      className="Profile-input Profile-input-disabled"
                    />
                  </div>
                  <button className="Profile-btn Profile-btn-success" onClick={handleUpdateProfile}>
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="Profile-info">
                  <div className="Profile-info-item">
                    <span className="Profile-info-label">Username:</span>
                    <span className="Profile-info-value">{adminData.username}</span>
                  </div>
                  <div className="Profile-info-item">
                    <span className="Profile-info-label">Email:</span>
                    <span className="Profile-info-value">{adminData.email}</span>
                  </div>
                  <div className="Profile-info-item">
                    <span className="Profile-info-label">Role:</span>
                    <span className="Profile-info-value Profile-role-badge">{adminData.role}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
