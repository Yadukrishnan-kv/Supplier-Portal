"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";
import "./CompanyProfile.css";

const CompanyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // 1: Company, 2: Contact, 3: Services

  const backendUrl = process.env.REACT_APP_BACKEND_IP 

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${backendUrl}/api/suppliers/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(response.data.data);
    } catch (err) {
      console.error("Failed to fetch company profile", err);
      setError(err.response?.data?.message || "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (loading) {
    return (
      <div className="company-profile-container">
        <Sidebar />
        <div className="company-profile-main-content">
          <Header />
          <div className="company-profile-content-main">
            <div className="company-profile-loading">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="company-profile-container">
      <Sidebar />
      <div className="company-profile-main-content">
        <Header />
        <div className="company-profile-content-main">
          <div className="company-profile-content-box">
            <div className="company-profile-header">
              <h2 className="company-profile-title">Company Profile</h2>
              <p className="company-profile-subtitle">View your registered company information</p>
            </div>

            <div className="company-profile-content-container">
              {error && (
                <div className="company-profile-message company-profile-error">
                  <div className="company-profile-message-icon">✕</div>
                  <span>{error}</span>
                </div>
              )}

              {profile ? (
                <>
                  {/* Step Indicators */}
                  <div className="company-profile-step-indicators">
                    <div className={`company-profile-step-indicator ${currentStep >= 1 ? "completed" : "pending"}`}>
                      <div className="company-profile-step-number">1</div>
                      <div className="company-profile-step-label">Company Details</div>
                    </div>
                    <div className={`company-profile-step-indicator ${currentStep >= 2 ? "completed" : "pending"}`}>
                      <div className="company-profile-step-number">2</div>
                      <div className="company-profile-step-label">Contact Person</div>
                    </div>
                    <div className={`company-profile-step-indicator ${currentStep >= 3 ? "completed" : "pending"}`}>
                      <div className="company-profile-step-number">3</div>
                      <div className="company-profile-step-label">Product Services</div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="company-profile-form-content">
                    {currentStep === 1 && (
                      <div className="company-profile-form-section">
                        <h4 className="company-profile-section-title">1. Company Details</h4>
                        <div className="company-profile-form-grid-custom">
                          <div className="company-profile-form-row">
                            <div className="company-profile-form-group company-profile-form-group-small">
                              <label className="company-profile-form-label">Company Name</label>
                              <div className="company-profile-form-value">{profile.companyName}</div>
                            </div>
                            <div className="company-profile-form-group company-profile-form-group-large">
                              <label className="company-profile-form-label">Address</label>
                              <div className="company-profile-form-value">{profile.address}</div>
                            </div>
                          </div>

                          <div className="company-profile-form-row">
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">Postal Code</label>
                              <div className="company-profile-form-value">{profile.postalCode}</div>
                            </div>
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">Country</label>
                              <div className="company-profile-form-value">{profile.country}</div>
                            </div>
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">State</label>
                              <div className="company-profile-form-value">{profile.state}</div>
                            </div>
                          </div>

                          <div className="company-profile-form-row">
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">City</label>
                              <div className="company-profile-form-value">{profile.city}</div>
                            </div>
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">Telephone</label>
                              <div className="company-profile-form-value">{profile.telephone}</div>
                            </div>
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">Fax</label>
                              <div className="company-profile-form-value">{profile.fax || "-"}</div>
                            </div>
                          </div>

                          <div className="company-profile-form-row">
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">Email Address</label>
                              <div className="company-profile-form-value">{profile.emailAddress}</div>
                            </div>
                          </div>

                          <div className="company-profile-form-row">
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">Company Trade License</label>
                              <div className="company-profile-form-value">
                                {profile.companyTradeLicense ? (
                                  <a
                                    href={`${backendUrl}/uploads/${profile.companyTradeLicense}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="company-profile-link"
                                  >
                                    View Document
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </div>
                            <div className="company-profile-form-group company-profile-form-group-equal">
                              <label className="company-profile-form-label">VAT Registration Certificate</label>
                              <div className="company-profile-form-value">
                                {profile.vatRegistrationCertificate ? (
                                  <a
                                    href={`${backendUrl}/uploads/${profile.vatRegistrationCertificate}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="company-profile-link"
                                  >
                                    View Document
                                  </a>
                                ) : (
                                  "-"
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="company-profile-form-section">
                        <h4 className="company-profile-section-title">2. Contact Person</h4>
                        <div className="company-profile-form-grid">
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">First Name</label>
                            <div className="company-profile-form-value">{profile.firstName}</div>
                          </div>
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">Last Name</label>
                            <div className="company-profile-form-value">{profile.lastName}</div>
                          </div>
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">Designation</label>
                            <div className="company-profile-form-value">{profile.designation}</div>
                          </div>
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">Email Address</label>
                            <div className="company-profile-form-value">{profile.contactEmailAddress}</div>
                          </div>
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">Mobile</label>
                            <div className="company-profile-form-value">{profile.mobile}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="company-profile-form-section">
                        <h4 className="company-profile-section-title">3. Product & Services</h4>
                        <div className="company-profile-form-grid">
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">Category</label>
                            <div className="company-profile-form-value">{profile.category}</div>
                          </div>
                          <div className="company-profile-form-group">
                            <label className="company-profile-form-label">Subcategory</label>
                            <div className="company-profile-form-value">{profile.subCategory}</div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="company-profile-status-banner">
                          <span
                            className={`company-profile-status-badge ${
                              profile.status === "Active"
                                ? "company-profile-status-active"
                                : profile.status === "Inactive"
                                ? "company-profile-status-inactive"
                                : "company-profile-status-pending"
                            }`}
                          >
                            {profile.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="company-profile-form-navigation">
                    <button
                      onClick={prevStep}
                      className="company-profile-btn company-profile-btn-secondary"
                      disabled={currentStep === 1}
                    >
                      Previous
                    </button>

                    {currentStep < 3 ? (
                      <button onClick={nextStep} className="company-profile-btn company-profile-btn-primary">
                        Next
                      </button>
                    ) : (
                      <button
                        className="company-profile-btn company-profile-btn-primary"
                        disabled
                        style={{ opacity: 0.7 }}
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="company-profile-empty-state">
                  <p>No profile data found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;