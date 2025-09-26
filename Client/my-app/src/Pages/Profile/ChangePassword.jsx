import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_IP;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${backendUrl}/api/admin/change-password`,
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Password changed successfully.");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong.";
      setError(errorMsg);
    }
  };

  return (
    <div className="changepassword-container">
      <Sidebar />

      <div className="changepassword-main-content">
        <Header />

        <div className="changepassword-content-main">
          <div className="changepassword-content-box">
            <div className="changepassword-header">
              <h2 className="changepassword-title">Change Password</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                name="oldPassword"
                placeholder="Enter Old Password"
                className="changepassword-input"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="newPassword"
                placeholder="Enter New Password"
                className="changepassword-input"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Enter Confirm New Password"
                className="changepassword-input"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="changepassword-btn changepassword-btn-primary changepassword-mt-6"
              >
                Submit
              </button>
            </form>

            {message && <p className="changepassword-success">{message}</p>}
            {error && <p className="changepassword-error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
