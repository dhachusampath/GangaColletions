import React from 'react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <div className="order-details-modal">
      <div className="order-details-modal__content">
        <button className="order-details-modal__close-btn" onClick={onClose}>
          &times;
        </button>
        <h2 className="order-details-modal__title">Order #{order.orderId}</h2>
        
        <div className="order-details-modal__body">
          <div className="order-details-modal__info">
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Price:</strong> ₹{order.totalAmount}</p>
          </div>

          <div className="order-details-modal__items">
            <h3 className="order-details-modal__subheading">Order Items:</h3>
            {order.cartItems.map((item) => (
              <div key={item.productId} className="order-details-modal__item">
                <img 
                  src={`https://gangacollection-backend.onrender.com/api/images/${item.image}`} 
                  alt={item.productName} 
                  className="order-details-modal__item-image"
                />
                <div className="order-details-modal__item-info">
                  <p className="order-details-modal__item-name">{item.productName}</p>
                  <p className="order-details-modal__item-quantity">Quantity: {item.quantity}</p>
                  <p className="order-details-modal__item-price">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
