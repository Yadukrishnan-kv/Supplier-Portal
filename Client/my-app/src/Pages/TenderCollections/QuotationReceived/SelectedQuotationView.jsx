"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./SelectedQuotationView.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const SelectedQuotationView = () => {
  const [tenders, setTenders] = useState([]);
  const [selectedTender, setSelectedTender] = useState("");
  const [quotation, setQuotation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marginMode, setMarginMode] = useState("Percentage"); // Percentage or Fixed Amount

  // Local state to store calculated marginTotal per row (only after user clicks ✓)
  const [calculatedMargins, setCalculatedMargins] = useState({});

  // Fetch all tenders
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

  // Reset calculated margins when tender changes
  useEffect(() => {
    setCalculatedMargins({});
  }, [selectedTender]);

  // Fetch selected quotation when tender selected
  const handleTenderChange = async (e) => {
    const tenderId = e.target.value;
    setSelectedTender(tenderId);
    setQuotation(null);
    setError(null);

    if (!tenderId) return;

    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/tenders/${tenderId}/selected-quotation`);
      setQuotation(res.data.data);
    } catch (err) {
      console.error("Error fetching selected quotation:", err);
      setError(err.response?.data?.message || "No selected quotation found.");
    } finally {
      setLoading(false);
    }
  };

  // Handle margin mode change
  const handleMarginModeChange = (e) => {
    setMarginMode(e.target.value);
  };

  // Calculate FINAL row total (Total + Margin) for display
  const calculateFinalTotal = (total, marginValue, mode) => {
    const baseTotal = parseFloat(total);
    if (isNaN(baseTotal) || isNaN(marginValue)) return baseTotal.toFixed(2);

    let addedValue = 0;

    if (mode === "Percentage") {
      addedValue = (baseTotal * marginValue) / 100;
    } else {
      addedValue = marginValue;
    }

    return (baseTotal + addedValue).toFixed(2);
  };

  // Handle row submit (✓ button click)
 const handleRowSubmit = async (itemCode, total, marginValue) => {
  try {
    // Calculate locally for instant feedback
    const finalTotal = calculateFinalTotal(parseFloat(total), parseFloat(marginValue), marginMode);
    setCalculatedMargins(prev => ({
      ...prev,
      [itemCode]: finalTotal
    }));

    // Save to backend
    const response = await axios.post(`${backendUrl}/api/tenders/${selectedTender}/update-margin`, {
      itemCode,
      marginType: marginMode,
      marginValue: parseFloat(marginValue)
    });

    // Optional: You can also store the saved marginTotal if needed for consistency
    console.log("Margin saved:", response.data);

  } catch (err) {
    console.error("Failed to save margin:", err);
    alert("Failed to save margin. Please try again.");
  }
};


  // Calculate Grand Total = sum of all calculated margin totals
  const grandTotal = () => {
    if (!quotation || !quotation.items) return "0.00";
    return quotation.items.reduce((sum, item) => {
      const marginTotal = calculatedMargins[item.itemCode] || 0;
      return sum + parseFloat(marginTotal);
    }, 0).toFixed(2);
  };
useEffect(() => {
  if (quotation && quotation.items) {
    const initialMargins = {};
    quotation.items.forEach(item => {
      if (item.marginType && item.marginValue !== undefined) {
        const finalTotal = calculateFinalTotal(
          parseFloat(item.total),
          parseFloat(item.marginValue),
          item.marginType
        );
        initialMargins[item.itemCode] = finalTotal;
      }
    });
    setCalculatedMargins(initialMargins);
  }
}, [quotation]);
  return (
    <div className="selected-quotation-container">
      <Sidebar />
      <div className="selected-quotation-main-content">
        <Header />
        <div className="selected-quotation-content-main">
          <div className="selected-quotation-content-box">
            <div className="selected-quotation-header">
              <h2 className="selected-quotation-title">Selected Quotation</h2>
            </div>

            {/* Tender Dropdown */}
            <div className="selected-quotation-dropdown">
              <label htmlFor="tenderSelect" className="selected-quotation-label">
                Select Tender
              </label>
              <select
                id="tenderSelect"
                value={selectedTender}
                onChange={handleTenderChange}
                className="selected-quotation-select"
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
              <p className="selected-quotation-message selected-quotation-error">{error}</p>
            )}

            {loading && (
              <p className="selected-quotation-message">Loading selected quotation...</p>
            )}

            {!loading && !error && quotation && (
              <div className="selected-quotation-card">
                <div className="selected-quotation-info-grid">
                  <div><strong>Project:</strong> {quotation.projectName}</div>
                  <div><strong>Org:</strong> {quotation.organisation}</div>
                  <div><strong>Supplier:</strong> {quotation.supplierName}</div>
                  <div><strong>Date:</strong> {new Date(quotation.submittedAt).toLocaleDateString()}</div>
                </div>

                {/* Margin Mode Dropdown */}
                <div className="selected-quotation-margin-control">
                  <label htmlFor="marginMode" className="selected-quotation-label">
                    Margin Type:
                  </label>
                  <select
                    id="marginMode"
                    value={marginMode}
                    onChange={handleMarginModeChange}
                    className="selected-quotation-select"
                  >
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed Amount">Fixed Amount</option>
                  </select>
                </div>

                <h3 className="selected-quotation-table-title">Quoted Items</h3>
                <table className="selected-quotation-table">
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
                      <th>Margin</th>
                      <th>Margin Total</th>
                      <th>Apply</th>
                    </tr>
                  </thead>
                  <tbody>
  {quotation.items.map((item, idx) => (
    <tr key={idx}>
      <td data-label="Item Code">{item.itemCode}</td>
      <td data-label="Name">{item.itemName}</td>
      <td data-label="Part No.">{item.partNo}</td>
      <td data-label="Manufacturer">{item.manufacturer}</td>
      <td data-label="UOM">{item.uom}</td>
      <td data-label="Qty">{item.qty}</td>
      <td data-label="Unit Price">₹{parseFloat(item.unitPrice || 0).toFixed(2)}</td>
      <td data-label="Total">₹{item.total}</td>
      <td data-label="Margin">
        <input
          type="number"
          min="0"
          step="any"
          defaultValue={item.marginValue || 0}
          className="margin-input"
          placeholder={marginMode === "Percentage" ? "%" : "₹"}
          id={`margin-input-${item.itemCode}`}
        />
      </td>
      <td data-label="Margin Total">₹{calculatedMargins[item.itemCode] || "0.00"}</td>
      <td data-label="Apply">
        <button
          type="button"
          className="apply-margin-btn"
          onClick={() => {
            const input = document.getElementById(`margin-input-${item.itemCode}`);
            const marginValue = input?.value || 0;
            handleRowSubmit(item.itemCode, item.total, marginValue);
          }}
        >
          ✓
        </button>
      </td>
    </tr>
  ))}
</tbody>
                  <tfoot>
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                        Grand Total:
                      </td>
                      <td colSpan="2" className="selected-grand-total">
                        ₹{grandTotal()}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {quotation.notes && (
                  <div className="selected-notes">
                    <strong>Notes:</strong>
                    <p>{quotation.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectedQuotationView;