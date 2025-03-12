import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";
import { useStore } from "../Context/Store";

const OrderConfirmation = () => {
  const { API_BASE_URL } = useStore();
  const location = useLocation();
  const navigate = useNavigate(); // Add this line for navigation

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Retrieve data passed from Payment component
  const { uniqueOrderId ,orderDetails } = location.state || {};

  console.log("Received Order Details:", orderDetails); // Debugging print

  if (!orderDetails) {
    return <h1>No Order Data Found</h1>;
  }

  const { 
    cartItems = [], 
    shippingAddress = {}, 
    billingAddress = {}, 
    paymentStatus = "Pending", 
    orderDate = new Date().toISOString(),   
  } = orderDetails;

  const handleTrackOrder = () => {
    // Navigate to the MyAccountPage and set "orders" tab as active
    navigate('/myaccount', { state: { activeTab: "orders" } });
  };

  return (
    <div className="order-confirmation-container">
      <header className="order-confirmation-header">
        <h1 className="order-confirmation-logo">GANGA COLLECTIONS</h1>
      </header>

      <main className="order-confirmation-details">
        <h2 className="order-confirmation-thank-you">
          Thanks for your order, {shippingAddress?.firstName || "Customer"}.
        </h2>
        <p className="order-confirmation-number">Order No. {uniqueOrderId}</p>
        <div className="order-confirmation-shipping-info">
          <div className="order-confirmation-shipping">
            <strong>Shipping to</strong>
            <p>{shippingAddress?.firstName} {shippingAddress?.lastName}</p>
            <p>{shippingAddress?.streetAddress}<br />{shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}</p>
          </div>
          <div className="order-confirmation-billing">
            <strong>Billed to</strong>
            <p>{billingAddress?.firstName} {billingAddress?.lastName}</p>
          </div>
          <div className="order-confirmation-date">
            <strong>Date ordered</strong>
            <p>{new Date(orderDate).toLocaleString()}</p>
          </div>
        </div>
        <div className="order-confirmation-status">
          <p>Your order is on its way. We will be shipping it soon.</p>
          <button className="order-confirmation-track-button" onClick={handleTrackOrder}>
            Track your order
          </button>
        </div>
        <hr className="order-confirmation-divider" />
        <section className="order-confirmation-summary">
          <h3>Your Order Summary</h3>
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div className="order-confirmation-item" key={index}>
                <img
                  src={`${API_BASE_URL}/images/${item.image}` || "https://via.placeholder.com/100"}
                  alt={item.name}
                  className="order-confirmation-item-image"
                />
                <div className="order-confirmation-item-details">
                  <p>{item.name}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="order-confirmation-item-price">₹{item.price}</p>
              </div>
            ))
          ) : (
            <p>No items in order.</p>
          )}
          <div className="order-confirmation-totals">
            <div className="order-confirmation-total-row">
              <span>Subtotal</span>
              <span>₹{cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)}</span>
            </div>
            <div className="order-confirmation-total-row order-confirmation-total-grand">
              <span>Total</span>
              <span>₹{orderDetails.totalAmount}</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="order-confirmation-footer">
        <p>GangaCollection | Privacy Policy | Terms of Service</p>
        <p>Kannarpalayam, Karamadai, Tamil Nadu 641104</p>
      </footer>
    </div>
  );
};

export default OrderConfirmation;
