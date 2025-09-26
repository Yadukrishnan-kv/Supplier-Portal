"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./CompareQuotations.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const CompareQuotations = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState("");
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 Track which quotation is selected
  const [selectedQuotationId, setSelectedQuotationId] = useState("");

  // Fetch tenders for dropdown
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tenders`);
        setTenders(res.data.data || []);
      } catch (err) {
        console.error("Error fetching tenders:", err);
        setError("Failed to load tenders.");
      }
    };
    fetchTenders();
  }, []);

  // Fetch quotations when tender selected
  const handleTenderChange = async (e) => {
    const tenderId = e.target.value;
    setSelectedTender(tenderId);
    setLoading(true);
    setError(null);
    setQuotations([]);
    setSelectedQuotationId(""); // Reset when changing tender

    if (!tenderId) return;

    try {
      const res = await axios.get(`${backendUrl}/api/tenders/${tenderId}/quotations`);
      const data = res.data.data || [];

      const parsedQuotations = data.map((q) => {
        let quotationData = {};
        try {
          quotationData = typeof q.quotation === 'string' ? JSON.parse(q.quotation) : q.quotation;
        } catch (e) {
          console.warn("Failed to parse quotation:", e);
        }

        const items = Array.isArray(quotationData.items) ? quotationData.items : [];
        const total = quotationData.total || 0;

        return {
          _id: q._id,
          supplierName: q.supplierName || "Unknown Supplier",
          items,
          total,
        };
      });

      setQuotations(parsedQuotations);
    } catch (err) {
      console.error("Error fetching quotations:", err);
      setError("Failed to load quotations.");
    } finally {
      setLoading(false);
    }
  };

  // Handle selecting a quotation
  const handleSelectQuotation = async (quotationId) => {
    if (!selectedTender || !quotationId) return;

    try {
      await axios.put(
        `${backendUrl}/api/tenders/${selectedTender}/quotation/${quotationId}/select`
      );

      // ✅ Update UI: mark this as selected
      setSelectedQuotationId(quotationId);
      alert("Supplier selected successfully!");
    } catch (err) {
      console.error("Error selecting quotation:", err);
      alert(err.response?.data?.message || "Failed to select supplier.");
    }
  };

  return (
    <div className="compare-quotations-container">
      <Sidebar />
      <div className="compare-quotations-main-content">
        <Header />
        <div className="compare-quotations-content-main">
          <div className="compare-quotations-content-box">
            <div className="compare-quotations-header">
              <h2 className="compare-quotations-title">Compare Supplier Quotations</h2>
            </div>

            {/* Tender Dropdown */}
            <div className="compare-quotations-dropdown">
              <label htmlFor="tenderSelect" className="compare-quotations-label">
                Select Tender
              </label>
              <select
                id="tenderSelect"
                value={selectedTender}
                onChange={handleTenderChange}
                className="compare-quotations-select"
                disabled={loading}
              >
                <option value="">-- Select a Tender --</option>
                {tenders.map((tender) => (
                  <option key={tender._id} value={tender._id}>
                    {tender.projectCode} – {tender.projectTitle}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="compare-quotations-message compare-quotations-error">{error}</p>
            )}

            {loading && (
              <p className="compare-quotations-message">Loading quotations...</p>
            )}

            {!loading && !error && quotations.length === 0 && selectedTender && (
              <p className="compare-quotations-empty-state">No quotations received.</p>
            )}

            {!loading && !error && quotations.length > 0 && (
              <div className="compare-quotations-cards-container">
                {quotations.map((q) => (
                  <div key={q._id} className="compare-quotation-card">
                    <div className="compare-quotation-header">
                      <h3>{q.supplierName}</h3>
                    </div>

                    <table className="compare-quotation-table">
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
                        {q.items.length === 0 ? (
                          <tr>
                            <td colSpan="8" style={{ textAlign: 'center', color: '#666' }}>
                              No items quoted
                            </td>
                          </tr>
                        ) : (
                          q.items.map((item, idx) => {
                            const totalPrice = (item.qty * item.unitPrice).toFixed(2);
                            return (
                              <tr key={idx}>
                                <td>{item.itemCode}</td>
                                <td>{item.itemName}</td>
                                <td>{item.partNo}</td>
                                <td>{item.manufacturer}</td>
                                <td>{item.uom}</td>
                                <td>{item.qty}</td>
                                <td>₹{parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                                <td>₹{totalPrice}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                            Grand Total:
                          </td>
                          <td className="compare-grand-total">₹{parseFloat(q.total).toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>

                    {/* ✅ Change button text based on selection */}
                    <button
                      onClick={() => handleSelectQuotation(q._id)}
                      className={
                        selectedQuotationId === q._id
                          ? "compare-selected-btn"
                          : "compare-select-btn"
                      }
                      disabled={selectedQuotationId && selectedQuotationId !== q._id}
                    >
                      {selectedQuotationId === q._id ? "Selected" : "Select"}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareQuotations;