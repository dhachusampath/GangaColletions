import React, { useState, useEffect } from 'react';
import { useStore } from '../Context/Store';
import './TrackingUpdate.css';

const TrackingUpdate = ({ order, onBack }) => {
  const { API_BASE_URL } = useStore();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingLink, setTrackingLink] = useState('');
  const [trackingImage, setTrackingImage] = useState(null);
  const [status, setStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="luxe-tracking-update">
      <div className="luxe-tracking-header">
        <button className="luxe-back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back to Orders
        </button>
        <h2 className="luxe-tracking-title">
          <i className="fas fa-truck"></i> Update Tracking - #{order.orderId}
        </h2>
      </div>

      <div className="luxe-order-summary">
        <div className="luxe-summary-card">
          <div className="luxe-summary-item">
            <span className="luxe-summary-label">Customer:</span>
            <span className="luxe-summary-value">
              {`${order.billingAddress.firstName} ${order.billingAddress.lastName}`}
            </span>
          </div>
          <div className="luxe-summary-item">
            <span className="luxe-summary-label">Order Total:</span>
            <span className="luxe-summary-value">₹{order.totalAmount}</span>
          </div>
          <div className="luxe-summary-item">
            <span className="luxe-summary-label">Current Status:</span>
            <span className={`luxe-status-badge luxe-status-${status.toLowerCase()}`}>
              {status}
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="luxe-tracking-form">
        <div className="luxe-form-section">
          <h3 className="luxe-section-title">
            <i className="fas fa-cog"></i> Order Status
          </h3>
          <div className="luxe-form-group">
            <label className="luxe-form-label">Update Status</label>
            <div className="luxe-select-wrapper">
              <select
                className="luxe-form-select"
                value={status}
                onChange={handleStatusChange}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <i className="fas fa-chevron-down luxe-select-arrow"></i>
            </div>
          </div>
        </div>

        {status !== 'Cancelled' && (
          <div className="luxe-form-section">
            <h3 className="luxe-section-title">
              <i className="fas fa-shipping-fast"></i> Shipping Details
            </h3>
            
            <div className="luxe-form-group">
              <label className="luxe-form-label">Tracking Number</label>
              <input
                className="luxe-form-input"
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number"
                required
              />
            </div>

            <div className="luxe-form-group">
              <label className="luxe-form-label">Tracking Link</label>
              <input
                className="luxe-form-input"
                type="url"
                value={trackingLink}
                onChange={(e) => setTrackingLink(e.target.value)}
                placeholder="Enter tracking URL"
                required
              />
            </div>

            <div className="luxe-form-group">
              <label className="luxe-form-label">Tracking Proof</label>
              <div className="luxe-file-upload">
                <label className="luxe-upload-label">
                  <i className="fas fa-cloud-upload-alt"></i>
                  <span>{trackingImage ? trackingImage.name : 'Choose an image'}</span>
                  <input
                    type="file"
                    className="luxe-file-input"
                    onChange={(e) => setTrackingImage(e.target.files[0])}
                    accept="image/*"
                  />
                </label>
              </div>
              {trackingImage && (
                <div className="luxe-image-preview">
                  <img
                    src={URL.createObjectURL(trackingImage)}
                    alt="Tracking Preview"
                    className="luxe-preview-img"
                  />
                  <button
                    type="button"
                    className="luxe-remove-img"
                    onClick={() => setTrackingImage(null)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="luxe-form-actions">
          <button
            type="submit"
            className="luxe-submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Updating...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle"></i> Update Tracking
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TrackingUpdate;