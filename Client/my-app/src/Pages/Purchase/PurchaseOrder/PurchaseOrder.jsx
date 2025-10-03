import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./PurchaseOrder.css";

const PurchaseOrder = () => {
  return (
    <div className="PurchaseOrder-container">
      <Sidebar />
      <div className="PurchaseOrder-main-content">
        <Header />
        <div className="PurchaseOrder-content-main">
          <div className="PurchaseOrder-content-box">
            <div className="PurchaseOrder-header">
              <h2 className="PurchaseOrder-title">Purchase Orders</h2>
            </div>

            <div className="PurchaseOrder-table-container">
              <table className="PurchaseOrder-table">
                <thead>
                  <tr>
                    <th>Marjan Ref. No.</th>
                    <th>Project Title</th>
                    <th>Supplier Name</th>
                    <th>Published Date</th>
                    <th>Closing Date</th>
                    <th>View</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-label="Marjan Ref. No.">MOD09620214</td>
                    <td data-label="Project Title">IT Support</td>
                    <td data-label="Supplier Name">ABC Supplier</td>
                    <td data-label="Published Date">Feb 26, 2021</td>
                    <td data-label="Closing Date">Mar 06, 2021</td>
                    <td data-label="View">
                      <button className="PurchaseOrder-icon-btn PurchaseOrder-search">
                        🔍
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td data-label="Marjan Ref. No.">Marjan12345</td>
                    <td data-label="Project Title">Requirement for IT support</td>
                    <td data-label="Supplier Name">ABC Supplier</td>
                    <td data-label="Published Date">Mar 01, 2021</td>
                    <td data-label="Closing Date">Mar 31, 2021</td>
                    <td data-label="View">
                      <button className="PurchaseOrder-icon-btn PurchaseOrder-search">
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

export default PurchaseOrder;