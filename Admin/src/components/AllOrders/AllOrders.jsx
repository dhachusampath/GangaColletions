import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllOrders.css';
import OrderDetails from '../OrderDetails/OrderDetails';
import TrackingUpdate from '../TrackingUpdate/TrackingUpdate';
import { useStore } from '../Context/Store';

const AllOrders = () => {

  const {API_BASE_URL}= useStore();
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingUpdate, setIsTrackingUpdate] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/allorders/all`); // Update with your backend URL
      setOrders(response.data);
      setLastUpdated(new Date().toLocaleString()); // Update last refreshed time
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
  };

  const filteredOrders = orders.filter(order => {
    const customerName = order.billingAddress
      ? `${order.billingAddress.firstName || ''} ${order.billingAddress.lastName || ''}`.toLowerCase()
      : '';

    const status = order.deliveryStatus ? order.deliveryStatus.toLowerCase() : '';

    return (
      (customerName.includes(searchQuery.toLowerCase()) || (order.orderId && order.orderId.includes(searchQuery))) &&
      (filterStatus === 'All' || status === filterStatus.toLowerCase())
    );
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsTrackingUpdate(false);
  };

  const handleTrackerUpdate = (order) => {
    setSelectedOrder(order);
    setIsTrackingUpdate(true);
  };

  const handleBackToOrders = () => {
    setSelectedOrder(null);
    setIsTrackingUpdate(false);
  };

  return (
    <section className="all-orders">
      {loading ? (
        <p>Loading orders...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : !selectedOrder ? (
        <>
          <div className="all-orders-header">
            <div className="all-orders-filters">
              <input
                type="text"
                placeholder="Search by Order ID or Customer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="all-orders-search-input"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="all-orders-status-filter"
              >
                <option value="All">All Status</option>
                <option value="Processing">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="all-orders-refresh">
              <p>Last Updated: {lastUpdated || 'Never'}</p>
              <button className="refresh-btn" onClick={handleRefresh}>
                <i className="fa-solid fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>

          <table className="all-orders-table-content">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>RAZORPAY_ORDER_ID</th>
                <th>Customer</th>
                <th>Total (₹)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id}>
                  <td>{order.orderId}</td>
                  <td>{order.razorpay_order_id}</td>
                  <td>{`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}</td>
                  <td>{order.totalAmount}</td>
                  <td className={`all-orders-status ${order.deliveryStatus.toLowerCase()}`}>{order.deliveryStatus}</td>
                  <td>
                    <button className="all-orders-btn view-btn" onClick={() => handleViewOrder(order)}>
                      View
                    </button>
                    <button className="all-orders-btn tracking-btn" onClick={() => handleTrackerUpdate(order)}>
                      Tracker Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : isTrackingUpdate ? (
        <TrackingUpdate order={selectedOrder} onBack={handleBackToOrders} />
      ) : (
        <OrderDetails order={selectedOrder} onBack={handleBackToOrders} />
      )}
    </section>
  );
};

export default AllOrders;
