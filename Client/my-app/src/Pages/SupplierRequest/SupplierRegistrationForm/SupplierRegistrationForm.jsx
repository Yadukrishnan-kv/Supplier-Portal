"use client";

import { useState, useEffect } from "react";
import axios from "axios";

import "./SupplierRegistration.css";

const SupplierRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState([]);

  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    postalCode: "",
    country: "",
    state: "",
    city: "",
    telephone: "",
    fax: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
    companyTradeLicense: null,
    vatRegistrationCertificate: null,
    firstName: "",
    lastName: "",
    designation: "",
    contactEmailAddress: "",
    mobile: "",
    category: "",
    subCategory: "",
  });

  const [stepCompletion, setStepCompletion] = useState({
    1: false, // Company Details
    2: false, // Contact Person
    3: false, // Product Services
  });

  const backendUrl = process.env.REACT_APP_BACKEND_IP ;

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    checkStepCompletion();
  }, [formData]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/subcategory/view`);
      const data = res.data;
      const uniqueCategories = [...new Set(data.map((item) => item.category))];
      setCategories(uniqueCategories);
      setSubCategories(data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Reset subCategory when category changes
    if (name === "category") {
      setFormData((prev) => ({
        ...prev,
        subCategory: "",
      }));
      setFieldErrors((prev) => ({
        ...prev,
        subCategory: "",
      }));
    }

    if (name === "confirmPassword" || name === "password") {
      if (name === "confirmPassword" && value !== formData.password) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (name === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else if (name === "confirmPassword" && value === formData.password) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      } else if (name === "password" && value === formData.confirmPassword) {
        setFieldErrors((prev) => ({
          ...prev,
          confirmPassword: "",
        }));
      }
    }

    setError(null);
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files[0],
    }));

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    setError(null);
  };

  const validateCurrentStep = () => {
    const errors = {};

    if (currentStep === 1) {
      const companyFields = [
        { field: "companyName", label: "Company Name" },
        { field: "address", label: "Address" },
        { field: "postalCode", label: "Postal Code" },
        { field: "country", label: "Country" },
        { field: "state", label: "State" },
        { field: "city", label: "City" },
        { field: "telephone", label: "Telephone" },
        { field: "emailAddress", label: "Email Address" },
        { field: "password", label: "Password" },
        { field: "confirmPassword", label: "Confirm Password" },
      ];

      companyFields.forEach(({ field, label }) => {
        if (!formData[field] || formData[field].toString().trim() === "") {
          errors[field] = `${label} is required`;
        }
      });

      if (!formData.companyTradeLicense) {
        errors.companyTradeLicense = "Company Trade License is required";
      }
      if (!formData.vatRegistrationCertificate) {
        errors.vatRegistrationCertificate = "VAT Registration Certificate is required";
      }

      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Passwords do not match";
      }
    } else if (currentStep === 2) {
      const contactFields = [
        { field: "firstName", label: "First Name" },
        { field: "lastName", label: "Last Name" },
        { field: "designation", label: "Designation" },
        { field: "contactEmailAddress", label: "Email Address" },
        { field: "mobile", label: "Mobile" },
      ];

      contactFields.forEach(({ field, label }) => {
        if (!formData[field] || formData[field].toString().trim() === "") {
          errors[field] = `${label} is required`;
        }
      });
    } else if (currentStep === 3) {
      if (!formData.category) {
        errors.category = "Please select a category";
      }
      if (!formData.subCategory) {
        errors.subCategory = "Please select a subcategory";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const checkStepCompletion = () => {
    const newCompletion = { ...stepCompletion };

    const companyFields = [
      "companyName",
      "address",
      "postalCode",
      "country",
      "state",
      "city",
      "telephone",
      "emailAddress",
      "password",
      "confirmPassword",
    ];
    const companyFieldsComplete = companyFields.every(
      (field) => formData[field] && formData[field].toString().trim() !== ""
    );
    const filesComplete = formData.companyTradeLicense && formData.vatRegistrationCertificate;
    const passwordsMatch = formData.password === formData.confirmPassword;
    newCompletion[1] = companyFieldsComplete && filesComplete && passwordsMatch;

    const contactFields = ["firstName", "lastName", "designation", "contactEmailAddress", "mobile"];
    newCompletion[2] = contactFields.every((field) => formData[field] && formData[field].toString().trim() !== "");

    newCompletion[3] = formData.category && formData.subCategory;

    setStepCompletion(newCompletion);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (!stepCompletion[1] || !stepCompletion[2] || !stepCompletion[3]) {
      setError("Please complete all sections before submitting");
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] instanceof File) {
          submitData.append(key, formData[key]);
        } else if (formData[key] !== "") {
          submitData.append(key, formData[key]);
        }
      });

      const response = await axios.post(`${backendUrl}/api/suppliers/add`, submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setCompletedSteps((prev) => [...prev, 3]);
        setSuccess(true);
        setError(null);
        setFormData({
          companyName: "",
          address: "",
          postalCode: "",
          country: "",
          state: "",
          city: "",
          telephone: "",
          fax: "",
          emailAddress: "",
          password: "",
          confirmPassword: "",
          companyTradeLicense: null,
          vatRegistrationCertificate: null,
          firstName: "",
          lastName: "",
          designation: "",
          contactEmailAddress: "",
          mobile: "",
          category: "",
          subCategory: "",
        });
        setFieldErrors({});
        setCurrentStep(1);
        setCompletedSteps([]);
      }
    } catch (err) {
      console.error("Failed to submit supplier request", err);
      setError(err.response?.data?.message || "Failed to submit supplier request");
      if (err.response?.data?.field) {
        setFieldErrors((prev) => ({
          ...prev,
          [err.response.data.field]: err.response.data.message,
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (step) => {
    if (completedSteps.includes(step)) return "completed";
    if (currentStep === step) return "current";
    return "pending";
  };

  const renderCompanyDetails = () => (
    <div className="supplier-form-section">
      <div className="supplier-form-grid-custom">
        <div className="supplier-form-row">
          <div className="supplier-form-group supplier-form-group-small">
            <label className="supplier-form-label">Company Name: *</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.companyName ? "supplier-form-input-error" : ""}`}
              placeholder="Enter company name"
            />
            {fieldErrors.companyName && <span className="supplier-form-error">{fieldErrors.companyName}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-large">
            <label className="supplier-form-label">Address: *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.address ? "supplier-form-input-error" : ""}`}
              placeholder="Enter address"
            />
            {fieldErrors.address && <span className="supplier-form-error">{fieldErrors.address}</span>}
          </div>
        </div>

        <div className="supplier-form-row">
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Postal Code: *</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.postalCode ? "supplier-form-input-error" : ""}`}
              placeholder="Enter postal code"
            />
            {fieldErrors.postalCode && <span className="supplier-form-error">{fieldErrors.postalCode}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Country: *</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.country ? "supplier-form-input-error" : ""}`}
              placeholder="Enter country"
            />
            {fieldErrors.country && <span className="supplier-form-error">{fieldErrors.country}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">State: *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.state ? "supplier-form-input-error" : ""}`}
              placeholder="Enter state"
            />
            {fieldErrors.state && <span className="supplier-form-error">{fieldErrors.state}</span>}
          </div>
        </div>

        <div className="supplier-form-row">
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">City: *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.city ? "supplier-form-input-error" : ""}`}
              placeholder="Enter city"
            />
            {fieldErrors.city && <span className="supplier-form-error">{fieldErrors.city}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Telephone: *</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.telephone ? "supplier-form-input-error" : ""}`}
              placeholder="Enter telephone"
            />
            {fieldErrors.telephone && <span className="supplier-form-error">{fieldErrors.telephone}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Fax:</label>
            <input
              type="text"
              name="fax"
              value={formData.fax || ""}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.fax ? "supplier-form-input-error" : ""}`}
              placeholder="Enter fax (optional)"
            />
            {fieldErrors.fax && <span className="supplier-form-error">{fieldErrors.fax}</span>}
          </div>
        </div>

        <div className="supplier-form-row">
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Email Address: *</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.emailAddress ? "supplier-form-input-error" : ""}`}
              placeholder="Enter email address"
            />
            {fieldErrors.emailAddress && <span className="supplier-form-error">{fieldErrors.emailAddress}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Password: *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.password ? "supplier-form-input-error" : ""}`}
              placeholder="Enter password"
            />
            {fieldErrors.password && <span className="supplier-form-error">{fieldErrors.password}</span>}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Confirm Password: *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.confirmPassword ? "supplier-form-input-error" : ""}`}
              placeholder="Confirm password"
            />
            {fieldErrors.confirmPassword && <span className="supplier-form-error">{fieldErrors.confirmPassword}</span>}
          </div>
        </div>

        <div className="supplier-form-row">
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">Company Trade License: *</label>
            <input
              type="file"
              name="companyTradeLicense"
              onChange={handleFileChange}
              className={`supplier-form-file ${fieldErrors.companyTradeLicense ? "supplier-form-input-error" : ""}`}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {fieldErrors.companyTradeLicense && (
              <span className="supplier-form-error">{fieldErrors.companyTradeLicense}</span>
            )}
          </div>
          <div className="supplier-form-group supplier-form-group-equal">
            <label className="supplier-form-label">VAT Registration Certificate: *</label>
            <input
              type="file"
              name="vatRegistrationCertificate"
              onChange={handleFileChange}
              className={`supplier-form-file ${fieldErrors.vatRegistrationCertificate ? "supplier-form-input-error" : ""}`}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {fieldErrors.vatRegistrationCertificate && (
              <span className="supplier-form-error">{fieldErrors.vatRegistrationCertificate}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactPerson = () => (
    <div className="supplier-form-section">
      <div className="supplier-form-grid">
        <div className="supplier-form-group">
          <label className="supplier-form-label">First Name: *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={`supplier-form-input ${fieldErrors.firstName ? "supplier-form-input-error" : ""}`}
            placeholder="Enter first name"
          />
          {fieldErrors.firstName && <span className="supplier-form-error">{fieldErrors.firstName}</span>}
        </div>

        <div className="supplier-form-group">
          <label className="supplier-form-label">Last Name: *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={`supplier-form-input ${fieldErrors.lastName ? "supplier-form-input-error" : ""}`}
            placeholder="Enter last name"
          />
          {fieldErrors.lastName && <span className="supplier-form-error">{fieldErrors.lastName}</span>}
        </div>

        <div className="supplier-form-group">
          <label className="supplier-form-label">Designation: *</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className={`supplier-form-input ${fieldErrors.designation ? "supplier-form-input-error" : ""}`}
            placeholder="Enter designation"
          />
          {fieldErrors.designation && <span className="supplier-form-error">{fieldErrors.designation}</span>}
        </div>

        <div className="supplier-form-group">
          <label className="supplier-form-label">Email Address: *</label>
          <input
            type="email"
            name="contactEmailAddress"
            value={formData.contactEmailAddress}
            onChange={handleInputChange}
            className={`supplier-form-input ${fieldErrors.contactEmailAddress ? "supplier-form-input-error" : ""}`}
            placeholder="Enter email address"
          />
          {fieldErrors.contactEmailAddress && (
            <span className="supplier-form-error">{fieldErrors.contactEmailAddress}</span>
          )}
        </div>

        <div className="supplier-form-group">
          <label className="supplier-form-label">Mobile: *</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className={`supplier-form-input ${fieldErrors.mobile ? "supplier-form-input-error" : ""}`}
            placeholder="Enter mobile number"
          />
          {fieldErrors.mobile && <span className="supplier-form-error">{fieldErrors.mobile}</span>}
        </div>
      </div>
    </div>
  );

  const renderProductServices = () => {
    const filteredSubCategories = subCategories.filter(
      (subCat) => subCat.category === formData.category
    );

    return (
      <div className="supplier-form-section">
        <div className="supplier-form-grid">
          <div className="supplier-form-group">
            <label className="supplier-form-label">Category: *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.category ? "supplier-form-input-error" : ""}`}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {fieldErrors.category && <span className="supplier-form-error">{fieldErrors.category}</span>}
          </div>

          <div className="supplier-form-group">
            <label className="supplier-form-label">Subcategory: *</label>
            <select
              name="subCategory"
              value={formData.subCategory}
              onChange={handleInputChange}
              className={`supplier-form-input ${fieldErrors.subCategory ? "supplier-form-input-error" : ""}`}
              disabled={!formData.category}
            >
              <option value="">Select a subcategory</option>
              {filteredSubCategories.map((subCat) => (
                <option key={subCat._id} value={subCat.subCategory}>
                  {subCat.subCategory}
                </option>
              ))}
            </select>
            {fieldErrors.subCategory && <span className="supplier-form-error">{fieldErrors.subCategory}</span>}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="supplier-container">
        <div className="supplier-main-content">
          <div className="supplier-content-main">
            <div className="supplier-loading">Submitting...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="supplier-container">
      <div className="supplier-main-content">
       
        <div className="supplier-content-main">
          <div className="supplier-content-box">
            <div className="supplier-header">
              <h2 className="supplier-title">Supplier Registration Page</h2>
              <p className="supplier-subtitle">Fill and submit the form</p>
            </div>

            <div className="supplier-content-container">
              <div className="supplier-registration-form">
                <div className="supplier-form-header">
                  <h3 className="supplier-form-title">REGISTRATION FORM</h3>
                  <p className="supplier-form-description">
                    A basic form wizard with form validation using Parsley js form validation plugin.
                  </p>
                </div>

                <div className="supplier-step-indicators">
                  <div className={`supplier-step-indicator ${getStepStatus(1)}`}>
                    <div className="supplier-step-number">1</div>
                    <div className="supplier-step-label">Company Details</div>
                  </div>
                  <div className={`supplier-step-indicator ${getStepStatus(2)}`}>
                    <div className="supplier-step-number">2</div>
                    <div className="supplier-step-label">Contact Person</div>
                  </div>
                  <div className={`supplier-step-indicator ${getStepStatus(3)}`}>
                    <div className="supplier-step-number">3</div>
                    <div className="supplier-step-label">Product Services</div>
                  </div>
                </div>

                <div className="supplier-form-content">
                  {error && (
                    <div className="supplier-message supplier-error">
                      <div className="supplier-message-icon">✕</div>
                      <span>{error}</span>
                    </div>
                  )}

                  {success && (
                    <div className="supplier-message supplier-success">
                      <div className="supplier-message-icon">✓</div>
                      <span>Supplier request submitted successfully!</span>
                    </div>
                  )}

                  {currentStep === 1 && renderCompanyDetails()}
                  {currentStep === 2 && renderContactPerson()}
                  {currentStep === 3 && renderProductServices()}
                </div>

                <div className="supplier-form-navigation">
                  <button
                    onClick={handlePrevious}
                    className="supplier-btn supplier-btn-secondary"
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>

                  {currentStep < 3 ? (
                    <button onClick={handleNext} className="supplier-btn supplier-btn-primary">
                      Next
                    </button>
                  ) : (
                    <button onClick={handleSubmit} className="supplier-btn supplier-btn-primary" disabled={loading}>
                      {loading ? "Submitting..." : "Finish"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierRegistrationForm;