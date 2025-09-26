import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar"; 
import Header from "../../../components/Header";   
import "../../SupplierRequest/SupplierRequest.css"; 

const NewSupplierRequest = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = process.env.REACT_APP_BACKEND_IP 

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/suppliers/view`)
      setSuppliers(response.data.data) 
    } catch (err) {
      console.error("Failed to fetch suppliers", err)
      setError("Failed to fetch supplier requests")
    } finally {
      setLoading(false)
    }
  }

  const handleActivate = async (id) => {
    try {
      const token = localStorage.getItem("adminToken"); 
      await axios.put(
        `${backendUrl}/api/suppliers/activate/${id}`,
        {}, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSuppliers(); 
    } catch (err) {
      console.error("Failed to activate supplier", err);
      setError("Failed to activate supplier");
    }
  };

  const handleInactivate = async (id) => {
    try {
      const token = localStorage.getItem("adminToken"); 
      await axios.put(
        `${backendUrl}/api/suppliers/inactivate/${id}`,
        { reason: "Inactivated from New Supplier Requests page" }, 
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchSuppliers(); 
    } catch (err) {
      console.error("Failed to inactivate supplier", err);
      setError("Failed to inactivate supplier");
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
              <h2 className="supplier-title">New Supplier Request</h2>
              <p className="supplier-subtitle">List of New Supplier Requests</p>
            </div>
            <div className="supplier-content-container">
              {error && (
                <div className="supplier-message supplier-error">
                  <div className="supplier-message-icon">✕</div>
                  <span>{error}</span>
                </div>
              )}
              {suppliers.length > 0 ? (
                <div className="supplier-table-container">
                  <table className="supplier-table">
                    <thead>
                      <tr>
                        <th className="supplier-table-header">Company Name</th>
                        <th className="supplier-table-header">Category</th>
                        <th className="supplier-table-header">Country</th>
                        <th className="supplier-table-header">Activate</th>
                        <th className="supplier-table-header">Inactivate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map((supplier) => (
                        <tr key={supplier._id} className="supplier-table-row">
                          <td className="supplier-table-cell">{supplier.companyName}</td>
                          <td className="supplier-table-cell">{supplier.category}</td>
                          <td className="supplier-table-cell">{supplier.country}</td>
                          <td className="supplier-table-cell supplier-action-cell">
                            <button
                              onClick={() => handleActivate(supplier._id)}
                              className={`supplier-action-btn ${supplier.status === "Active" ? "active" : "inactive"}`}
                              disabled={supplier.status !== "Pending"}
                            >
                              {supplier.status === "Active" ? "✓" : "○"}
                            </button>
                          </td>
                          <td className="supplier-table-cell supplier-action-cell">
                            <button
                              onClick={() => handleInactivate(supplier._id)}
                              className={`supplier-action-btn ${supplier.status === "Inactive" ? "active" : "inactive"}`}
                              disabled={supplier.status !== "Pending"}
                            >
                              {supplier.status === "Inactive" ? "✓" : "○"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="supplier-empty-state">
                  <p>No new supplier requests found with 'Pending' status.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSupplierRequest;

