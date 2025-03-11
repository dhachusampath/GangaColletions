import React, { useEffect, useState } from "react";
import axios from "axios";
import "./BillingOrdersAdmin.css";
import { useStore } from "../Context/Store";

const BillingOrdersAdmin = () => {
    const {API_BASE_URL}=useStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null); // Stores selected order details

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`);

        if (Array.isArray(response.data)) {
          setOrders(response.data);
        } else {
          setOrders([]);
          console.error("Invalid data format received:", response.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB"); // Formats as DD/MM/YYYY
  };

  return (
    <div className="billing-orders-admin">
      <h1 className="billing-orders-title">Billing Orders</h1>

      {loading ? (
        <p className="loading-text">Loading orders...</p>
      ) : error ? (
        <p className="error-text">{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders-text">No orders found.</p>
      ) : (
        <table className="billing-orders-table">
          <thead>
            <tr>
              <th>Invoice No</th>
              <th>Customer Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment Method</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{`INV-${order._id?.slice(-6).toUpperCase()}`}</td> 
                <td>{order.customerInfo?.name || "N/A"}</td>
                <td>₹{order.finalTotal?.toFixed(2) || "0.00"}</td>
                <td>{order.date ? formatDate(order.date) : "N/A"}</td>
                <td>{order.customerInfo?.paymentMethod || "N/A"}</td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="order-details-modal">
          <div className="modal-content">
            <span className="close-btn" onClick={() => setSelectedOrder(null)}>
              &times;
            </span>
            <h2>Order Details</h2>
            <p><strong>Invoice No:</strong> INV-{selectedOrder._id?.slice(-6).toUpperCase()}</p>
            <p><strong>Date:</strong> {selectedOrder.date ? formatDate(selectedOrder.date) : "N/A"}</p>

            <div className="order-customer-info">
              <p><strong>Name:</strong> {selectedOrder.customerInfo?.name}</p>
              <p><strong>Address:</strong> {selectedOrder.customerInfo?.address}</p>
              <p><strong>Phone:</strong> {selectedOrder.customerInfo?.phone}</p>
              <p><strong>Payment Method:</strong> {selectedOrder.customerInfo?.paymentMethod}</p>
            </div>

            <h3>Order Items</h3>
            <table className="order-items-table">
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderList.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.itemcode}</td>
                    <td>{item.name}</td>
                    <td>{item.size}</td>
                    <td>{item.quantity}</td>
                    <td>₹{item.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-total">
              <p><strong>Total Discount:</strong>{selectedOrder.totalDiscount?.toFixed(1)}%</p>
              <p><strong>Final Total:</strong> ₹{selectedOrder.finalTotal?.toFixed(2) || "0.00"}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingOrdersAdmin;
