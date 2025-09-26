"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sidebar.css";
import { BsChevronDoubleLeft } from "react-icons/bs";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";

const Sidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("sales");
  const [userRole, setUserRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // For mobile toggle
  const navigate = useNavigate();
  const backendUrl = process.env.REACT_APP_BACKEND_IP;

  useEffect(() => {
    fetchUserPermissions();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await axios.get(`${backendUrl}/api/admin/user-permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUserRole(response.data.role);
      setPermissions(response.data.permissions || {});
    } catch (err) {
      console.error("Failed to fetch user permissions", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("role");
    navigate("/");
  };

  const hasPermission = (menuKey) => {
    if (userRole === "admin") return true;
    return permissions[menuKey] === true;
  };

  if (loading) {
    return (
      <>
<button className="mobile-menu-toggle">☰</button>        <aside className="sidebar">Loading...</aside>
      </>
    );
  }

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8B5CF6" />
                <path d="M2 17L12 22L22 17" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                <path d="M2 12L12 17L22 12" stroke="#8B5CF6" strokeWidth="2" fill="none" />
              </svg>
            </div>
            {/* <span className="logo-text">VRISTO</span> */}
          </div>
          <button className="collapse-btn">
            <BsChevronDoubleLeft />
          </button>
        </div>

        {/* Dashboard Section */}
        <div className="dashboard-section">
          <div className="menu-item dropdown-item">
            <button
              className="menu-button dropdown-button"
              onClick={() => toggleDropdown("dashboard")}
            >
              <div className="menu-icon">
                <svg
                  className="shrink-0 group-hover:!text-primary"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    opacity="0.5"
                    d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                    fill="currentColor"
                  ></path>
                  <path
                    d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <span className="menu-text">Dashboard</span>
              {activeDropdown === "dashboard" ? (
                <FaAngleDown className="dropdown-arrow" />
              ) : (
                <FaAngleRight className="dropdown-arrow" />
              )}
            </button>
            
          </div>
        </div>

        {/* Apps Section */}
        <div className="apps-section">
          <div className="section-divider">
            <span className="section-title">APPS</span>
          </div>
          <div className="apps-menu-container">
            <nav className="nav-section">
              {/* Manage Suppliers */}
              {hasPermission("manageSuppliers") && (
                <div className="menu-item dropdown-item">
                  <button
                    className="menu-button dropdown-button"
                    onClick={() => toggleDropdown("manageSuppliers")}
                  >
                    <div className="menu-icon">
                      <svg
                        className="shrink-0 group-hover:!text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V7.25H14C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75L12.75 8.75L12.75 10C12.75 10.4142 12.4142 10.75 12 10.75C11.5858 10.75 11.25 10.4142 11.25 10L11.25 8.75H9.99997C9.58575 8.75 9.24997 8.41421 9.24997 8C9.24997 7.58579 9.58575 7.25 9.99997 7.25H11.25L11.25 6C11.25 5.58579 11.5858 5.25 12 5.25ZM7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14ZM8.25 18C8.25 17.5858 8.58579 17.25 9 17.25H15C15.4142 17.25 15.75 17.5858 15.75 18C15.75 18.4142 15.4142 18.75 15 18.75H9C8.58579 18.75 8.25 18.4142 8.25 18Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <span className="menu-text">Manage Suppliers</span>
                    {activeDropdown === "manageSuppliers" ? (
                      <FaAngleDown className="dropdown-arrow" />
                    ) : (
                      <FaAngleRight className="dropdown-arrow" />
                    )}
                  </button>
                  <ul className={`submenu ${activeDropdown === "manageSuppliers" ? "show" : ""}`}>
                    <li>
                      <Link to="/newSupplierRequest" className="submenu-link">
                        New Supplier Request
                      </Link>
                    </li>
                    <li>
                      <Link to="/activeSuppliers" className="submenu-link">
                        Active Suppliers
                      </Link>
                    </li>
                    <li>
                      <Link to="/inactiveSuppliers" className="submenu-link">
                        Inactive Suppliers
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Manage Tenders */}
              {hasPermission("manageTenders") && (
                <div className="menu-item dropdown-item">
                  <button
                    className="menu-button dropdown-button"
                    onClick={() => toggleDropdown("manageTenders")}
                  >
                    <div className="menu-icon">
                      <svg
                        className="shrink-0 group-hover:!text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.5"
                          d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <span className="menu-text">Manage Tenders</span>
                    {activeDropdown === "manageTenders" ? (
                      <FaAngleDown className="dropdown-arrow" />
                    ) : (
                      <FaAngleRight className="dropdown-arrow" />
                    )}
                  </button>
                  <ul className={`submenu ${activeDropdown === "manageTenders" ? "show" : ""}`}>
                    <li>
                      <Link to="/newtender" className="submenu-link">
                        Add New Tender
                      </Link>
                    </li>
                    <li>
                      <Link to="/DraftTender" className="submenu-link">
                        Draft
                      </Link>
                    </li>
                    <li>
                      <Link to="/listTender" className="submenu-link">
                        Published
                      </Link>
                    </li>
                    <li>
                      <Link to="/interestReceived" className="submenu-link">
                        Interests Received
                      </Link>
                    </li>
                    <li>
                      <Link to="/quotationReceived" className="submenu-link">
                        Quotation Received
                      </Link>
                    </li>
                     <li>
                      <Link to="/compareQuotation" className="submenu-link">
                       Compare Quotation
                      </Link>
                    </li>
                     <li>
                      <Link to="/selectedQuotationView" className="submenu-link">
                     Selected Quotation
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Purchase Requests */}
{hasPermission("purchaseRequests") && (
  <div className="menu-item">
    <Link to="/purchaseRequest" className="menu-button" onClick={() => handleItemClick("purchaseRequests")} style={{ textDecoration: 'none' }}>
      <div className="menu-icon">
        <svg
          className="shrink-0 group-hover:!text-primary"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 7H15M9 12H15M9 17H13M17 21H7C5.89543 21 5 20.1046 5 19V5C5 3.89543 5.89543 3 7 3H12.5858C12.851 3 13.1054 3.10536 13.2929 3.29289L18.7071 8.70711C18.8946 8.89464 19 9.149 19 9.41421V19C19 20.1046 18.1046 21 17 21Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="menu-text">Purchase Requests</span>
    </Link>
  </div>
)}

{/* Purchase Orders */}
{hasPermission("purchaseOrders") && (
  <div className="menu-item">
    <Link to="/purchaseOrder" className="menu-button" onClick={() => handleItemClick("purchaseOrders")} style={{ textDecoration: 'none' }}>
      <div className="menu-icon">
        <svg
          className="shrink-0 group-hover:!text-primary"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 12H19M5 16H19M9 8H15M5 8H6M18 8H19M3 6V18C3 19.1046 3.89543 20 5 20H19C20.1046 20 21 19.1046 21 18V6C21 4.89543 20.1046 4 19 4H5C3.89543 4 3 4.89543 3 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="menu-text">Purchase Orders</span>
    </Link>
  </div>
)}

               {/* NEW: Reports Menu */}
              {hasPermission("reports") && (
                <div className="menu-item dropdown-item">
                  <button
                    className="menu-button dropdown-button"
                    onClick={() => toggleDropdown("reports")}
                  >
                    <div className="menu-icon">
                      <svg
                        className="shrink-0 group-hover:!text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M14 2H6C5.44772 2 5 2.44772 5 3V19C5 19.5523 5.44772 20 6 20H18C18.5523 20 19 19.5523 19 19V8L14 2Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="none"
                        />
                        <path
                          d="M14 2V8H18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9 12H15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M9 16H15"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <span className="menu-text">Reports</span>
                    {activeDropdown === "reports" ? (
                      <FaAngleDown className="dropdown-arrow" />
                    ) : (
                      <FaAngleRight className="dropdown-arrow" />
                    )}
                  </button>
                  <ul className={`submenu ${activeDropdown === "reports" ? "show" : ""}`}>
                    <li>
                      <Link to="/tenderreport" className="submenu-link">
                        Tender Report
                      </Link>
                    </li>
                    <li>
                      <Link to="/supplierreport" className="submenu-link">
                        Supplier Report
                      </Link>
                    </li>
                  </ul>
                </div>
              )}


              {/* Master Tables */}
              {hasPermission("masterTables") && (
                <div className="menu-item dropdown-item">
                  <button
                    className="menu-button dropdown-button"
                    onClick={() => toggleDropdown("masterTables")}
                  >
                    <div className="menu-icon">
                      <svg
                        className="shrink-0 group-hover:!text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.5"
                          d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <span className="menu-text">Master Tables</span>
                    {activeDropdown === "masterTables" ? (
                      <FaAngleDown className="dropdown-arrow" />
                    ) : (
                      <FaAngleRight className="dropdown-arrow" />
                    )}
                  </button>
                  <ul className={`submenu ${activeDropdown === "masterTables" ? "show" : ""}`}>
                    <li>
                      <Link to="/listCategory" className="submenu-link">
                        Category
                      </Link>
                    </li>
                    <li>
                      <Link to="/listsubCategory" className="submenu-link">
                        Subcategory
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

              {/* Sub Admin */}
              {hasPermission("subAdmin") && (
                <div className="menu-item dropdown-item">
                  <button
                    className="menu-button dropdown-button"
                    onClick={() => toggleDropdown("subAdmin")}
                  >
                    <div className="menu-icon">
                      <svg
                        className="shrink-0 group-hover:!text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z"
                          fill="currentColor"
                        ></path>
                        <path
                          opacity="0.5"
                          d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <span className="menu-text">Sub Admin</span>
                    {activeDropdown === "subAdmin" ? (
                      <FaAngleDown className="dropdown-arrow" />
                    ) : (
                      <FaAngleRight className="dropdown-arrow" />
                    )}
                  </button>
                  <ul className={`submenu ${activeDropdown === "subAdmin" ? "show" : ""}`}>
                    <li>
                      <Link to="/listSubadmin" className="submenu-link">
                        Sub Admins
                      </Link>
                    </li>
                    {userRole === "admin" && (
                      <li>
                        <Link to="/role" className="submenu-link">
                          Role
                        </Link>
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Settings */}
              {hasPermission("settings") && (
                <div className="menu-item dropdown-item">
                  <button
                    className="menu-button dropdown-button"
                    onClick={() => toggleDropdown("settings")}
                  >
                    <div className="menu-icon">
                      <svg
                        className="shrink-0 group-hover:!text-primary"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.5"
                          d="M3 10C3 6.22876 3 4.34315 4.17157 3.17157C5.34315 2 7.22876 2 11 2H13C16.7712 2 18.6569 2 19.8284 3.17157C21 4.34315 21 6.22876 21 10V14C21 17.7712 21 19.6569 19.8284 20.8284C18.6569 22 16.7712 22 13 22H11C7.22876 22 5.34315 22 4.17157 20.8284C3 19.6569 3 17.7712 3 14V10Z"
                          fill="currentColor"
                        ></path>
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 5.25C12.4142 5.25 12.75 5.58579 12.75 6V7.25H14C14.4142 7.25 14.75 7.58579 14.75 8C14.75 8.41421 14.4142 8.75 14 8.75L12.75 8.75L12.75 10C12.75 10.4142 12.4142 10.75 12 10.75C11.5858 10.75 11.25 10.4142 11.25 10L11.25 8.75H9.99997C9.58575 8.75 9.24997 8.41421 9.24997 8C9.24997 7.58579 9.58575 7.25 9.99997 7.25H11.25L11.25 6C11.25 5.58579 11.5858 5.25 12 5.25ZM7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H16C16.4142 13.25 16.75 13.5858 16.75 14C16.75 14.4142 16.4142 14.75 16 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14ZM8.25 18C8.25 17.5858 8.58579 17.25 9 17.25H15C15.4142 17.25 15.75 17.5858 15.75 18C15.75 18.4142 15.4142 18.75 15 18.75H9C8.58579 18.75 8.25 18.4142 8.25 18Z"
                          fill="currentColor"
                        ></path>
                      </svg>
                    </div>
                    <span className="menu-text">Settings</span>
                    {activeDropdown === "settings" ? (
                      <FaAngleDown className="dropdown-arrow" />
                    ) : (
                      <FaAngleRight className="dropdown-arrow" />
                    )}
                  </button>
                  <ul className={`submenu ${activeDropdown === "settings" ? "show" : ""}`}>
                    <li>
                      <Link to="/profile" className="submenu-link">
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/changePassword" className="submenu-link">
                        Change Password
                      </Link>
                    </li>
                  </ul>
                </div>
              )}

            
              {/* Logout */}
              <div className="suppliersidebar-menu-item">
                <button
                  className="suppliersidebar-menu-button"
                  onClick={handleLogout}
                >
                  <div className="suppliersidebar-menu-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zm3-10H5c-1.1 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                    </svg>
                  </div>
                  <span className="suppliersidebar-menu-text">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;