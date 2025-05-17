import React, { useState, useEffect } from 'react';
import { useStore } from '../Context/Store';
import './OrderDetails.css';

const OrderDetails = ({ order, onBack }) => {
  const { API_BASE_URL } = useStore();
  const [orderDetails, setOrderDetails] = useState(order);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({
    customer: true,
    shipping: true,
    items: true,
    summary: true
  });

  // Fetch product details for each item in the cart
  const fetchProductDetails = async (productId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/product/${productId}`);
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Product not found');
    } catch (error) {
      console.error('Error fetching product details:', error);
      return { category: 'N/A', subcategory: 'N/A', itemcode: 'N/A' };
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      if (order && order.cartItems) {
        try {
          const updatedCartItems = await Promise.all(
            order.cartItems.map(async (item) => {
              const details = await fetchProductDetails(item.productId);
              return { ...item, ...details };
            })
          );
          setOrderDetails({ ...order, cartItems: updatedCartItems });
        } catch (error) {
          console.error('Error loading order details:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchDetails();
  }, [order, API_BASE_URL]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (isLoading) {
    return (
      <div className="luxe-order-loading">
        <div className="luxe-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="luxe-order-error">
        <i className="fas fa-exclamation-triangle"></i>
        <p>No order details available</p>
        <button className="luxe-back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="luxe-order-container">
      <div className="luxe-order-header">
        <button className="luxe-back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i> Back to Orders
        </button>
        <h1 className="luxe-order-title">
          <i className="fas fa-receipt"></i> Order #{orderDetails.orderId}
        </h1>
        <div className={`luxe-order-status luxe-status-${orderDetails.deliveryStatus.toLowerCase()}`}>
          {orderDetails.deliveryStatus}
        </div>
      </div>

      <div className="luxe-order-meta">
        <p className="luxe-order-date">
          <i className="fas fa-calendar-alt"></i> {new Date(orderDetails.createdAt).toLocaleString()}
        </p>
        <p className="luxe-order-payment">
          <i className="fas fa-credit-card"></i> {orderDetails.paymentMethod}
        </p>
      </div>

      <div className="luxe-order-sections">
        {/* Customer Information */}
        <div className="luxe-order-section">
          <div className="luxe-section-header" onClick={() => toggleSection('customer')}>
            <h2>
              <i className="fas fa-user"></i> Customer Information
            </h2>
            <i className={`fas ${expandedSections.customer ? 'fa-minus' : 'fa-plus'}`}></i>
          </div>
          {expandedSections.customer && (
            <div className="luxe-section-content">
              <div className="luxe-info-card">
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Name:</span>
                  <span className="luxe-info-value">
                    {orderDetails.billingAddress.firstName} {orderDetails.billingAddress.lastName}
                  </span>
                </div>
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Contact:</span>
                  <span className="luxe-info-value">
                    {orderDetails.billingAddress.mobileNumber}
                  </span>
                </div>
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Address:</span>
                  <span className="luxe-info-value">
                    {orderDetails.billingAddress.streetAddress}, {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Information */}
        <div className="luxe-order-section">
          <div className="luxe-section-header" onClick={() => toggleSection('shipping')}>
            <h2>
              <i className="fas fa-truck"></i> Shipping Information
            </h2>
            <i className={`fas ${expandedSections.shipping ? 'fa-minus' : 'fa-plus'}`}></i>
          </div>
          {expandedSections.shipping && (
            <div className="luxe-section-content">
              <div className="luxe-info-card">
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Recipient:</span>
                  <span className="luxe-info-value">
                    {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}
                  </span>
                </div>
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Contact:</span>
                  <span className="luxe-info-value">
                    {orderDetails.shippingAddress.mobileNumber}
                  </span>
                </div>
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Address:</span>
                  <span className="luxe-info-value">
                    {orderDetails.shippingAddress.streetAddress}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}
                  </span>
                </div>
                <div className="luxe-info-row">
                  <span className="luxe-info-label">Shipping Charge:</span>
                  <span className="luxe-info-value">
                    ₹{orderDetails.shippingAddress.shippingCharge || '80'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Items */}
        <div className="luxe-order-section">
          <div className="luxe-section-header" onClick={() => toggleSection('items')}>
            <h2>
              <i className="fas fa-box-open"></i> Order Items ({orderDetails.cartItems?.length || 0})
            </h2>
            <i className={`fas ${expandedSections.items ? 'fa-minus' : 'fa-plus'}`}></i>
          </div>
          {expandedSections.items && (
            <div className="luxe-section-content">
              {Array.isArray(orderDetails.cartItems) && orderDetails.cartItems.length > 0 ? (
                <div className="luxe-items-table-container">
                  <table className="luxe-items-table">
                    <thead>
                      <tr>
                        <th className="luxe-item-image">Image</th>
                        <th className="luxe-item-name">Product</th>
                        <th className="luxe-item-category">Category</th>
                        <th className="luxe-item-variants">Variants</th>
                        <th className="luxe-item-price">Price</th>
                        <th className="luxe-item-code">Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.cartItems.map((item, index) => (
                        <tr key={index}>
                          <td className="luxe-item-image">
                            <img
                              src={`${API_BASE_URL}/images/${item.image}`}
                              alt={item.name}
                              className="luxe-product-image"
                            />
                          </td>
                          <td className="luxe-item-name">
                            <div className="luxe-product-name">{item.name}</div>
                            <div className="luxe-product-subcategory">{item.subcategory || 'N/A'}</div>
                          </td>
                          <td className="luxe-item-category">{item.category || 'N/A'}</td>
                          <td className="luxe-item-variants">
                            {item.size} × {item.quantity}
                          </td>
                          <td className="luxe-item-price">₹{item.price}</td>
                          <td className="luxe-item-code">{item.itemcode}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="luxe-no-items">No items in this order</div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="luxe-order-section">
          <div className="luxe-section-header" onClick={() => toggleSection('summary')}>
            <h2>
              <i className="fas fa-file-invoice-dollar"></i> Order Summary
            </h2>
            <i className={`fas ${expandedSections.summary ? 'fa-minus' : 'fa-plus'}`}></i>
          </div>
          {expandedSections.summary && (
            <div className="luxe-section-content">
              <div className="luxe-summary-card">
                <div className="luxe-summary-row">
                  <span className="luxe-summary-label">Subtotal:</span>
                  <span className="luxe-summary-value">₹{orderDetails.totalAmount}</span>
                </div>
                <div className="luxe-summary-row">
                  <span className="luxe-summary-label">Shipping:</span>
                  <span className="luxe-summary-value">
                    ₹{orderDetails.shippingAddress.shippingCharge || '80'}
                  </span>
                </div>
                <div className="luxe-summary-row luxe-summary-total">
                  <span className="luxe-summary-label">Total:</span>
                  <span className="luxe-summary-value">₹{orderDetails.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;