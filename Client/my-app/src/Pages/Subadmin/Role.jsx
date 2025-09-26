"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./Role.css";

const Role = () => {
  const [subAdmins, setSubAdmins] = useState([]);
  const [permissions, setPermissions] = useState({});
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [savingStates, setSavingStates] = useState({});

  const backendUrl = process.env.REACT_APP_BACKEND_IP;

  // Available menus
  const availableMenus = [
    { key: "manageSuppliers", label: "Manage Suppliers" },
    
    { key: "masterTables", label: "Master Tables" },
    { key: "subAdmin", label: "Sub Admin" },
    { key: "settings", label: "Settings" },
  ];

  useEffect(() => {
    fetchSubAdmins();
  }, []);

  const fetchSubAdmins = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${backendUrl}/api/admin/subadmins`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubAdmins(response.data);

      // Fetch permissions for all subadmins
      const permissionsData = {};
      for (const subAdmin of response.data) {
        try {
          const permResponse = await axios.get(
            `${backendUrl}/api/admin/permissions/${subAdmin._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          permissionsData[subAdmin._id] = permResponse.data.permissions || {
            manageSuppliers: false,
            masterTables: false,
            subAdmin: false,
            settings: false,
          };
        } catch (err) {
          permissionsData[subAdmin._id] = {
            manageSuppliers: false,
            masterTables: false,
            subAdmin: false,
            settings: false,
          };
        }
      }
      setPermissions(permissionsData);
    } catch (err) {
      console.error("Failed to fetch sub-admins", err);
      setError("Failed to fetch sub-admins");
    }
  };

  const handlePermissionChange = async (subAdminId, menuKey) => {
    // Update UI immediately
    const newValue = !permissions[subAdminId]?.[menuKey];
    setPermissions((prev) => ({
      ...prev,
      [subAdminId]: {
        ...prev[subAdminId],
        [menuKey]: newValue,
      },
    }));

    // Set saving state for this specific checkbox
    setSavingStates((prev) => ({
      ...prev,
      [`${subAdminId}-${menuKey}`]: true,
    }));

    try {
      const token = localStorage.getItem("adminToken");
      const updatedPermissions = {
        ...permissions[subAdminId],
        [menuKey]: newValue,
      };

      await axios.post(
        `${backendUrl}/api/admin/permissions`,
        {
          subAdminId,
          permissions: updatedPermissions,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Show success message briefly
      setMessage("Permission updated successfully!");
      setTimeout(() => setMessage(null), 2000);
    } catch (err) {
      // Revert the change if save failed
      setPermissions((prev) => ({
        ...prev,
        [subAdminId]: {
          ...prev[subAdminId],
          [menuKey]: !newValue,
        },
      }));

      const errorMsg =
        err.response?.data?.message || "Failed to update permission";
      setError(errorMsg);
      setTimeout(() => setError(null), 3000);
    } finally {
      // Remove saving state
      setSavingStates((prev) => {
        const newState = { ...prev };
        delete newState[`${subAdminId}-${menuKey}`];
        return newState;
      });
    }
  };

  return (
    <div className="role-container">
      <Sidebar />
      <div className="role-main-content">
        <Header />
        <div className="role-content-main">
          <div className="role-content-box">
            <div className="role-header">
              <h2 className="role-title">Role Management</h2>
              <p className="role-subtitle">
                Manage permissions for all sub-admins
              </p>
            </div>

            <div className="role-content-container">
              {subAdmins.length > 0 ? (
                <div className="role-table-container">
                  <table className="role-table">
                    <thead>
                      <tr>
                        <th className="role-table-header role-name-column">
                          ROLE
                        </th>
                        {availableMenus.map((menu) => (
                          <th
                            key={menu.key}
                            className="role-table-header role-permission-column"
                          >
                            {menu.label.toUpperCase()}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {subAdmins.map((subAdmin) => (
                        <tr key={subAdmin._id} className="role-table-row">
                          <td className="role-table-cell role-name-cell">
                            <div className="role-subadmin-info">
                              <span className="role-subadmin-role">
                                subadmin
                              </span>
                            </div>
                          </td>
                          {availableMenus.map((menu) => (
                            <td
                              key={menu.key}
                              className="role-table-cell role-checkbox-cell"
                            >
                              <div className="role-checkbox-container">
                                <input
                                  type="checkbox"
                                  id={`${subAdmin._id}-${menu.key}`}
                                  checked={
                                    permissions[subAdmin._id]?.[menu.key] ||
                                    false
                                  }
                                  onChange={() =>
                                    handlePermissionChange(
                                      subAdmin._id,
                                      menu.key
                                    )
                                  }
                                  className="role-table-checkbox"
                                  disabled={
                                    savingStates[`${subAdmin._id}-${menu.key}`]
                                  }
                                />
                                <label
                                  htmlFor={`${subAdmin._id}-${menu.key}`}
                                  className="role-checkbox-custom"
                                >
                                  {savingStates[
                                    `${subAdmin._id}-${menu.key}`
                                  ] ? (
                                    <div className="role-checkbox-spinner"></div>
                                  ) : (
                                    <svg
                                      className="role-checkbox-icon"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                                    </svg>
                                  )}
                                </label>
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="role-empty-state">
                  <p>
                    No sub-admins found. Create some sub-admins first to manage
                    their permissions.
                  </p>
                </div>
              )}

              {message && (
                <div className="role-message role-success">
                  <div className="role-message-icon">✓</div>
                  <span>{message}</span>
                </div>
              )}

              {error && (
                <div className="role-message role-error">
                  <div className="role-message-icon">✕</div>
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Role;
