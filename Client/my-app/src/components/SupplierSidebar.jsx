"use client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SupplierSidebar.css";
import { BsChevronDoubleLeft } from "react-icons/bs";
import { FaAngleDown, FaAngleRight } from "react-icons/fa6";

const SupplierSidebar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // 👈 Added for mobile toggle
  const navigate = useNavigate();

  const toggleDropdown = (section) => {
    setActiveDropdown(activeDropdown === section ? null : section);
  };

  const handleItemClick = (item) => {
    setActiveItem(item);
    setIsMobileMenuOpen(false); // Close sidebar on mobile after click
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // clear token or session data
    navigate("/"); // redirect to login page
    setIsMobileMenuOpen(false);
  };

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
      <aside className={`suppliersidebar ${isMobileMenuOpen ? "mobile-open" : ""}`}>
        {/* Header */}
        <div className="suppliersidebar-header">
          <div className="suppliersidebar-logo-container">
            <div className="suppliersidebar-logo">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#8B5CF6" />
                <path d="M2 17L12 22L22 17" stroke="#8B5CF6" strokeWidth="2" fill="none" />
                <path d="M2 12L12 17L22 12" stroke="#8B5CF6" strokeWidth="2" fill="none" />
              </svg>
            </div>
          </div>
          <button className="suppliersidebar-collapse-btn">
            <BsChevronDoubleLeft />
          </button>
        </div>

        {/* Dashboard Section */}
        <div className="suppliersidebar-dashboard-section">
          <div className="suppliersidebar-menu-item">
            <button
              className={`suppliersidebar-menu-button ${activeItem === "dashboard" ? "active" : ""}`}
              onClick={() => handleItemClick("dashboard")}
            >
              <div className="suppliersidebar-menu-icon">
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
              <span className="suppliersidebar-menu-text">Dashboard</span>
            </button>
          </div>
        </div>

        {/* Apps Section */}
        <div className="suppliersidebar-apps-section">
          <div className="suppliersidebar-section-divider">
            <span className="suppliersidebar-section-title">APPS</span>
          </div>
          <div className="suppliersidebar-apps-menu-container">
            <nav className="suppliersidebar-nav-section">
              {/* View RFQ/RFP */}
              <div className="suppliersidebar-menu-item suppliersidebar-dropdown-item">
                <button
                  className="suppliersidebar-menu-button suppliersidebar-dropdown-button"
                  onClick={() => toggleDropdown("viewRFQ")}
                >
                  <div className="suppliersidebar-menu-icon">
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
                  <span className="suppliersidebar-menu-text">View RFQ/RFP</span>
                  {activeDropdown === "viewRFQ" ? (
                    <FaAngleDown className="suppliersidebar-dropdown-arrow" />
                  ) : (
                    <FaAngleRight className="suppliersidebar-dropdown-arrow" />
                  )}
                </button>
                <ul className={`suppliersidebar-submenu ${activeDropdown === "viewRFQ" ? "show" : ""}`}>
                  <li>
                    <Link
                      to="/listalltenders"
                      className="suppliersidebar-submenu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      View all RFQ/RFP
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/pendingTender"
                      className="suppliersidebar-submenu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Pending Review
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/approvedTender"
                      className="suppliersidebar-submenu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Approved RFQ/RFP
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/rejectTender"
                      className="suppliersidebar-submenu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Rejected RFQ/RFP
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company Profile */}
              <div className="suppliersidebar-menu-item">
                <Link
                  to="/companyProfile"
                  className={`suppliersidebar-menu-button ${activeItem === "companyProfile" ? "active" : ""}`}
                  onClick={() => handleItemClick("companyProfile")}
                  style={{ textDecoration: "none", color: "#000" }}
                >
                  <div className="suppliersidebar-menu-icon">
                    <svg
                      className="shrink-0 group-hover:!text-primary"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M24 5C24 6.65685 22.6569 8 21 8C19.3431 8 18 6.65685 18 5C18 3.34315 19.3431 2 21 2C22.6569 2 24 3.34315 24 5Z" fill="currentColor" />
                      <path d="M17.2339 7.46394L15.6973 8.74444C14.671 9.59966 13.9585 10.1915 13.357 10.5784C12.7747 10.9529 12.3798 11.0786 12.0002 11.0786C11.6206 11.0786 11.2258 10.9529 10.6435 10.5784C10.0419 10.1915 9.32941 9.59966 8.30315 8.74444L5.92837 6.76546C5.57834 6.47377 5.05812 6.52106 4.76643 6.87109C4.47474 7.22112 4.52204 7.74133 4.87206 8.03302L7.28821 10.0465C8.2632 10.859 9.05344 11.5176 9.75091 11.9661C10.4775 12.4334 11.185 12.7286 12.0002 12.7286C12.8154 12.7286 13.523 12.4334 14.2495 11.9661C14.947 11.5176 15.7372 10.859 16.7122 10.0465L18.3785 8.65795C17.9274 8.33414 17.5388 7.92898 17.2339 7.46394Z" fill="currentColor" />
                      <path d="M18.4538 6.58719C18.7362 6.53653 19.0372 6.63487 19.234 6.87109C19.3965 7.06614 19.4538 7.31403 19.4121 7.54579C19.0244 7.30344 18.696 6.97499 18.4538 6.58719Z" fill="currentColor" />
                      <path opacity="0.5" d="M16.9576 3.02099C16.156 3 15.2437 3 14.2 3H9.8C5.65164 3 3.57746 3 2.28873 4.31802C1 5.63604 1 7.75736 1 12C1 16.2426 1 18.364 2.28873 19.682C3.57746 21 5.65164 21 9.8 21H14.2C18.3484 21 20.4225 21 21.7113 19.682C23 18.364 23 16.2426 23 12C23 10.9326 23 9.99953 22.9795 9.1797C22.3821 9.47943 21.7103 9.64773 21 9.64773C18.5147 9.64773 16.5 7.58722 16.5 5.04545C16.5 4.31904 16.6646 3.63193 16.9576 3.02099Z" fill="currentColor" />
                    </svg>
                  </div>
                  <span className="suppliersidebar-menu-text">Company Profile</span>
                </Link>
              </div>

              {/* Settings */}
              <div className="suppliersidebar-menu-item suppliersidebar-dropdown-item">
                <button
                  className="suppliersidebar-menu-button suppliersidebar-dropdown-button"
                  onClick={() => toggleDropdown("settings")}
                >
                  <div className="suppliersidebar-menu-icon">
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
                  <span className="suppliersidebar-menu-text">Settings</span>
                  {activeDropdown === "settings" ? (
                    <FaAngleDown className="suppliersidebar-dropdown-arrow" />
                  ) : (
                    <FaAngleRight className="suppliersidebar-dropdown-arrow" />
                  )}
                </button>
                <ul className={`suppliersidebar-submenu ${activeDropdown === "settings" ? "show" : ""}`}>
                  <li>
                    <Link
                      to="/changePassword"
                      className="suppliersidebar-submenu-link"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Change Password
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="suppliersidebar-menu-item">
                <button className="suppliersidebar-menu-button" onClick={handleLogout}>
                  <div className="suppliersidebar-menu-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
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

export default SupplierSidebar;