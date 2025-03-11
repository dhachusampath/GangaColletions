import React, { useState } from "react";
import Papa from "papaparse";
import "./UserList.css";
import { useStore } from "../Context/Store";

const UserList = () => {
  const { users } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("All");

  // Filtered user data based on search and filter criteria
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.email || "").includes(searchQuery);
    const matchesRole =
      filterRole === "All" ||
      (filterRole === "Retailer" && user.isRetailer) ||
      (filterRole === "Wholesaler" && !user.isRetailer);

    return matchesSearch && matchesRole;
  });

  // Handle individual user selection
  const handleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle "Select All" checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user._id)); // Select all filtered user IDs
    } else {
      setSelectedUsers([]); // Deselect all
    }
  };

  // Check if all filtered users are selected
  const areAllSelected = selectedUsers.length === filteredUsers.length;

  // Export selected user data as CSV
  const handleExportCSV = () => {
    const dataToExport = users
      .filter((user) => selectedUsers.includes(user._id))
      .map((user) => ({
        Name: user.name,
        Email: user.email,
        Role: user.isRetailer ? "Retailer" : "Wholesaler",
      }));

    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "selected_user_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="user-list">
      <div className="user-list-filters">
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="user-list-search-input"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="user-list-role-filter"
        >
          <option value="All">All Roles</option>
          <option value="Retailer">Retailer</option>
          <option value="Wholesaler">Wholesaler</option>
        </select>
        <button className="user-list-export-btn" onClick={handleExportCSV}>
          Export CSV
        </button>
      </div>

      <table className="user-list-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={areAllSelected}
                onChange={handleSelectAll}
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={() => handleUserSelection(user._id)}
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.isRetailer ? "Retailer" : "Wholesaler"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
