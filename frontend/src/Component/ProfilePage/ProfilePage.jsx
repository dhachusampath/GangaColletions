import React, { useEffect, useState } from 'react';
import { Edit2 } from "react-feather"; // Importing the pencil icon
import axios from 'axios'; // Axios for API requests
import './ProfilePage.css';
import { useStore } from '../Context/Store';
import userprofile from "../../assets/user.png"
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';

const ProfilePage = ({setActiveTab}) => {
  const [profileData, setProfileData] = useState(null); // State to store user data
  // const [url] = useState('https://gangacollection-backend.onrender.com'); // Base URL for API
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for error handling
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected profile image

  const { userRole, setUserRole ,setAuthToken,setUserId,setCart,API_BASE_URL} = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUserId = localStorage.getItem('userId'); // Retrieve userId from localStorage
      if (!storedUserId) return; // Ensure userId exists

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/user/${storedUserId}`);
        setProfileData(response.data.user); // Assuming response structure has 'user'
        setUserRole(response.data.user.isRetailer ? 'retailer' : 'wholesaler'); // Set role based on response
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile data.');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [API_BASE_URL, setUserRole]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]); // Update selected file state
  };
  const handleLogout = () => {
    navigate("/");  // Redirect to the homepage or login page
    localStorage.removeItem("token");  // Clear the token from localStorage
    localStorage.removeItem("userId");  // Clear the token from localStorage
    setAuthToken(null);  // Clear the token in the context
    setUserId(null);  // Clear the token in the context
    setCart([]); // Assuming `setCart` is a function to update cart in global state

  };
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) return;

    try {
      const formData = new FormData();
      formData.append('phone', profileData?.phone);
      if (selectedFile) {
        formData.append('profileImage', selectedFile); // Append the selected file
      }

      const response = await axios.put(`${API_BASE_URL}/auth/user/${storedUserId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfileData(response.data.user); // Update profile data with the response
      alert('Profile updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to update profile.');
    }
  };

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <main className="profile-page-container">
      {/* Profile Header Section */}
      <section className="profile-header">
        <div className="profile-image">
        <img
src={profileData?.profileImage ? `${API_BASE_URL}/api/images/${profileData.profileImage}` : userprofile}
  alt="User Profile"
/>
          <label htmlFor="profileImage" className="edit-image-button">
            <Edit2 size={16} /> {/* Pencil icon */}
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              onChange={handleFileChange}
              style={{ display: 'none' }} // Hide the file input
            />
          </label>
        </div>
        <div className="profile-info">
          <h1 className="profile-name">
            {profileData?.name || 'N/A'}{' '}
            {userRole === 'wholesaler' && <span className="user-role">(Wholesaler)</span>}
          </h1>
          <p className="profile-email">{profileData?.email || 'N/A'}</p>
          <p className="profile-joined-date">
            Joined on {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </section>

      {/* Profile Actions Section */}
      <section className="profile-actions">
        <h2>Manage Your Profile</h2>
        <div className="action-buttons">
          <button className="action-button view-orders-button" onClick={() => setActiveTab('orders')}>View Order History</button>
          <button className="action-button logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </section>

      {/* Profile Details Section */}
      <section className="profile-details">
        <h2>Your Details</h2>
        <form className="profile-form" onSubmit={handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              defaultValue={profileData?.phone || ''}
              onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              defaultValue={profileData?.email || ''}
              readOnly
            />
          </div>
          <button type="submit" className="save-details-button">Save Details</button>
        </form>
      </section>
    </main>
  );
};

export default ProfilePage;
