
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./DraftTender.css"; 

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const DraftView = () => {
  const { id } = useParams();
  const [draft, setDraft] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDraftDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${backendUrl}/api/tenders/drafts/${id}`);
        // Expecting { message, data: draft }
        setDraft(response.data.data);
      } catch (err) {
        console.error("Error fetching draft details:", err);
        setError("Failed to load draft details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDraftDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="tender-details-container">
        <Sidebar />
        <div className="tender-details-main-content">
          <Header />
          <div className="tender-details-page-container">
            <div className="tender-details-card">
              <p className="tender-details-message">Loading draft details...</p>
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

  if (!draft) {
    return (
      <div className="tender-details-container">
        <Sidebar />
        <div className="tender-details-main-content">
          <Header />
          <div className="tender-details-page-container">
            <div className="tender-details-card">
              <p className="tender-details-empty-state">Draft not found.</p>
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
            <h2 className="tender-details-header">View Draft</h2>
            <hr className="tender-details-hr" />

            {/* Basic Info Grid */}
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Project Code:</span>
                <span className="detail-value">{draft.projectCode}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Project Name:</span>
                <span className="detail-value">{draft.projectName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Organisation:</span>
                <span className="detail-value">{draft.organisation}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Project Title:</span>
                <span className="detail-value">{draft.projectTitle}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Supply Category:</span>
                <span className="detail-value">{draft.supplyCategory}</span>
              </div>
            </div>

            {/* Project Scope */}
            <div className="full-width-detail-scope">
              <label className="detail-label">Project Scope:</label>
              <div className="detail-textarea-value">{draft.projectScope}</div>
            </div>

            {/* Dates */}
            <div className="details-grid date-grid">
              <div className="detail-item">
                <span className="detail-label">Publishing Date:</span>
                <span className="detail-value">
                  {new Date(draft.publishingDate).toLocaleDateString('en-GB')}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Closing Date:</span>
                <span className="detail-value">
                  {new Date(draft.closingDate).toLocaleDateString('en-GB')}
                </span>
              </div>
            </div>

            {/* Items Table */}
            {draft.items && draft.items.length > 0 && (
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
                    {draft.items.map((item, index) => (
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
                      {draft.scopeOfWork && draft.scopeOfWork.length > 0 ? (
                        draft.scopeOfWork.map((file, index) => (
                          <a
                            key={index}
                            href={`${backendUrl}/uploads/${file.split('\\').pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            View File {index + 1}
                          </a>
                        ))
                      ) : (
                        <span className="no-files">No file</span>
                      )}
                    </td>
                    <td>
                      {draft.rfq && draft.rfq.length > 0 ? (
                        draft.rfq.map((file, index) => (
                          <a
                            key={index}
                            href={`${backendUrl}/uploads/${file.split('\\').pop()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="download-link"
                          >
                            View File {index + 1}
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

export default DraftView;