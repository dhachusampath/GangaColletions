import React, { useState, useEffect } from 'react';
import './OrderDetails.css';
import { useStore } from '../Context/Store';


// Dummy function to simulate fetching product data by product ID (replace with actual data fetching logic)
const fetchProductDetails = async (productId) => {
  const {API_BASE_URL}=useStore();
  try {
    const response = await fetch(`${API_BASE_URL}/products/product/${productId}`);
    if (response.ok) {
      return await response.json(); // Return the product data fetched from backend
    } else {
      throw new Error('Product not found');
    }
  } catch (error) {
    console.error('Error fetching product details:', error);
    return { category: 'N/A', subcategory: 'N/A', itemcode: 'N/A' }; // Fallback data
  }
};


const OrderDetails = ({ order, onBack }) => {
  const [orderDetails, setOrderDetails] = useState(order);
  const [productDetails, setProductDetails] = useState({});

  // Ensure the state updates when `order` changes
  useEffect(() => {
    if (order) {
      setOrderDetails(order);
    }
  }, [order]);

  // Fetch product details for each item in the cart
  useEffect(() => {
    const fetchDetails = async () => {
      const updatedCartItems = await Promise.all(
        orderDetails.cartItems.map(async (item) => {
          const details = await fetchProductDetails(item.productId);
          return { ...item, ...details }; // Add product details to each item
        })
      );
      setOrderDetails((prevState) => ({
        ...prevState,
        cartItems: updatedCartItems,
      }));
    };

    if (orderDetails.cartItems) {
      fetchDetails();
    }
  }, [orderDetails.cartItems]);

  // Handle the case when no order is provided
  if (!orderDetails) return <div>Loading...</div>;

  return (
    <section className="order-details">
      <button className="back-button" onClick={onBack}>
      <i class="fa-solid fa-arrow-left"></i> Back to Orders
      </button>
      <h2 className="order-details__heading">Order No: {orderDetails.orderId}</h2>
      <p className="order-details__status">
        Status: <span className={`order-details__status--${orderDetails.deliveryStatus.toLowerCase()}`}>
          {orderDetails.deliveryStatus}
        </span>
      </p>
      <p className="order-details__created-at">Order Created at: {new Date(orderDetails.createdAt).toLocaleString()}</p>

      <div className="customer-info">
        <h3 className="section-title">Customer Info</h3>
        <p>Name: {orderDetails.billingAddress.firstName} {orderDetails.billingAddress.lastName}</p>
        <p>Address: {orderDetails.billingAddress.streetAddress}, {orderDetails.billingAddress.city}, {orderDetails.billingAddress.state}</p>
        <p>Contact: {orderDetails.billingAddress.mobileNumber}</p>
      </div>

      <div className="addresses">
        <h3 className="section-title">Delivery Address</h3>
        <p>Name: {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
        <p>Address: {orderDetails.shippingAddress.streetAddress}, {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}</p>
        <p>Contact: {orderDetails.shippingAddress.mobileNumber}</p>
      </div>

      <div className="order-items">
        <h3 className="section-title">Order Items</h3>
        {/* Check if cartItems exists and is an array */}
        {Array.isArray(orderDetails.cartItems) && orderDetails.cartItems.length > 0 ? (
          <table className="order-items__table">
            <thead>
              <tr>
                <th>Photo</th>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Varients</th>
                <th>Price</th>
                <th>Total</th>
                <th>Item Code</th> {/* Add Item Code column */}
              </tr>
            </thead>
            <tbody>
              {orderDetails.cartItems.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      className="order-items__img"
                      src={`${API_BASE_URL}/images/${item.image}`} // Adjust path as necessary
                      alt={item.name}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>{item.category || 'N/A'}</td> {/* Fallback for category */}
                  <td>{item.subcategory || 'N/A'}</td> {/* Fallback for subCategory */}
                  <td>{item.size} x {item.quantity}</td>
                  <td>₹{item.price}</td>
                  <td>₹{orderDetails.totalAmount}</td>
                  <td>{item.itemcode}</td> {/* Display itemCode */}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No items in this order.</p>
        )}
      </div>

      <div className="order-summary">
        <h3 className="section-title">Price Summary</h3>
        <p>Sub Total: ₹{orderDetails.totalAmount}</p>
        <p>Shipping: ₹{orderDetails.shippingAddress.shippingCharge || '0'}</p>
        <p>Total: ₹{orderDetails.totalAmount}</p>
      </div>

      <div className="payment-method">
        <h3 className="section-title">Payment Method</h3>
        <p>Method: {orderDetails.paymentMethod}</p>
      </div>
    </section>
  );
};

export default OrderDetails;
