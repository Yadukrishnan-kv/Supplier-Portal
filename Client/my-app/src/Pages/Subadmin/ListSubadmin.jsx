"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./ListSubadmin.css";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Link } from "react-router-dom";

// Custom icons as SVG components
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

const ListSubadmin = () => {
  const [subadmins, setSubadmins] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedEmail, setEditedEmail] = useState("");
  const [editedUsername, setEditedUsername] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchSubadmins = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/admin/viewsubadmins`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSubadmins(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDeleteSubadmin = async (id) => {
    try {
      await axios.delete(`${backendUrl}/api/admin/deletesubadmin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSubadmins();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleUpdateSubadmin = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/updatesubadmin/${id}`,
        { email: editedEmail, username: editedUsername },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingId(null);
      setEditedEmail("");
      setEditedUsername("");
      fetchSubadmins();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  useEffect(() => {
    fetchSubadmins();
  }, []);

  return (
    <div className="ListSubadmin-container">
      <Sidebar />
      <div className="ListSubadmin-main-content">
        <Header />
        <div className="ListSubadmin-content-main">
          <div className="ListSubadmin-content-box">
            <div className="ListSubadmin-header">
              <h2 className="ListSubadmin-title">Subadmin List</h2>
              <Link to={"/addSubadmin"}>
                <button className="ListSubadmin-btn ListSubadmin-btn-primary">Add Subadmin</button>
              </Link>
            </div>
            <div className="ListSubadmin-table-container">
              <table className="ListSubadmin-table">
                <thead>
                  <tr>
                    <th>USERNAME</th>
                    <th>EMAIL</th>
                    <th>ROLE</th>
                    <th className="ListSubadmin-action-col">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {subadmins.map((sub) => (
                    <tr key={sub._id}>
                      <td data-label="USERNAME">
                        {editingId === sub._id ? (
                          <input
                            type="text"
                            value={editedUsername}
                            onChange={(e) => setEditedUsername(e.target.value)}
                            className="ListSubadmin-input"
                          />
                        ) : (
                          sub.username
                        )}
                      </td>
                      <td data-label="EMAIL">
                        {editingId === sub._id ? (
                          <input
                            type="email"
                            value={editedEmail}
                            onChange={(e) => setEditedEmail(e.target.value)}
                            className="ListSubadmin-input"
                          />
                        ) : (
                          sub.email
                        )}
                      </td>
                      <td data-label="ROLE">{sub.role}</td>
                      <td data-label="ACTIONS" className="ListSubadmin-actions">
                        {editingId === sub._id ? (
                          <button
                            onClick={() => handleUpdateSubadmin(sub._id)}
                            className="ListSubadmin-btn ListSubadmin-btn-success"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(sub._id);
                              setEditedEmail(sub.email);
                              setEditedUsername(sub.username);
                            }}
                            className="ListSubadmin-icon-btn ListSubadmin-edit"
                          >
                            <EditIcon />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteSubadmin(sub._id)}
                          className="ListSubadmin-icon-btn ListSubadmin-delete"
                        >
                          <DeleteIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListSubadmin;