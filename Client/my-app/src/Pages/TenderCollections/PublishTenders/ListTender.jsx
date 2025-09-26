"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "./ListTender.css"; // Import the new CSS file
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import { useNavigate } from "react-router-dom"; // Link is not used, removed from import

// Custom icons as SVG components
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

const backendUrl = process.env.REACT_APP_BACKEND_IP 

const ListTender = () => {
  const [tenders, setTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchTenders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${backendUrl}/api/tenders`);
      setTenders(res.data.data);
    } catch (err) {
      console.error("Error fetching tenders:", err);
      setError("Failed to fetch tenders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTender = async (id) => {
    if (window.confirm("Are you sure you want to delete this tender?")) {
      try {
        await axios.delete(`${backendUrl}/api/tenders/${id}`);
        fetchTenders(); // Refresh the list after deletion
      } catch (err) {
        console.error("Error deleting tender:", err);
        setError("Failed to delete tender. Please try again.");
      }
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/tender-details/${id}`); // Navigate to the tender details page
  };

  const handleEditTender = (tenderData) => {
    // Navigate to the NewTender form, passing the tender data as state
    navigate('/newtender', { state: { tenderToEdit: tenderData } });
  };

  useEffect(() => {
    fetchTenders();
  }, []);

  return (
    <div className="ListTender-container">
      <Sidebar />
      <div className="ListTender-main-content">
        <Header />
        <div className="ListTender-content-main">
          <div className="ListTender-content-box">
            <div className="ListTender-header">
              <h2 className="ListTender-title">Tender List</h2>
            </div>
            {loading && <p className="ListTender-message">Loading tenders...</p>}
            {error && <p className="ListTender-message ListTender-error">{error}</p>}
            {!loading && !error && tenders.length === 0 && (
              <p className="ListTender-empty-state">No tenders found.</p>
            )}
            {!loading && !error && tenders.length > 0 && (
              <div className="ListTender-table-container">
                <table className="ListTender-table">
                  <thead>
                    <tr>
                      <th>PROJECT NAME</th>
                      <th>ORGANISATION</th>
                      <th>PUBLISHING DATE</th>
                      <th className="ListTender-action-col">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenders.map((tender) => (
                      <tr key={tender._id}>
                        <td>{tender.projectName}</td>
                        <td>{tender.organisation}</td>
                        <td>{new Date(tender.publishingDate).toLocaleDateString()}</td>
                        <td className="ListTender-actions">
                          <button
                            onClick={() => handleEditTender(tender)}
                            className="ListTender-icon-btn ListTender-edit"
                            title="Edit Tender"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => handleViewDetails(tender._id)}
                            className="ListTender-icon-btn ListTender-search"
                            title="View Tender Details"
                          >
                            <SearchIcon />
                          </button>
                          <button
                            onClick={() => handleDeleteTender(tender._id)}
                            className="ListTender-icon-btn ListTender-delete"
                            title="Delete Tender"
                          >
                            <DeleteIcon />
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
    </div>
  );
};

export default ListTender;
