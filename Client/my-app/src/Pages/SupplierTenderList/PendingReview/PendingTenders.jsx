"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./PendingTenders.css";
import SupplierSidebar from "../../../components/SupplierSidebar";
import { jwtDecode } from "jwt-decode";
import Header from "../../../components/Header";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const PendingTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTenders();
  }, []);

  const fetchTenders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("No token found");

      const decoded = jwtDecode(token);
      const supplierId = decoded.id;

      const res = await axios.get(
        `${backendUrl}/api/suppliers/supplier/${supplierId}/pending`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTenders(res.data.data || []);
    } catch (err) {
      console.error("Error fetching pending tenders:", err);
      setError("Failed to load pending tenders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="PendingTenders-container">
        <SupplierSidebar />
        <div className="PendingTenders-main-content">
          <Header />
          <div className="PendingTenders-content-main">
            <div className="PendingTenders-content-box">
              <div className="PendingTenders-header">
                <h2 className="PendingTenders-title">Pending Tenders</h2>
              </div>
              <p className="PendingTenders-message">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="PendingTenders-container">
      <SupplierSidebar />
      <div className="PendingTenders-main-content">
        <Header />
        <div className="PendingTenders-content-main">
          <div className="PendingTenders-content-box">
            <div className="PendingTenders-header">
              <h2 className="PendingTenders-title">Pending Tenders</h2>
            </div>

            {error && <p className="PendingTenders-message PendingTenders-error">{error}</p>}

            {tenders.length === 0 ? (
              <p className="PendingTenders-empty-state">No pending tenders found.</p>
            ) : (
              <div className="PendingTenders-table-container">
                <table className="PendingTenders-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>ORGANISATION</th>
                      <th>PUBLISHING DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender) => (
                      <tr key={tender._id}>
                        <td data-label="PROJECT NAME">{tender.projectName}</td>
                        <td data-label="ORGANISATION">{tender.organisation}</td>
                        <td data-label="PUBLISHING DATE">
                          {new Date(tender.publishingDate).toLocaleDateString()}
                        </td>
                        <td data-label="STATUS">
                          <span className="PendingTenders-status PendingTenders-status-pending">
                            Pending
                          </span>
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

export default PendingTenders;