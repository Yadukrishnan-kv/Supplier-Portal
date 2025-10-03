"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./TenderReport.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const TenderReport = () => {
  const [tenders, setTenders] = useState([]);
  const [filteredTenders, setFilteredTenders] = useState([]);
  const [projectNameSearch, setProjectNameSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    axios
      .get(`${backendUrl}/api/tenders`)
      .then((res) => {
        const data = res.data.data || [];
        setTenders(data);
        setFilteredTenders(data);
      })
      .catch((err) => console.error("Error fetching tenders:", err));
  }, []);

  const handleSearch = () => {
    let filtered = tenders;

    if (projectNameSearch) {
      filtered = filtered.filter((t) =>
        t.projectName.toLowerCase().includes(projectNameSearch.toLowerCase())
      );
    }

    if (dateFrom) {
      const fromDate = new Date(dateFrom);
      filtered = filtered.filter((t) => new Date(t.publishingDate) >= fromDate);
    }

    if (dateTo) {
      const toDate = new Date(dateTo);
      filtered = filtered.filter((t) => new Date(t.publishingDate) <= toDate);
    }

    setFilteredTenders(filtered);
  };

  return (
    <div className="TenderReport-container">
      <Sidebar />
      <div className="TenderReport-main-content">
        <Header />
        <div className="TenderReport-content-main">
          <div className="TenderReport-content-box">
            <div className="TenderReport-header">
              <h2 className="TenderReport-title">Tender Report</h2>
              <div className="TenderReport-search-wrapper">
                <input
                  type="text"
                  placeholder="Project Name"
                  value={projectNameSearch}
                  onChange={(e) => setProjectNameSearch(e.target.value)}
                  className="TenderReport-input"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="TenderReport-input"
                />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="TenderReport-input"
                />
                <button
                  onClick={handleSearch}
                  className="TenderReport-btn TenderReport-btn-primary"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="TenderReport-table-container">
              <table className="TenderReport-table">
                <thead>
                  <tr>
                    <th>PROJECT NAME</th>
                    <th>PROJECT TITLE</th>
                    <th>ORGANISATION</th>
                    <th>PUBLISHED DATE</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTenders.length > 0 ? (
                    filteredTenders.map((t) => (
                      <tr key={t._id}>
                        <td data-label="PROJECT NAME">{t.projectName}</td>
                        <td data-label="PROJECT TITLE">{t.projectTitle}</td>
                        <td data-label="ORGANISATION">{t.organisation}</td>
                        <td data-label="PUBLISHED DATE">
                          {new Date(t.publishingDate).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="TenderReport-no-data">
                        No tenders found matching your criteria.
                      </td>
                    </tr>
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

export default TenderReport;