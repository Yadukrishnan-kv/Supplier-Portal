"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./InterestReceived.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const InterestReceived = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const fetchInterestedTenders = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await axios.get(`${backendUrl}/api/tenders/interested`);

    // ✅ Safely access res.data.data
    const tendersData = res.data?.data;

    if (!Array.isArray(tendersData)) {
      console.warn("Expected array in res.data.data, got:", tendersData);
      setTenders([]);
      return;
    }

    const formattedTenders = tendersData.flatMap((tender) => {
      // ✅ Ensure interestedSuppliers is an array
      const suppliers = Array.isArray(tender.interestedSuppliers) ? tender.interestedSuppliers : [];
      return suppliers.map((supplier) => ({
        tenderId: tender._id,
        projectName: tender.projectName,
        organisation: tender.organisation,
        supplier: supplier.supplierName,
        publishingDate: tender.publishingDate,
        supplierId: supplier._id, // Use supplier._id since supplierId is null
        status: supplier.status,
      }));
    });

    setTenders(formattedTenders);
  } catch (err) {
    console.error("Error fetching interested tenders:", err);
    console.error("Response:", err.response); // 🔥 Add this to see real error
    setError("Failed to fetch interested tenders. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const handleUpdateStatus = async (tenderId, supplierId, newStatus) => {
    const confirmMsg = `Are you sure you want to ${newStatus.toLowerCase()} this supplier's interest?`;
    if (!window.confirm(confirmMsg)) return;

    try {
      await axios.put(
        `${backendUrl}/api/tenders/${tenderId}/supplier/${supplierId}/status`,
        { status: newStatus }
      );

      // Update UI optimistically
      setTenders((prev) =>
        prev.map((tender) =>
          tender.tenderId === tenderId && tender.supplierId === supplierId
            ? { ...tender, status: newStatus }
            : tender
        )
      );

      alert(`Interest ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      console.error(`Error updating status to ${newStatus}:`, err);
      alert(
        err.response?.data?.message ||
        `Failed to ${newStatus.toLowerCase()} interest. Please try again.`
      );
    }
  };

  useEffect(() => {
    fetchInterestedTenders();
  }, []);

  return (
    <div className="InterestReceived-container">
      <Sidebar />
      <div className="InterestReceived-main-content">
        <Header />
        <div className="InterestReceived-content-main">
          <div className="InterestReceived-content-box">
            <div className="InterestReceived-header">
              <h2 className="InterestReceived-title">Interested Suppliers</h2>
            </div>

            {loading && (
              <p className="InterestReceived-message">Loading interested suppliers...</p>
            )}

            {error && (
              <p className="InterestReceived-message InterestReceived-error">{error}</p>
            )}

            {!loading && tenders.length === 0 && !error && (
              <p className="InterestReceived-empty-state">No interested suppliers found.</p>
            )}

            {!loading && tenders.length > 0 && (
              <div className="InterestReceived-table-container">
                <table className="InterestReceived-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>ORGANISATION</th>
                      <th>SUPPLIER</th>
                      <th>PUBLISHING DATE</th>
                      
                      <th className="InterestReceived-action-col">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender) => (
                      <tr key={`${tender.tenderId}-${tender.supplierId}`}>
                        <td>{tender.projectName}</td>
                        <td>{tender.organisation}</td>
                        <td>{tender.supplier}</td>
                        <td>{new Date(tender.publishingDate).toLocaleDateString()}</td>
                       
                        <td className="InterestReceived-actions">
                          {/* Approve Button */}
                          {tender.status === "Approved" ? (
                            <button
                              className="InterestReceived-icon-btn"
                              disabled
                              style={{
                                backgroundColor: "#2c3e50",
                                color: "white",
                                opacity: 1,
                              }}
                            >
                              Approved
                            </button>
                          ) : (
                            <button
                              className="InterestReceived-icon-btn"
                              onClick={() =>
                                handleUpdateStatus(tender.tenderId, tender.supplierId, "Approved")
                              }
                              style={{
                                backgroundColor: "#27ae60",
                                color: "white",
                              }}
                            >
                              Approve
                            </button>
                          )}

                          {/* Reject Button */}
                          {tender.status === "Rejected" ? (
                            <button
                              className="InterestReceived-icon-btn"
                              disabled
                              style={{
                                backgroundColor: "#e74c3c",
                                color: "white",
                                opacity: 1,
                              }}
                            >
                              Rejected
                            </button>
                          ) : (
                            <button
                              className="InterestReceived-icon-btn"
                              onClick={() =>
                                handleUpdateStatus(tender.tenderId, tender.supplierId, "Rejected")
                              }
                              style={{
                                backgroundColor: "#95a5a6",
                                color: "white",
                              }}
                            >
                              Reject
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

export default InterestReceived;