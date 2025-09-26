import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar"; 
import Header from "../../../components/Header";   
import "../../SupplierRequest/SupplierRequest.css"; 

const ActiveSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const backendUrl = process.env.REACT_APP_BACKEND_IP 

  useEffect(() => {
    fetchActiveSuppliers();
  }, []);

  const fetchActiveSuppliers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/suppliers/active`);
 
      setSuppliers(response.data.data); 
    } catch (err) {
      console.error("Failed to fetch active suppliers", err);
      setError("Failed to fetch active suppliers");
    } finally {
      setLoading(false);
    }
  };

  const handleInactivateClick = (supplier) => {
    setSelectedSupplier(supplier);
    setShowModal(true);
    setReason("");
  };

  const handleInactivateSubmit = async () => {
    if (!reason.trim()) {
      setError("Please provide a reason for inactivation");
      return;
    }
    try {
      setSubmitting(true);
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${backendUrl}/api/suppliers/inactivate/${selectedSupplier._id}`,
        { reason: reason.trim() },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setShowModal(false);
      setSelectedSupplier(null);
      setReason("");
      fetchActiveSuppliers(); // Refresh the list
    } catch (err) {
      console.error("Failed to inactivate supplier", err);
      setError("Failed to inactivate supplier");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSupplier(null);
    setReason("");
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
              <h2 className="supplier-title">Active Suppliers</h2>
              <p className="supplier-subtitle">List of Active Suppliers</p>
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
                        <th className="supplier-table-header">Contact Name</th>
                        <th className="supplier-table-header">Category</th>
                        <th className="supplier-table-header">E-mail</th>
                        <th className="supplier-table-header">Inactivate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suppliers.map((supplier) => (
                        <tr key={supplier._id} className="supplier-table-row">
                          <td className="supplier-table-cell">{supplier.companyName}</td>
                          <td className="supplier-table-cell">{`${supplier.firstName} ${supplier.lastName}`}</td> 
                          <td className="supplier-table-cell">{supplier.category}</td> 
                          <td className="supplier-table-cell">{supplier.emailAddress}</td> 
                          <td className="supplier-table-cell supplier-action-cell">
                            <button
                              onClick={() => handleInactivateClick(supplier)}
                              className="supplier-action-btn supplier-inactivate-btn"
                              title="Inactivate Supplier"
                            >
                              👁️‍🗨️
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="supplier-empty-state">
                  <p>No active suppliers found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal for inactivation reason */}
      {showModal && (
        <div className="supplier-modal-overlay">
          <div className="supplier-modal">
            <div className="supplier-modal-header">
              <h3>Inactivate Supplier</h3>
              <button onClick={closeModal} className="supplier-modal-close">
                ×
              </button>
            </div>
            <div className="supplier-modal-body">
              <p>
                Please provide a reason for inactivating <strong>{selectedSupplier?.companyName}</strong>:
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for inactivation..."
                className="supplier-modal-textarea"
                rows="4"
              />
            </div>
            <div className="supplier-modal-footer">
              <button onClick={closeModal} className="supplier-btn supplier-btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleInactivateSubmit}
                className="supplier-btn supplier-btn-danger"
                disabled={submitting || !reason.trim()}
              >
                {submitting ? "Submitting..." : "Inactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveSuppliers;
