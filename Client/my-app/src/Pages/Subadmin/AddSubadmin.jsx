import React, { useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./AddSubadmin.css";

function AddSubadmin() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_IP;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
const token = localStorage.getItem("token");
console.log("Token in frontend:", token); // ADD THIS

      const response = await axios.post(
        `${backendUrl}/api/admin/subadmin`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(`Subadmin "${response.data.username}" added successfully.`);
      setFormData({ username: "", email: "", password: "" });
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong.";
      setError(errorMsg);
    }
  };

  return (
    <div className="addsubadmin-container">
      <Sidebar />

      <div className="addsubadmin-main-content">
        <Header />

        <div className="addsubadmin-content-main">
          <div className="addsubadmin-content-box">
            <div className="addsubadmin-header">
              <h2 className="addsubadmin-title">Add Subadmin</h2>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="username"
                placeholder="Enter subadmin username..."
                className="addsubadmin-input"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <input
                type="email"
                name="email"
                placeholder="Enter subadmin email..."
                className="addsubadmin-input"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <input
                type="password"
                name="password"
                placeholder="Enter password..."
                className="addsubadmin-input"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="submit"
                className="addsubadmin-btn addsubadmin-btn-primary addsubadmin-mt-6"
              >
                Create Subadmin
              </button>
            </form>

            {message && <p className="addsubadmin-success">{message}</p>}
            {error && <p className="addsubadmin-error">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddSubadmin;
