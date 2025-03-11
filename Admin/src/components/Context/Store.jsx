import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Define a constant for the API base URL

// Create the Store Context
const StoreContext = createContext();

// Custom Hook for accessing the store
export const useStore = () => useContext(StoreContext);

// Store Provider Component
export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  // const API_BASE_URL = "https://gangacollection-backend.onrender.com/api";
  const API_BASE_URL = "http://localhost:5000/api";
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [user, setUser] = useState(null); // Store logged-in user
  // Fetch products from the backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`);
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching products:", error.response || error);
      }
    };

    fetchProducts();
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove user data from localStorage
    setUser(null); // Clear the user state
  };
  // Function to add bulk products

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`https://gangacollection-backend.onrender.com/auth/users`);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const value = {
    products,
    setProducts,
    API_BASE_URL,
    lowStockAlerts,
    setLowStockAlerts,
    handleLogout,
    users, setUsers,
    user, setUser
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
