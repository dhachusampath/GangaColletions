import React, { useState, useEffect } from 'react';
import './TrackingUpdate.css';
import { useStore } from '../Context/Store';

const TrackingUpdate = ({ order, onBack }) => {

  const {API_BASE_URL}=useStore();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [trackingImage, setTrackingImage] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (order) {
      setTrackingNumber(order.trackingNumber || '');
      setTrackingLink(order.trackingLink || '');
      setStatus(order.deliveryStatus || 'Processing');
    }
  }, [order]);

  const handleStatusChange = (e) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);

    if (selectedStatus === 'Cancelled') {
      setTrackingNumber('');
      setTrackingLink('');
      setTrackingImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('orderId', order.orderId);
    formData.append('status', status);

    if (status !== 'Cancelled') {
      formData.append('trackingNumber', trackingNumber);
      formData.append('trackingLink', trackingLink);
      if (trackingImage) {
        formData.append('trackingImage', trackingImage);
      }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/allorders/update-tracking`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to update tracking');
      }

      alert('Tracking updated successfully!');
      onBack();
    } catch (error) {
      console.error('Error updating tracking:', error);
      alert('Error updating tracking. Please try again.');
    }
  };

  return (
    <div className="tracking-update-container">
      <button className="back-button" onClick={onBack}>Back to Orders</button>
      <h2 className="tracking-update-title">Tracking Update - {order.orderId}</h2>

      <div className="order-info">
        <p><strong>Customer:</strong> {`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Status:</strong> <span className={`status ${status.toLowerCase()}`}>{status}</span></p>
      </div>

      <form onSubmit={handleSubmit} className="tracking-update-form">
        <div className="form-group">
          <label className="form-label">Update Status:</label>
          <select className="form-input" value={status} onChange={handleStatusChange}>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {status !== 'Cancelled' && (
          <>
            <div className="form-group">
              <label className="form-label">Tracking Number:</label>
              <input
                className="form-input"
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tracking Link:</label>
              <input
                className="form-input"
                type="url"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                placeholder="Enter tracking link"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Tracking Image:</label>
              <input
                className="form-input-file"
                type="file"
                onChange={(e) => setTrackingImage(e.target.files[0])}
                accept="image/*"
              />
              {trackingImage && (
                <div className="image-preview">
                  <img
                    src={URL.createObjectURL(trackingImage)}
                    alt="Tracking Preview"
                    className="preview-image"
                  />
                </div>
              )}
            </div>
          </>
        )}

        <button type="submit" className="btn-update-tracking">Update Tracking</button>
      </form>
    </div>
  );
};

export default TrackingUpdate;
