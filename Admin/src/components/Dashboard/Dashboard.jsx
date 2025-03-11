import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import "./Dashboard.css";
import { useStore } from '../Context/Store';

const API_BASE_URL = 'https://gangacollection-backend.onrender.com'
const Dashboard = () => {
  const {  products, setLowStockAlerts,  } = useStore();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      fetchUsers();
    }
  }, [orders]); // Runs after orders are fetched

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allorders/all`);
      const allOrders = response.data;

      // Filter pending orders
      const pending = allOrders.filter((order) => order.deliveryStatus === "Processing");
      setPendingOrders(pending);

      // Show only last 10 completed orders
      const completed = allOrders.slice(-10);
      setOrderHistory(completed);

      setOrders(allOrders);
      
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const lowStockItems = products.flatMap((product) =>
    product.sizes
      .filter((size) => size.stock < size.thresholdStock)
      .map((size) => ({
        product: product.name,
        size: size.size,
        stock: size.stock,
        threshold: size.thresholdStock,
      }))
  );

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/users`);
      const users = response.data;

      // Calculate purchases per user
      const userPurchases = orders.reduce((acc, order) => {
        acc[order.userId] = (acc[order.userId] || 0) + 1;
        return acc;
      }, {});

      // Update customers with purchase count
      const updatedCustomers = users.map(user => ({
        ...user,
        purchases: userPurchases[user._id] || 0,
      }));

      setCustomers(updatedCustomers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchLowStock = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/low-stock`);
      setLowStockAlerts(response.data);

      response.data.forEach(product => {
        toast.warn(`Low Stock: ${product.name} - Only ${product.stock} left!`, {
          position: 'top-right',
        });
      });
    } catch (error) {
      console.error("Error fetching low stock alerts:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Total Revenue</h3>
          <p>₹{orders.reduce((acc, order) => acc + order.totalAmount, 0)}</p>
        </div>

        <div className="summary-card" style={{ backgroundColor: "red" }}>
          <h3>Pending Orders</h3>
          <p>{pendingOrders.length}</p>
        </div>

        <div className="summary-card">
          <h3>Total Customers</h3>
          <p>{customers.length}</p>
        </div>

        <div className="summary-card">
          <h3>Low Stock Alerts</h3>
          <p>{lowStockItems.length} items low on stock</p>
        </div>
      </div>

      <div className="low-stock-alerts">
        <h2>Low Stock Items</h2>
        {lowStockItems.length > 0 ? (
          <ul>
            {lowStockItems.slice(0, 5).map((item, index) => (
              <li key={item._id}>
               {item.product} (Size: {item.size}) - {item.stock} left
              </li>
            ))}
          </ul>
        ) : (
          <p>No low stock alerts</p>
        )}
      </div>

      <div className="recent-orders">
        <h2>Recent Orders</h2>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.length > 0 ? (
              orderHistory.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderId}</td>
                  <td>{order.deliveryStatus}</td>
                  <td>₹{order.totalAmount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No recent orders</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="customer-data">
        <h2>Customer Data</h2>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Purchases</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer._id}>
                <td>{customer.name}</td>
                <td>{customer.purchases}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
