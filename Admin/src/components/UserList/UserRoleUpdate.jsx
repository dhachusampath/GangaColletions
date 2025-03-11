import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import "./UserRoleUpdate.css";
import { useStore } from '../Context/Store';

// Add Toastify styles in your root component (e.g., App.js)
import 'react-toastify/dist/ReactToastify.css';

const UserRoleUpdate = () => {
  const {API_BASE_URL, users, setUsers } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('All');

  // Filter users based on search query and selected role filter
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'All' || (filterRole === 'Retailer' ? user.isRetailer : !user.isRetailer);

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

  // Handle Role Update
  const handleRoleUpdate = (newRole) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to make the selected users ${newRole}s?`
    );

    if (confirmUpdate) {
      selectedUsers.forEach((userId) => {
        updateUserRole(userId, newRole); // Call the function to update the user's role
      });
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      // Determine if the user is a retailer or wholesaler based on the selected role
      const isRetailer = newRole === 'Retailer';

      // Make a PUT request to the backend to update the user's role
      const response = await axios.put(`https://gangacollection-backend.onrender.com/auth/user/${userId}/role`, { isRetailer });

      // Check if the update was successful
      if (response.data.message === 'Role updated successfully') {
        // If successful, update the state with the new role
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isRetailer } : user
          )
        );
        toast.success('Role updated successfully!'); // Toastify success message
      } else {
        // If something went wrong, handle it here
        toast.error('Failed to update role'); // Toastify error message
      }
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('An error occurred while updating the role'); // Toastify error message
    }
  };

  return (
    <div className="user-list">
      {/* Search and Filter */}
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

        <button
          className="user-list-role-update-btn"
          onClick={() => handleRoleUpdate('Retailer')}
        >
          Make Selected Users Retailers
        </button>
        <button
          className="user-list-role-update-btn"
          onClick={() => handleRoleUpdate('Wholesaler')}
        >
          Make Selected Users Wholesalers
        </button>
      </div>

      {/* User List Table */}
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

      {/* Toastify container */}
      <ToastContainer />
    </div>
  );
};

export default UserRoleUpdate;
