"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import "./SupplierReport.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

const backendUrl = process.env.REACT_APP_BACKEND_IP;

const SupplierReport = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [companyNameSearch, setCompanyNameSearch] = useState("");

  useEffect(() => {
    Promise.all([
      axios.get(`${backendUrl}/api/suppliers/active`),
      axios.get(`${backendUrl}/api/tenders`)
    ])
      .then(([supRes, tenRes]) => {
        const sups = supRes.data.data;
        const tens = tenRes.data.data;

        const augmented = sups.map(sup => {
          let lastDate = null;
          tens.forEach(ten => {
            ten.interestedSuppliers.forEach(int => {
              if (int.supplierId.toString() === sup._id.toString()) {
                const intDate = new Date(int.interestedDate);
                if (!lastDate || intDate > lastDate) {
                  lastDate = intDate;
                }
              }
            });
          });
          return {
            ...sup,
            lastTenderDate: lastDate ? lastDate.toLocaleDateString() : "N/A",
            lastTenderValue: "N/A" // Placeholder, no value field
          };
        });

        setSuppliers(augmented);
        setFilteredSuppliers(augmented);
      })
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  const handleSearch = () => {
    const filtered = suppliers.filter(sup =>
      sup.companyName.toLowerCase().includes(companyNameSearch.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  return (
    <div className="SupplierReport-container">
      <Sidebar />
      <div className="SupplierReport-main-content">
        <Header />
        <div className="SupplierReport-content-main">
          <div className="SupplierReport-content-box">
            <div className="SupplierReport-header">
              <h2 className="SupplierReport-title">Supplier Report</h2>
              <div className="SupplierReport-search-wrapper">
                <input
                  type="text"
                  placeholder="Search by Company Name"
                  value={companyNameSearch}
                  onChange={(e) => setCompanyNameSearch(e.target.value)}
                  className="SupplierReport-search-input"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  className="SupplierReport-btn SupplierReport-btn-primary"
                >
                  Search
                </button>
              </div>
            </div>

            <div className="SupplierReport-table-container">
              <table className="SupplierReport-table">
                <thead>
                  <tr>
                    <th>COMPANY NAME</th>
                    <th>CONTACT NAME</th>
                    <th>CATEGORY</th>
                    <th>LAST TENDER</th>
                    <th>LAST TENDER VALUE</th>
                    <th>E-MAIL</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSuppliers.length > 0 ? (
                    filteredSuppliers.map(sup => (
                      <tr key={sup._id}>
                        <td data-label="COMPANY NAME">{sup.companyName}</td>
                        <td data-label="CONTACT NAME">{`${sup.firstName} ${sup.lastName}`}</td>
                        <td data-label="CATEGORY">{sup.category}</td>
                        <td data-label="LAST TENDER">{sup.lastTenderDate}</td>
                        <td data-label="LAST TENDER VALUE">{sup.lastTenderValue}</td>
                        <td data-label="E-MAIL">{sup.contactEmailAddress}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="SupplierReport-no-data">
                        No suppliers found matching your search.
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

export default SupplierReport;