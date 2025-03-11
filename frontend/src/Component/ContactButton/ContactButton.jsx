import React from "react";
import "./ContactButton.css"; // Your custom CSS for styling

const ContactButton = () => {
  return (
<div className="jewelry-contact-buttons">
      {/* WhatsApp Icon */}
      <a
        href="https://wa.me/1234567890" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <i className="fab fa-whatsapp contact-icon"></i>
      </a>

      {/* Call Button */}
      <a href="tel:+1234567890" className="call-button">
        <i className="fas fa-phone-alt contact-icon"></i>
      </a>
    </div>
  );
};

export default ContactButton;
