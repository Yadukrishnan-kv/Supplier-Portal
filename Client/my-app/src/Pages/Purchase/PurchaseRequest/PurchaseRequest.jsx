import React from "react";
import "./PurchaseRequest.css";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

const PurchaseRequest = () => {
  return (
    <div className="PurchaseRequest-container">
      <Sidebar />
      <div className="PurchaseRequest-main-content">
        <Header />
        <div className="PurchaseRequest-content-main">
          <div className="PurchaseRequest-content-box">
            <div className="PurchaseRequest-header">
              <h2 className="PurchaseRequest-title">Purchase Requests</h2>
            </div>

            <div className="PurchaseRequest-table-container">
              <table className="PurchaseRequest-table">
                <thead>
                  <tr>
                    <th>Marjan Ref.</th>
                    <th>Project Title</th>
                    <th>Customer Name</th>
                    <th>Supplier Name</th>
                    <th>PR Date</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Marjan Ref.">PR-001</td>
                    <td data-label="Project Title">IT Support</td>
                    <td data-label="Customer Name">XYZ Corp</td>
                    <td data-label="Supplier Name">ABC Supplier</td>
                    <td data-label="PR Date">Feb 26, 2021</td>
                    <td data-label="View">
                      <button className="PurchaseRequest-icon-btn PurchaseRequest-search">
                        🔍
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Marjan Ref.">PR-002</td>
                    <td data-label="Project Title">Requirement for IT support</td>
                    <td data-label="Customer Name">ABC Ltd</td>
                    <td data-label="Supplier Name">ABC Supplier</td>
                    <td data-label="PR Date">Mar 01, 2021</td>
                    <td data-label="View">
                      <button className="PurchaseRequest-icon-btn PurchaseRequest-search">
                        🔍
                      </button>
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

export default PurchaseRequest;