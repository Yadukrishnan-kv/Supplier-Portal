"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./MyQuotations.css";
import Header from "../../../components/Header";
import SupplierSidebar from "../../../components/SupplierSidebar";

const backendUrl = process.env.REACT_APP_BACKEND_IP || "http://localhost:4000";

const MyQuotations = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null); // interestedSuppliers._id
  const [editingTenderId, setEditingTenderId] = useState(""); // tender._id
  const [editForm, setEditForm] = useState("");
  const [supplierId, setSupplierId] = useState(null);

  // Step 1: Get supplier profile to extract _id
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          setError("Not authenticated. Please log in.");
          setLoading(false);
          return;
        }

        const res = await axios.get(`${backendUrl}/api/suppliers/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = res.data.data;
        if (!profile?._id) {
          setError("Supplier profile not found or invalid.");
          return;
        }

        setSupplierId(profile._id); // ✅ Got real MongoDB ObjectId string
      } catch (err) {
        console.error("Error fetching supplier profile:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load your profile. Please log in again."
        );
      }
    };

    fetchProfile();
  }, []);

  // Step 2: Fetch quotations once supplierId is available
  useEffect(() => {
    if (!supplierId) return;

    const fetchQuotations = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("adminToken");

        const res = await axios.get(
          `${backendUrl}/api/tenders/supplier/${supplierId}/quotations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setQuotations(res.data.data || []);
      } catch (err) {
        console.error("Error fetching quotations:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load your quotations. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuotations();
  }, [supplierId]);

  // Handle edit click
  const handleEditClick = (quote) => {
    setEditingId(quote._id);
    setEditingTenderId(quote.tenderId);
    setEditForm(
      typeof quote.quotation === "string"
        ? quote.quotation
        : JSON.stringify(quote.quotation, null, 2)
    );
  };

  // Save edited quotation
  const handleSaveEdit = async () => {
    if (!editingTenderId || !editingId || !editForm.trim()) {
      alert("Quotation cannot be empty.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${backendUrl}/api/tenders/${editingTenderId}/supplier/${supplierId}/quotation/${editingId}`,
        { quotation: editForm },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("Quotation updated successfully!");

      // Refresh list
      const res = await axios.get(
        `${backendUrl}/api/tenders/supplier/${supplierId}/quotations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setQuotations(res.data.data || []);
      setEditingId(null);
      setEditingTenderId("");
      setEditForm("");
    } catch (err) {
      console.error("Error saving quotation:", err);
      alert(err.response?.data?.message || "Failed to update quotation.");
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTenderId("");
    setEditForm("");
  };

  return (
    <div className="my-quotations-container">
      <SupplierSidebar />
      <div className="my-quotations-main-content">
        <Header />
        <div className="my-quotations-content-main">
          <div className="my-quotations-content-box">
            <div className="my-quotations-header">
              <h2 className="my-quotations-title">My Quotations</h2>
            </div>

            {/* Error Message */}
            {error && (
              <p className="my-quotations-message my-quotations-error">{error}</p>
            )}

            {/* Loading */}
            {loading ? (
              <p className="my-quotations-message">Loading your quotations...</p>
            ) : quotations.length === 0 ? (
              <p className="my-quotations-empty-state">
                You haven't sent any quotations yet.
              </p>
            ) : (
              <div className="my-quotations-table-container">
                <table className="my-quotations-table">
                  <thead>
                    <tr>
                      <th>Project Code</th>
                      <th>Project Title</th>
                      <th>Publishing Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quotations.map((quote) => (
                      <tr key={quote._id}>
                        <td>{quote.projectCode}</td>
                        <td>{quote.projectTitle}</td>
                        <td>
                          {new Date(quote.publishingDate).toLocaleDateString()}
                        </td>
                        <td>
                          <span
                            className={`status-badge status-${quote.status.toLowerCase()}`}
                          >
                            {quote.status}
                          </span>
                        </td>
                        <td className="my-quotations-actions">
                          {editingId === quote._id ? (
                            <div className="edit-controls">
                              <textarea
                                value={editForm}
                                onChange={(e) => setEditForm(e.target.value)}
                                rows="5"
                                className="edit-textarea"
                                placeholder="Enter updated quotation (text or JSON)"
                              />
                              <div className="edit-buttons">
                                <button onClick={handleSaveEdit} className="btn-save">
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="btn-cancel"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleEditClick(quote)}
                              className="action-btn edit"
                              disabled={quote.status !== "Approved"}
                            >
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyQuotations;