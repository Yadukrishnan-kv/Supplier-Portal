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
                    <td>MOD09620214</td>
                    <td>IT Support</td>
                    <td>ABC Supplier</td>
                    <td>Feb 26, 2021</td>
                    <td>Mar 06, 2021</td>
                    <td>
                      <button className="PurchaseOrder-icon-btn PurchaseOrder-search">
                        🔍
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>Marjan12345</td>
                    <td>Requirement for IT support</td>
                    <td>ABC Supplier</td>
                    <td>Mar 01, 2021</td>
                    <td>Mar 31, 2021</td>
                    <td>
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