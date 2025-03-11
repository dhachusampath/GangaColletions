import React from "react";
import { useNavigate } from "react-router-dom";
import "./OrderFailure.css"
const OrderFailure = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate("/cart"); // Redirect to the checkout page
  };

  const handleContactSupport = () => {
    window.location.href = "mailto:support@gangacollections.com"; // Open email client
  };

  return (
    <div className="order-failure-container">
      <div className="order-failure-content">
        <h1 className="order-failure-title">Order Failed</h1>
        <p className="order-failure-message">
          We're sorry, but your payment was unsuccessful. Please review the details below and try again.
        </p>

        {/* Failure Details */}
        <div className="failure-details">
          <h2>What could have gone wrong?</h2>
          <ul>
            <li>Insufficient funds in your account.</li>
            <li>Incorrect card details entered.</li>
            <li>Network issues during payment processing.</li>
            <li>Bank declined the transaction.</li>
          </ul>
        </div>

        {/* Call to Action Buttons */}
        <div className="cta-buttons">
          <button className="retry-payment-button" onClick={handleRetryPayment}>
            Retry Payment
          </button>
          <button className="contact-support-button" onClick={handleContactSupport}>
            Contact Support
          </button>
        </div>

        {/* Support Information */}
        <div className="support-info">
          <h2>Need Help?</h2>
          <p>
            If you continue to face issues, please contact our support team at{" "}
            <strong>support@gangacollections.com</strong> or call us at{" "}
            <strong>+91 7010949037</strong>.
          </p>
          <p>We're here to help you!</p>
        </div>

        {/* Footer */}
        <div className="order-failure-footer">
          <p>
            Thank you for shopping with <strong>Ganga Collections</strong>. We value your trust and are committed to
            resolving this issue as soon as possible.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderFailure;