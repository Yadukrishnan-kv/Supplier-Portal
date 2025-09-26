"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./ListTender.css";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const Tenderdetails = () => {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenderDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/tenders/view/${id}`);
        setTender(response.data.data);
      } catch (err) {
        console.error("Error fetching tender details:", err);
        setError("Failed to load tender details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTenderDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="tender-details-container">
        <Sidebar />
        <div className="tender-details-main-content">
          <Header />
          <div className="tender-details-page-container">
            <div className="tender-details-card">
              <p className="tender-details-message">Loading tender details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tender-details-container">
        <Sidebar />
        <div className="tender-details-main-content">
          <Header />
          <div className="tender-details-page-container">
            <div className="tender-details-card">
              <p className="tender-details-message tender-details-error">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="tender-details-container">
        <Sidebar />
        <div className="tender-details-main-content">
          <Header />
          <div className="tender-details-page-container">
            <div className="tender-details-card">
              <p className="tender-details-empty-state">Tender not found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tender-details-container">
      <Sidebar />
      <div className="tender-details-main-content">
        <Header />
        <div className="tender-details-page-container">
          <div className="tender-details-card">
            <h2 className="tender-details-header">View Tender</h2>
            <hr className="tender-details-hr" />

            {/* Basic Info Grid */}
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Project Code:</span>
                <span className="detail-value">{tender.projectCode}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Project Name:</span>
                <span className="detail-value">{tender.projectName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Organisation:</span>
                <span className="detail-value">{tender.organisation}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Project Title:</span>
                <span className="detail-value">{tender.projectTitle}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Supply Category:</span>
                <span className="detail-value">{tender.supplyCategory}</span>
              </div>
            </div>

            {/* Project Scope */}
            <div className="full-width-detail-scope">
              <label className="detail-label">Project Scope:</label>
              <div className="detail-textarea-value">{tender.projectScope}</div>
            </div>

            {/* Dates */}
            <div className="details-grid date-grid">
              <div className="detail-item">
                <span className="detail-label">Publishing Date:</span>
                <span className="detail-value">
                  {new Date(tender.publishingDate).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Closing Date:</span>
                <span className="detail-value">
                  {new Date(tender.closingDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            {/* Items Table */}
            {tender.items && tender.items.length > 0 && (
              <div className="items-section">
                <h3 className="detail-label">Items</h3>
                <table className="file-table">
                  <thead>
                    <tr>
                      <th>Item Code</th>
                      <th>Item Name</th>
                      <th>Part No.</th>
                      <th>Manufacturer</th>
                      <th>UOM</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tender.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.itemCode}</td>
                        <td>{item.itemName}</td>
                        <td>{item.partNo}</td>
                        <td>{item.manufacturer}</td>
                        <td>{item.uom}</td>
                        <td>{item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* File Download Section */}
            <div className="file-download-section">
              <h3 style={{ display: 'none' }}>Attachments</h3>
              <table className="file-table">
                <thead>
                  <tr>
                    <th>Scope of Work</th>
                    <th>RFQ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {tender.scopeOfWork && tender.scopeOfWork.length > 0 ? (
                        tender.scopeOfWork.map((filePath, index) => (
                          <a
                            key={index}
                            href={`${backendUrl}/api/tenders/${tender._id}/download/scopeOfWork/${index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            Download File {index + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-files">No file</span>
                      )}
                    </td>
                    <td>
                      {tender.rfq && tender.rfq.length > 0 ? (
                        tender.rfq.map((filePath, index) => (
                          <a
                            key={index}
                            href={`${backendUrl}/api/tenders/${tender._id}/download/rfq/${index}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            Download File {index + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-files">No file</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tenderdetails;