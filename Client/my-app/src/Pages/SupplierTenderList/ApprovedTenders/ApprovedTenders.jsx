"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./ApprovedTenders.css";
import SupplierSidebar from "../../../components/SupplierSidebar";
import { jwtDecode } from "jwt-decode";
import QuotationForm from "../ApprovedTenders/QuotationForm";
import Header from "../../../components/Header";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const ApprovedTenders = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quotationModal, setQuotationModal] = useState(null); // { tenderId, items }
  const [quotationSubmitted, setQuotationSubmitted] = useState(false);

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
        `${backendUrl}/api/suppliers/supplier/${supplierId}/approved`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTenders(res.data || []);
    } catch (err) {
      console.error("Error fetching approved tenders:", err);
      setError("Failed to load approved tenders.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenQuotationForm = (tender) => {
    const supplierEntry = tender.interestedSuppliers.find(
      (s) => s.supplierId.toString() === jwtDecode(localStorage.getItem("adminToken")).id
    );

    if (supplierEntry?.quotation) {
      alert("You have already submitted a quotation for this tender.");
      return;
    }

    const items = tender.items.map((item) => ({
      id: item._id || Date.now() + Math.random(),
      itemCode: item.itemCode,
      itemName: item.itemName,
      partNo: item.partNo,
      manufacturer: item.manufacturer,
      uom: item.uom,
      qty: item.qty,
      unitPrice: 0,
      totalPrice: 0,
    }));

    setQuotationModal({ tenderId: tender._id, items });
    setQuotationSubmitted(false);
  };

  const handleSubmitQuotation = async (quotationData) => {
    try {
      const token = localStorage.getItem("adminToken");
      const decoded = jwtDecode(token);
      const supplierId = decoded.id;

      await axios.post(
        `${backendUrl}/api/suppliers/${quotationModal.tenderId}/supplier/${supplierId}/quotation`,
        { quotation: JSON.stringify(quotationData) },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTenders((prev) =>
        prev.map((tender) =>
          tender._id === quotationModal.tenderId
            ? {
                ...tender,
                interestedSuppliers: tender.interestedSuppliers.map((sup) =>
                  sup.supplierId.toString() === supplierId
                    ? { ...sup, quotation: JSON.stringify(quotationData) }
                    : sup
                ),
              }
            : tender
        )
      );

      setQuotationSubmitted(true);
      setTimeout(() => {
        setQuotationModal(null);
        alert("Quotation submitted successfully!");
      }, 1500);
    } catch (err) {
      console.error("Error submitting quotation:", err);
      alert(err.response?.data?.message || "Failed to submit quotation.");
    }
  };

  if (loading) {
    return (
      <div className="ApprovedTenders-container">
        <SupplierSidebar />
        <div className="ApprovedTenders-main-content">
          <div className="ApprovedTenders-content-main">
            <div className="ApprovedTenders-content-box">
              <div className="ApprovedTenders-header">
                <h2 className="ApprovedTenders-title">Approved Tenders</h2>
              </div>
              <p className="ApprovedTenders-message">Loading...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ApprovedTenders-container">
      <SupplierSidebar />
      <div className="ApprovedTenders-main-content">
         <Header />
        <div className="ApprovedTenders-content-main">
          <div className="ApprovedTenders-content-box">
            <div className="ApprovedTenders-header">
              <h2 className="ApprovedTenders-title">Approved Tenders</h2>
            </div>

            {error && (
              <p className="ApprovedTenders-message ApprovedTenders-error">{error}</p>
            )}

            {tenders.length === 0 ? (
              <p className="ApprovedTenders-empty-state">No approved tenders found.</p>
            ) : (
              <div className="ApprovedTenders-table-container">
                <table className="ApprovedTenders-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>ORGANISATION</th>
                      <th>PUBLISHING DATE</th>
                      <th>STATUS</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender) => {
                      const supplierEntry = tender.interestedSuppliers.find(
                        (s) => s.supplierId.toString() === jwtDecode(localStorage.getItem("adminToken")).id
                      );
                      const hasQuotation = !!supplierEntry?.quotation;

                      return (
                        <tr key={tender._id}>
                          <td data-label="PROJECT NAME">{tender.projectName}</td>
                          <td data-label="ORGANISATION">{tender.organisation}</td>
                          <td data-label="PUBLISHING DATE">
                            {new Date(tender.publishingDate).toLocaleDateString()}
                          </td>
                          <td data-label="STATUS">
                            <span className="ApprovedTenders-status ApprovedTenders-status-approved">
                              Approved
                            </span>
                          </td>
                          <td data-label="ACTIONS">
                            <button
                              className="ApprovedTenders-icon-btn"
                              onClick={() => handleOpenQuotationForm(tender)}
                              disabled={hasQuotation}
                              style={{
                                backgroundColor: hasQuotation ? "#95a5a6" : "#3498db",
                                color: "white",
                              }}
                            >
                              {hasQuotation ? "Quotation Sent" : "Send Quotation"}
                            </button>
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

      {/* Quotation Modal */}
      {quotationModal && !quotationSubmitted && (
        <div className="quotation-modal-overlay">
          <div className="quotation-modal-content">
            <QuotationForm
              initialItems={quotationModal.items}
              onSubmit={handleSubmitQuotation}
            />
            <button
              onClick={() => setQuotationModal(null)}
              className="quotation-modal-close"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Success Screen */}
      {quotationSubmitted && (
        <div className="quotation-modal-overlay">
          <div className="quotation-success-content">
            <div className="quotation-success-icon">✓</div>
            <h3>Quotation Submitted!</h3>
            <p>Your quotation has been successfully sent.</p>
            <button
              onClick={() => {
                setQuotationModal(null);
                window.location.reload();
              }}
              className="quotation-success-btn"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedTenders;