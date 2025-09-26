"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./RejectedTenders.css";
import SupplierSidebar from "../../../components/SupplierSidebar";
import { jwtDecode } from "jwt-decode";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const RejectedTenders = () => {
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
        `${backendUrl}/api/suppliers/supplier/${supplierId}/rejected`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTenders(res.data || []);
    } catch (err) {
      console.error("Error fetching rejected tenders:", err);
      setError("Failed to load rejected tenders.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="RejectedTenders-container">
        <SupplierSidebar />
        <div className="RejectedTenders-main-content">
          <div className="RejectedTenders-content-main">
            <div className="RejectedTenders-content-box">
              <div className="RejectedTenders-header">
                <h2 className="RejectedTenders-title">Rejected Tenders</h2>
              </div>
              <p className="RejectedTenders-message">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="RejectedTenders-container">
      <SupplierSidebar />
      <div className="RejectedTenders-main-content">
        <div className="RejectedTenders-content-main">
          <div className="RejectedTenders-content-box">
            <div className="RejectedTenders-header">
              <h2 className="RejectedTenders-title">Rejected Tenders</h2>
            </div>

            {error && <p className="RejectedTenders-message RejectedTenders-error">{error}</p>}

            {tenders.length === 0 ? (
              <p className="RejectedTenders-empty-state">No rejected tenders found.</p>
            ) : (
              <div className="RejectedTenders-table-container">
                <table className="RejectedTenders-table">
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
                        <td>{tender.projectName}</td>
                        <td>{tender.organisation}</td>
                        <td>{new Date(tender.publishingDate).toLocaleDateString()}</td>
                        <td>
                          <span className="RejectedTenders-status RejectedTenders-status-rejected">
                            Rejected
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

export default RejectedTenders;