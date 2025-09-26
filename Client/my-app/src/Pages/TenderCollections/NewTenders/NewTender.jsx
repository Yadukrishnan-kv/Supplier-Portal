"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewTender.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useLocation, useNavigate } from "react-router-dom";

const NewTender = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get tenderToEdit and isDraft flag from navigation state
  const { tenderToEdit, isDraft } = location.state || {};

  const [formData, setFormData] = useState({
    projectCode: "",
    projectName: "",
    organisation: "",
    projectTitle: "",
    supplyCategory: "",
    projectScope: "",
    publishingDate: "",
    closingDate: "",
  });

  const [items, setItems] = useState([{ id: 1, itemCode: "", itemName: "", partNo: "", manufacturer: "", uom: "", qty: "" }]);
  const [fileInputs, setFileInputs] = useState([{ id: 1, scopeOfWorkFile: null, rfqFile: null }]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const backendUrl = process.env.REACT_APP_BACKEND_IP;

  // Fetch categories on load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/category/view`);
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  // Load tender/draft data when editing
  useEffect(() => {
    if (tenderToEdit) {
      setFormData({
        projectCode: tenderToEdit.projectCode || "",
        projectName: tenderToEdit.projectName || "",
        organisation: tenderToEdit.organisation || "",
        projectTitle: tenderToEdit.projectTitle || "",
        supplyCategory: tenderToEdit.supplyCategory || "",
        projectScope: tenderToEdit.projectScope || "",
        publishingDate: tenderToEdit.publishingDate
          ? new Date(tenderToEdit.publishingDate).toISOString().split('T')[0]
          : "",
        closingDate: tenderToEdit.closingDate
          ? new Date(tenderToEdit.closingDate).toISOString().split('T')[0]
          : "",
      });
      setItems(tenderToEdit.items || []);
      setFileInputs([{ id: 1, scopeOfWorkFile: null, rfqFile: null }]);
    }
  }, [tenderToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const addItemRow = () => {
    const newRowId = items.length + 1;
    setItems([
      ...items,
      { id: newRowId, itemCode: "", itemName: "", partNo: "", manufacturer: "", uom: "", qty: "" }
    ]);
  };

  const removeItemRow = (idToRemove) => {
    setItems(items.filter(item => item.id !== idToRemove));
  };

  const handleFileChange = (index, fieldName, file) => {
    const newFileInputs = [...fileInputs];
    newFileInputs[index][fieldName] = file;
    setFileInputs(newFileInputs);
  };

  const addMoreFiles = () => {
    setFileInputs((prev) => [
      ...prev,
      { id: prev.length + 1, scopeOfWorkFile: null, rfqFile: null },
    ]);
  };

  const removeFilesRow = (idToRemove) => {
    setFileInputs((prev) => prev.filter(input => input.id !== idToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    data.append("items", JSON.stringify(items));

    fileInputs.forEach((input) => {
      if (input.scopeOfWorkFile) {
        data.append("scopeOfWork", input.scopeOfWorkFile);
      }
      if (input.rfqFile) {
        data.append("rfq", input.rfqFile);
      }
    });

    try {
      let response;

      if (tenderToEdit) {
        // ✅ Determine API endpoint based on draft or published tender
        const endpoint = isDraft
          ? `${backendUrl}/api/tenders/drafts/${tenderToEdit._id}`
          : `${backendUrl}/api/tenders/${tenderToEdit._id}`;

        response = await axios.put(endpoint, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        setMessage("Tender updated successfully!");
      } else {
        // Create new draft
        response = await axios.post(`${backendUrl}/api/tenders/add`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage("Tender draft created successfully!");
      }

      // Reset form
      setFormData({
        projectCode: "",
        projectName: "",
        organisation: "",
        projectTitle: "",
        supplyCategory: "",
        projectScope: "",
        publishingDate: "",
        closingDate: "",
      });
      setItems([{ id: 1, itemCode: "", itemName: "", partNo: "", manufacturer: "", uom: "", qty: "" }]);
      setFileInputs([{ id: 1, scopeOfWorkFile: null, rfqFile: null }]);

      // Navigate back
      if (tenderToEdit) {
        if (isDraft) {
          navigate(`/draft-view/${tenderToEdit._id}`);
        } else {
          navigate(`/tender-details/${tenderToEdit._id}`);
        }
      } else {
        navigate('/listTender');
      }
    } catch (err) {
      console.error("Tender submission/update error:", err);
      setError(
        err.response?.data?.message ||
        (tenderToEdit ? "Failed to update tender." : "Failed to create tender.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (tenderToEdit) {
      if (isDraft) {
        navigate(`/draft-view/${tenderToEdit._id}`);
      } else {
        navigate(`/tender-details/${tenderToEdit._id}`);
      }
    } else {
      navigate('/listTender');
    }
  };

  return (
    <div className="tender-container">
      <Sidebar />
      <div className="tender-main-content">
        <Header />
        <div className="tender-page-container">
          <div className="tender-form-card">
            <h2 className="tender-header">
              {tenderToEdit ? (isDraft ? "Edit Draft" : "Edit Tender") : "New Tender"}
            </h2>
            <p className="tender-subtitle">Fill and submit the form</p>
            <hr className="tender-hr" />

            {error && (
              <div className="tender-message tender-error">
                <div className="tender-message-icon">✕</div>
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="tender-message tender-success">
                <div className="tender-message-icon">✓</div>
                <span>{message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Form Fields */}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="projectCode" className="form-label required">Project Code:</label>
                  <input
                    type="text"
                    id="projectCode"
                    name="projectCode"
                    className="form-input"
                    placeholder="Enter Project Code"
                    value={formData.projectCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectName" className="form-label required">Project Name:</label>
                  <input
                    type="text"
                    id="projectName"
                    name="projectName"
                    className="form-input"
                    placeholder="Enter Project Name"
                    value={formData.projectName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="organisation" className="form-label required">Organisation:</label>
                  <input
                    type="text"
                    id="organisation"
                    name="organisation"
                    className="form-input"
                    placeholder="Enter Organisation"
                    value={formData.organisation}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="projectTitle" className="form-label required">Project Title:</label>
                  <input
                    type="text"
                    id="projectTitle"
                    name="projectTitle"
                    className="form-input"
                    placeholder="Enter Project Title"
                    value={formData.projectTitle}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="supplyCategory" className="form-label required">Supply Category:</label>
                  <select
                    id="supplyCategory"
                    name="supplyCategory"
                    className="form-select"
                    value={formData.supplyCategory}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Choose Category</option>
                    {categories.map((category) => (
                      <option key={category.category} value={category.category}>
                        {category.category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group full-width-textarea">
                <label htmlFor="projectScope" className="form-label required">Project Scope:</label>
                <textarea
                  id="projectScope"
                  name="projectScope"
                  className="form-textarea"
                  placeholder="Enter Project Scope"
                  value={formData.projectScope}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-grid">
                <div className="form-group date-input-wrapper">
                  <label htmlFor="publishingDate" className="form-label required">Publishing Date</label>
                  <input
                    type="date"
                    id="publishingDate"
                    name="publishingDate"
                    className="form-input"
                    value={formData.publishingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group date-input-wrapper">
                  <label htmlFor="closingDate" className="form-label required">Closing Date</label>
                  <input
                    type="date"
                    id="closingDate"
                    name="closingDate"
                    className="form-input"
                    value={formData.closingDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="items-table-section">
                <h3 className="section-title">Items</h3>
                <table className="items-table">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Part No.</th>
                      <th>Manufacturer/Origin</th>
                      <th>UOM</th>
                      <th>Qty</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={item.id}>
                        <td>
                          <input
                            type="text"
                            value={item.itemCode}
                            onChange={(e) => handleItemChange(index, 'itemCode', e.target.value)}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.partNo}
                            onChange={(e) => handleItemChange(index, 'partNo', e.target.value)}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.manufacturer}
                            onChange={(e) => handleItemChange(index, 'manufacturer', e.target.value)}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={item.uom}
                            onChange={(e) => handleItemChange(index, 'uom', e.target.value)}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                            className="table-input"
                            required
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => removeItemRow(item.id)}
                            className="remove-item-button"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button type="button" onClick={addItemRow} className="add-item-button">
                  + Add Item
                </button>
              </div>

              {/* File Upload Section */}
              <div className="file-upload-section">
                {fileInputs.map((input, index) => (
                  <div key={input.id} className="file-input-row">
                    <div className="form-group file-input-wrapper">
                      <label htmlFor={`scopeOfWork-${input.id}`} className="form-label required">
                        Scope of Work
                      </label>
                      <div className="file-input-display">
                        <label htmlFor={`scopeOfWork-${input.id}`}>Choose File</label>
                        <span>{input.scopeOfWorkFile ? input.scopeOfWorkFile.name : "No file chosen"}</span>
                        <input
                          type="file"
                          id={`scopeOfWork-${input.id}`}
                          name={`scopeOfWork-${input.id}`}
                          onChange={(e) => handleFileChange(index, "scopeOfWorkFile", e.target.files[0])}
                          required={index === 0 && !tenderToEdit}
                        />
                      </div>
                    </div>
                    <div className="form-group file-input-wrapper">
                      <label htmlFor={`rfq-${input.id}`} className="form-label required">RFQ</label>
                      <div className="file-input-display">
                        <label htmlFor={`rfq-${input.id}`}>Choose File</label>
                        <span>{input.rfqFile ? input.rfqFile.name : "No file chosen"}</span>
                        <input
                          type="file"
                          id={`rfq-${input.id}`}
                          name={`rfq-${input.id}`}
                          onChange={(e) => handleFileChange(index, "rfqFile", e.target.files[0])}
                          required={index === 0 && !tenderToEdit}
                        />
                      </div>
                    </div>
                    {index === fileInputs.length - 1 && (
                      <button type="button" onClick={addMoreFiles} className="add-more-button">
                        Add More
                      </button>
                    )}
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => removeFilesRow(input.id)}
                        className="remove-file-row-button"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="button-group">
                <button type="submit" className="button-primary" disabled={loading}>
                  {loading
                    ? (tenderToEdit ? "Updating..." : "Publishing...")
                    : (tenderToEdit ? "Update" : "Publish")
                  }
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="button-secondary"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewTender;