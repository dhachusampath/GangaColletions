import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderHistory.css";
import OrderDetailsModal from "./OrderDetailsModal"; // Import the modal component
import { useStore } from "../Context/Store";
import Loader from "../Loader/Loader";
import TrackingModal from "./TrackingModal";

const OrderHistory = () => {
  const { userId, API_BASE_URL } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialProducts, setInitialProducts] = useState([]); // State to store the product list
  const [trackingInfo, setTrackingInfo] = useState({});
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  // Fetch products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products`); // Adjust to your products endpoint
        setInitialProducts(response.data); // Store products in state
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Fetch orders from the backend when the component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/orders/${userId}`);
        setOrders(response.data); // Set orders from the backend response
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // Find product by ID
  const findProductById = (id) => {
    const product = initialProducts.find((product) => product._id === id);
    return product;
  };

  // Handle viewing order details
  const handleViewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle tracking order
  const handleTrackOrder = async (orderId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/allorders/track/${orderId}`);
      setTrackingInfo(response.data);
      setIsTrackingModalOpen(true); // Open modal
    } catch (error) {
      console.error("Error fetching tracking info:", error);
    }
  }

  if (loading) {
    return <Loader/>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="no-orders-message">No orders found for this user.</div>;
  }

  return (
    <main className="order-history-container">
      <h1 className="order-history-title">Order History</h1>
      <p className="order-history-count">{orders.length} orders</p>

      {orders.map((order) => (
        <section key={order.orderId} className="order-history-card">
          <h2
            className={`order-status ${
              order.status.toLowerCase().includes("dispatched")
                ? "status-dispatched"
                : "status-delivered"
            }`}
          >
            {order.status}
          </h2>
          <p className="order-number">Order: {order.orderId}</p>
          <div className="order-preview">
            {(order.cartItems || []).slice(0, 3).map((item, index) => {
              const product = findProductById(item.productId);
              return (
                product ? (
                  <div key={index} className="order-preview-item">
                    <img
                      src={`${API_BASE_URL}/images/${product.images[0]}`}
                      alt={product.name}
                      className="preview-item-image"
                    />
                    <p className="preview-item-name">{product.name}</p>
                  </div>
                ) : (
                  <div key={index} className="order-preview-item">Product not found</div>
                )
              );
            })}
            {order.cartItems?.length > 3 && (
              <p className="order-more-items">
                +{order.cartItems.length - 3} more items
              </p>
            )}
          </div>
          <div className="order-actions">
            <button
              className="action-button view-details-button"
              onClick={() => handleViewOrderDetails(order)}
            >
              View Order
            </button>
            <button className="action-button track-order-button" onClick={() => handleTrackOrder(order.orderId)}>
              Track Order
            </button>

          </div>
        </section>
      ))}

      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setIsModalOpen(false)}
        findProductById={findProductById} // Pass the function as a prop
        />
      )}
      {isTrackingModalOpen && (
    <TrackingModal trackingData={trackingInfo} onClose={() => setIsTrackingModalOpen(false)} />
  )}
    </main>
  );
};

export default OrderHistory;
