"use client" // Required for client-side React components in Next.js environment

import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar"; // Adjust path as needed
import Header from "../../../components/Header";   // Adjust path as needed
import "../../SupplierRequest/SupplierRequest.css"; // Adjust path as needed

const InactiveSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_IP || "http://localhost:5000"; // Fallback for development

  useEffect(() => {
    fetchInactiveSuppliers();
  }, []);

  const fetchInactiveSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/suppliers/inactive`);
      // Assuming the backend response structure is { message: "...", data: [...] }
      setSuppliers(response.data.data); // Correctly access the 'data' property
    } catch (err) {
      console.error("Failed to fetch inactive suppliers", err);
      setError("Failed to fetch inactive suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${backendUrl}/api/suppliers/activate/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setMessage("Supplier activated successfully!");
      setTimeout(() => setMessage(null), 3000);
      fetchInactiveSuppliers(); // Refresh the list
    } catch (err) {
      console.error("Failed to activate supplier", err);
      setError("Failed to activate supplier");
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <Sidebar />
        <div className="supplier-main-content">
          <Header />
          <div className="supplier-content-main">
            <div className="supplier-loading">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <Sidebar />
      <div className="supplier-main-content">
        <Header />
        <div className="supplier-content-main">
          <div className="supplier-content-box">
            <div className="supplier-header">
              <h2 className="supplier-title">Inactive Suppliers</h2>
              <p className="supplier-subtitle">List of Inactive Suppliers</p>
            </div>
            <div className="supplier-content-container">
              {error && (
                <div className="supplier-message supplier-error">
                  <div className="supplier-message-icon">✕</div>
                  <span>{error}</span>
                </div>
              )}
              {message && (
                <div className="supplier-message supplier-success">
                  <div className="supplier-message-icon">✓</div>
                  <span>{message}</span>
                </div>
              )}
              {suppliers.length > 0 ? (
                <div className="supplier-table-container">
                  <table className="supplier-table">
                    <thead>
                      <tr>
                        <th className="supplier-table-header">Company Name</th>
                        <th className="supplier-table-header">Contact Name</th>
                        <th className="supplier-table-header">Category</th>
                        <th className="supplier-table-header">Reason</th>
                        <th className="supplier-table-header">Activate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map((supplier) => (
                        <tr key={supplier._id} className="supplier-table-row">
                          <td className="supplier-table-cell">{supplier.companyName}</td>
                          <td className="supplier-table-cell">{`${supplier.firstName} ${supplier.lastName}`}</td> {/* Corrected */}
                          <td className="supplier-table-cell">{supplier.category}</td> {/* Corrected */}
                          <td className="supplier-table-cell supplier-reason-cell">
                            {supplier.inactiveReason || "No reason provided"}
                          </td>
                          <td className="supplier-table-cell supplier-action-cell">
                            <button
                              onClick={() => handleActivate(supplier._id)}
                              className="supplier-action-btn supplier-activate-btn"
                              title="Activate Supplier"
                            >
                              👁️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="supplier-empty-state">
                  <p>No inactive suppliers found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InactiveSuppliers;
