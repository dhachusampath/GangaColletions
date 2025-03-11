import React from "react";
import "./TrackingModal.css"; // Create a CSS file for styling

const TrackingModal = ({ trackingData, onClose }) => {
  if (!trackingData) return null;

  return (
    <div className="tracking-modal-overlay">
      <div className="tracking-modal">
        <button className="close-button" onClick={onClose}>&times;
            </button>
        <h2>Order Tracking</h2>
        <p><strong>Status:</strong> {trackingData.status}</p>
        <p>Delivery Status:{trackingData.deliveryStatus}</p>
        <p>Tracking Number:{trackingData.trackingNumber}</p>
        {trackingData.trackingLink ? (
          <p>
            <a href={trackingData.trackingLink} target="_blank" rel="noopener noreferrer">
              Track Shipment Link
            </a>
          </p>
        ) : (
          <p>No tracking link available</p>
        )}
      </div>
    </div>
  );
};

export default TrackingModal;
