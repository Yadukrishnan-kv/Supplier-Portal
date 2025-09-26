"use client";

import React, { useState } from "react";
import "./QuotationForm.css";

const QuotationForm = ({ initialItems = [], onSubmit }) => {
  const [items, setItems] = useState(
    initialItems.map((item) => ({
      ...item,
      unitPrice: item.unitPrice || 0,
      totalPrice: (item.qty * item.unitPrice).toFixed(2),
    }))
  );

  const [notes, setNotes] = useState("");

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;

    if (field === "qty" || field === "unitPrice") {
      const qty = parseFloat(updatedItems[index].qty) || 1;
      const unitPrice = parseFloat(updatedItems[index].unitPrice) || 0;
      updatedItems[index].totalPrice = (qty * unitPrice).toFixed(2);
    }

    setItems(updatedItems);
  };

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      itemCode: "",
      itemName: "",
      partNo: "",
      manufacturer: "",
      uom: "",
      qty: 1,
      unitPrice: 0,
      totalPrice: 0,
    };
    setItems([...items, newItem]);
  };

  const removeItem = (idToRemove) => {
    setItems(items.filter((item) => item.id !== idToRemove));
  };

  const calculateGrandTotal = () => {
    return items.reduce((sum, item) => sum + parseFloat(item.totalPrice || 0), 0).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const quotationData = {
      items,
      total: calculateGrandTotal(),
      notes,
      submittedAt: new Date().toISOString(),
    };
    onSubmit?.(quotationData);
  };

  return (
    <form onSubmit={handleSubmit} className="quotation-form">
      <div className="quotation-section">
        <h3 className="quotation-section-title">Quotation Items</h3>
        <div className="table-container">
          <table className="quotation-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Name</th>
                <th>Part No.</th>
                <th>Manufacturer/Origin</th>
                <th>UOM</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td><input type="text" value={item.itemCode} onChange={(e) => handleItemChange(items.indexOf(item), 'itemCode', e.target.value)} className="table-input" /></td>
                  <td><input type="text" value={item.itemName} onChange={(e) => handleItemChange(items.indexOf(item), 'itemName', e.target.value)} className="table-input" /></td>
                  <td><input type="text" value={item.partNo} onChange={(e) => handleItemChange(items.indexOf(item), 'partNo', e.target.value)} className="table-input" /></td>
                  <td><input type="text" value={item.manufacturer} onChange={(e) => handleItemChange(items.indexOf(item), 'manufacturer', e.target.value)} className="table-input" /></td>
                  <td><input type="text" value={item.uom} onChange={(e) => handleItemChange(items.indexOf(item), 'uom', e.target.value)} className="table-input" /></td>
                  <td><input type="number" min="1" step="0.01" value={item.qty} onChange={(e) => handleItemChange(items.indexOf(item), 'qty', e.target.value)} className="table-input" /></td>
                  <td><input type="number" min="0" step="0.01" value={item.unitPrice} onChange={(e) => handleItemChange(items.indexOf(item), 'unitPrice', e.target.value)} className="table-input" /></td>
                  <td><input type="number" value={item.totalPrice} readOnly className="table-input read-only" /></td>
                  <td><button type="button" onClick={() => removeItem(item.id)} className="remove-row-btn">×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addItem} className="add-item-btn">+ Add Item</button>
        </div>
      </div>

      <div className="quotation-section">
        <div className="form-group full-width">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="form-textarea"
            rows="3"
            placeholder="Enter any additional notes..."
          ></textarea>
        </div>

        <div className="grand-total">
          <span className="total-label">Total Price:</span>
          <span className="total-amount">₹ {calculateGrandTotal()}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="submit-btn">Submit Quotation</button>
      </div>
    </form>
  );
};

export default QuotationForm;