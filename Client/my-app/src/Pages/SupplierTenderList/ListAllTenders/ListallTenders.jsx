"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Make sure to install: npm install jwt-decode
import "./ListallTenders.css";
import SupplierSidebar from "../../../components/SupplierSidebar";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const ListallTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [supplierCategory, setSupplierCategory] = useState("");
  const [supplierId, setSupplierId] = useState(""); // Store supplier ID from token

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setSupplierId(decoded.id); // assuming JWT has `id` field for supplier
      } catch (err) {
        console.error("Failed to decode token:", err);
        setError("Invalid authentication token.");
        setLoading(false);
      }
    } else {
      setError("No authentication token found.");
      setLoading(false);
    }

    fetchSupplierAndTenders();
  }, []);

  const fetchSupplierAndTenders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");

      const profileRes = await axios.get(`${backendUrl}/api/suppliers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const supplier = profileRes.data.data;
      if (!supplier?.category) {
        setError("Your profile is missing a category. Please update your profile.");
        setTenders([]);
        return;
      }

      setSupplierCategory(supplier.category);

      const tendersRes = await axios.get(
        `${backendUrl}/api/tenders/category/${encodeURIComponent(supplier.category)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTenders(tendersRes.data.data || []);
    } catch (err) {
      console.error("Error fetching supplier or tenders:", err);
      if (err.response?.status === 403) {
        setError("Access denied. Please log in again.");
      } else if (err.response?.status === 404) {
        setError("No tenders found for your category.");
        setTenders([]);
      } else {
        setError("Failed to load tenders. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleExpressInterest = async (tenderId) => {
    if (!supplierId) {
      alert("Authentication error: Supplier ID not found.");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const profileRes = await axios.get(`${backendUrl}/api/suppliers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const supplierName = profileRes.data.data.companyName; // or businessName

      await axios.post(
        `${backendUrl}/api/suppliers/${tenderId}/interest`,
        { supplierId, supplierName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Optimistically update UI
      setTenders((prev) =>
        prev.map((tender) =>
          tender._id === tenderId
            ? {
                ...tender,
                interestedSuppliers: [
                  ...(tender.interestedSuppliers || []),
                  { supplierId, supplierName, status: "Pending", interestedDate: new Date() },
                ],
              }
            : tender
        )
      );

      alert("Interest expressed successfully!");
    } catch (err) {
      console.error("Error expressing interest:", err);
      if (err.response?.status === 400) {
        alert("You have already expressed interest in this tender.");
      } else {
        alert("Failed to express interest. Please try again.");
      }
    }
  };

  const getInterestStatus = (tender) => {
    if (!tender.interestedSuppliers || !Array.isArray(tender.interestedSuppliers)) return null;

    const myInterest = tender.interestedSuppliers.find(
      (sup) => sup.supplierId?.toString() === supplierId
    );

    return myInterest ? myInterest.status : null;
  };

  if (loading) {
    return (
      <div className="ListallTenders-container">
        <SupplierSidebar />
        <div className="ListallTenders-main-content">
          <div className="ListallTenders-content-main">
            <div className="ListallTenders-content-box">
              <div className="ListallTenders-header">
                <h2 className="ListallTenders-title">List of RFQ/RFP</h2>
              </div>
              <p className="ListallTenders-message">Loading your tenders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ListallTenders-container">
      <SupplierSidebar />
      <div className="ListallTenders-main-content">
        <div className="ListallTenders-content-main">
          <div className="ListallTenders-content-box">
            <div className="ListallTenders-header">
              <h2 className="ListallTenders-title">List of RFQ/RFP</h2>
              
            </div>

            {error && (
              <p className="ListallTenders-message ListallTenders-error">{error}</p>
            )}

            {tenders.length === 0 ? (
              <p className="ListallTenders-empty-state">
                No tenders available for your category yet.
              </p>
            ) : (
              <div className="ListallTenders-table-container">
                <table className="ListallTenders-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>ORGANISATION</th>
                      <th>PUBLISHING DATE</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender) => {
                      const status = getInterestStatus(tender);
                      return (
                        <tr key={tender._id}>
                          <td>{tender.projectName}</td>
                          <td>{tender.organisation}</td>
                          <td>{new Date(tender.publishingDate).toLocaleDateString()}</td>
                          <td className="ListallTenders-status">
                            {status ? (
                              <span
                                className={`ListallTenders-status-badge ListallTenders-status-${status.toLowerCase()}`}
                              >
                                {status}
                              </span>
                            ) : (
                              <button
                                onClick={() => handleExpressInterest(tender._id)}
                                className="ListallTenders-icon-btn ListallTenders-express-interest"
                              >
                                Express Interest
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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

export default ListallTenders;