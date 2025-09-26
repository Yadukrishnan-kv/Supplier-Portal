"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./QuotationReceived.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";

// Custom SearchIcon SVG component
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 16 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const QuotationReceived = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/tenders/quotations`);
      
      const tendersData = res.data?.data || res.data;

      if (!Array.isArray(tendersData)) {
        console.warn("Expected array under res.data.data, but got:", tendersData);
        setTenders([]);
        return;
      }

      const formattedTenders = tendersData.flatMap((tender) =>
        (tender.interestedSuppliers || [])
          .filter((supplier) => supplier.quotation && supplier.status === "Approved")
          .map((supplier) => ({
            _id: tender._id,
            projectName: tender.projectName,
            organisation: tender.organisation,
            supplier: supplier.supplierName,
            publishingDate: tender.publishingDate,
            supplierId: supplier.supplierId?._id || supplier.supplierId,
            quotation: supplier.quotation,
            status: supplier.status,
          }))
      );

      setTenders(formattedTenders);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Failed to fetch quotations. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewQuotation = async (tenderId, supplierId) => {
    try {
      const res = await axios.get(`${backendUrl}/api/tenders/${tenderId}/supplier/${supplierId}/quotation`);
      const data = res.data?.data || res.data;

      if (!data) throw new Error("No quotation data");

      // Parse quotation if it's a JSON string
      let quotationData = data;
      if (typeof data.quotation === 'string') {
        try {
          const parsed = JSON.parse(data.quotation);
          quotationData = { ...data, ...parsed };
        } catch (e) {
          // If not JSON, keep as text
        }
      }

      setSelectedQuotation(quotationData);
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching quotation details:", err);
      setError("Failed to fetch quotation details. Please try again.");
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedQuotation(null);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  return (
    <div className="QuotationReceived-container">
      <Sidebar />
      <div className="QuotationReceived-main-content">
        <Header />
        <div className="QuotationReceived-content-main">
          <div className="QuotationReceived-content-box">
            <div className="QuotationReceived-header">
              <h2 className="QuotationReceived-title">Received Quotations</h2>
            </div>

            {loading && (
              <p className="QuotationReceived-message">Loading quotations...</p>
            )}

            {error && (
              <p className="QuotationReceived-message QuotationReceived-error">{error}</p>
            )}

            {!loading && !error && tenders.length === 0 && (
              <p className="QuotationReceived-empty-state">No quotations found.</p>
            )}

            {!loading && !error && tenders.length > 0 && (
              <div className="QuotationReceived-table-container">
                <table className="QuotationReceived-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>ORGANISATION</th>
                      <th>SUPPLIER</th>
                      <th>PUBLISHING DATE</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender) => (
                      <tr key={`${tender._id}-${tender.supplierId}`}>
                        <td>{tender.projectName}</td>
                        <td>{tender.organisation}</td>
                        <td>{tender.supplier}</td>
                        <td>{new Date(tender.publishingDate).toLocaleDateString()}</td>
                        <td className="QuotationReceived-actions">
                          <button
                            onClick={() => handleViewQuotation(tender._id, tender.supplierId)}
                            className="QuotationReceived-icon-btn QuotationReceived-search"
                            title="View Quotation"
                          >
                            <SearchIcon />
                          </button>
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

      {/* Enhanced Quotation Modal */}
      {modalOpen && selectedQuotation && (
        <div className="QuotationReceived-modal-overlay" onClick={closeModal}>
          <div className="QuotationReceived-modal" onClick={(e) => e.stopPropagation()}>
            <div className="QuotationReceived-modal-header">
              <h3 className="QuotationReceived-modal-title">
                📄 Quotation from {selectedQuotation.supplierName || selectedQuotation.supplier}
              </h3>
            </div>

            <div className="QuotationReceived-modal-content">
              <div className="QuotationReceived-meta-grid">
                <div><strong>Project:</strong> {selectedQuotation.projectName}</div>
                <div><strong>Org:</strong> {selectedQuotation.organisation}</div>
                <div><strong>Date:</strong> {new Date(selectedQuotation.submittedAt || selectedQuotation.publishingDate).toLocaleDateString()}</div>
                <div className="QuotationReceived-status-approved">Approved</div>
              </div>

              {/* Itemized Table */}
              {selectedQuotation.items && Array.isArray(selectedQuotation.items) ? (
                <div className="QuotationReceived-table-wrapper">
                  <table className="QuotationReceived-quotation-table">
                    <thead>
                      <tr>
                        <th>Item Code</th>
                        <th>Name</th>
                        <th>Part No.</th>
                        <th>Manufacturer</th>
                        <th>UOM</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.items.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.itemCode}</td>
                          <td>{item.itemName}</td>
                          <td>{item.partNo}</td>
                          <td>{item.manufacturer}</td>
                          <td>{item.uom}</td>
                          <td>{item.qty}</td>
                          <td>₹{parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                          <td>₹{(item.qty * item.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="7" className="text-right"><strong>Grand Total:</strong></td>
                        <td className="QuotationReceived-grand-total">
                          ₹{selectedQuotation.total || "0.00"}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="QuotationReceived-quotation-text">
                  {selectedQuotation.quotation}
                </div>
              )}

              {selectedQuotation.notes && (
                <div className="QuotationReceived-notes">
                  <strong>Notes:</strong>
                  <p>{selectedQuotation.notes}</p>
                </div>
              )}
            </div>

            <div className="QuotationReceived-modal-footer">
              <button
                onClick={closeModal}
                className="QuotationReceived-modal-close-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationReceived;