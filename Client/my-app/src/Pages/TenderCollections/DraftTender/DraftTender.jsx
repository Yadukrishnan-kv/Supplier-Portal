"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DraftTender.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom";

// ✅ SVG Icons (same as ListTender.jsx)
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 16 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const DraftTender = () => {
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrafts = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/tenders/drafts`);
        const draftsList = res.data?.data;

        if (Array.isArray(draftsList)) {
          setDrafts(draftsList);
        } else {
          console.error("Expected array under 'data.data', but got:", draftsList);
          setDrafts([]);
        }
      } catch (err) {
        console.error("Error fetching drafts:", err);
        setDrafts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDrafts();
  }, [backendUrl]);

  const handlePublish = async (id) => {
    if (!window.confirm("Are you sure you want to publish this draft?")) return;

    try {
      await axios.put(`${backendUrl}/api/tenders/draft/${id}/ready`);
      await axios.put(`${backendUrl}/api/tenders/draft/${id}/publish`);
      alert("Tender published successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Publish error:", err);
      alert(err.response?.data?.message || "Failed to publish tender.");
    }
  };

  const handleEdit = (draft) => {
  navigate("/newtender", {
    state: {
      tenderToEdit: draft,
      isDraft: true,  // ✅ This is required!
    },
  });
};
  const handleView = (draft) => {
    navigate(`/draft-view/${draft._id}`);
  };

  const handleDeleteDraft = async (id) => {
    if (!window.confirm("Are you sure you want to delete this draft?")) return;

    try {
      await axios.delete(`${backendUrl}/api/tenders/drafts/${id}`); // Make sure this route exists
      setDrafts((prev) => prev.filter((draft) => draft._id !== id));
      alert("Draft deleted successfully!");
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete draft.");
    }
  };

  if (loading) {
    return (
      <div className="draft-container">
        <Sidebar />
        <div className="draft-main-content">
          <Header />
          <div className="draft-page-container">
            <div className="draft-form-card">
              <h2 className="draft-header">Draft Tenders</h2>
              <p className="draft-subtitle">Loading your drafts...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="draft-container">
      <Sidebar />
      <div className="draft-main-content">
        <Header />
        <div className="draft-page-container">
          <div className="draft-form-card">
            <h2 className="draft-header">Draft Tenders</h2>
            <p className="draft-subtitle">Manage your draft tenders</p>
            <hr className="draft-hr" />

            <div className="draft-table-container">
              <table className="draft-table">
                <thead>
                  <tr>
                    <th>Company</th>
                    <th>RFQ No.</th>
                    <th>Project Title</th>
                    <th>Publishing Date</th>
                    <th>Closing Date</th>
                    <th>RP</th>
                    <th>View</th>
                    <th>Edit</th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {drafts.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="draft-empty-state">
                        No drafts available.
                      </td>
                    </tr>
                  ) : (
                    drafts.map((draft) => (
                      <tr key={draft._id}>
                        <td>{draft.organisation}</td>
                        <td>{draft.projectCode}</td>
                        <td>{draft.projectTitle}</td>
                        <td>{new Date(draft.publishingDate).toLocaleDateString()}</td>
                        <td>{new Date(draft.closingDate).toLocaleDateString()}</td>
                        <td>
                          <button
                            onClick={() => handlePublish(draft._id)}
                            className="rp-button"
                            disabled={draft.readyToPublish}
                          >
                            RP
                          </button>
                        </td>
                        <td className="draft-actions">
                          <button
                            onClick={() => handleView(draft)}
                            className="draft-icon-btn draft-search"
                            title="View Draft"
                          >
                            <SearchIcon />
                          </button>
                        </td>
                        <td className="draft-actions">
                          <button
                            onClick={() => handleEdit(draft)}
                            className="draft-icon-btn draft-edit"
                            title="Edit Draft"
                          >
                            <EditIcon />
                          </button>
                        </td>
                        <td className="draft-actions">
                          <button
                            onClick={() => handleDeleteDraft(draft._id)}
                            className="draft-icon-btn draft-delete"
                            title="Delete Draft"
                          >
                            <DeleteIcon />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftTender;