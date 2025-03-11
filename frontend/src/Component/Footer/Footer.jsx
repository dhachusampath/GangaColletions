import React, { useState } from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useStore } from '../Context/Store';

const Footer = () => {
  const {url} = useStore();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post( `${url}/subscribe`, { email });
      setMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("Subscription error:", error);
      setMessage("Subscription failed. Please try again.");
    }

    setTimeout(() => setMessage(""), 5000);
  };

  return (
    <footer style={{ backgroundImage: `url(https://i.pinimg.com/736x/a7/71/5f/a7715ffe1e62e212dc27b755dae6d661.jpg)` }}>
      <div className="footer-container">
        
        {/* Contact Section */}
        <div className="footer-section">
          <h3>Contact</h3>
          <h5>
            <a href="callto:254(98)2156213">+91 7010949037</a>
          </h5>
          <a href="mailto:username@domain.com">support@gangacollections.com</a>
          {/* <ul className="footer-contact">
            <li>
              <a href="#"><i className="fab fa-facebook-f icon"></i></a>
            </li>
            <li>
              <a href="#"><i className="fab fa-twitter icon"></i></a>
            </li>
            <li>
              <a href="#"><i className="fab fa-google-plus-g icon"></i></a>
            </li>
            <li>
              <a href="#"><i className="fa-brands fa-linkedin"></i></a>
            </li>
          </ul> */}
          {/* <div className="footer-location">
            <i>
              <svg
                width="24px"
                height="24px"
                viewBox="-4 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g transform="translate(-104.000000, -411.000000)" fill="#fff">
                    <path d="M116,426 C114.343,426 113,424.657 113,423 C113,421.343 114.343,420 116,420 C117.657,420 119,421.343 119,423 C119,424.657 117.657,426 116,426 L116,426 Z M116,418 C113.239,418 111,420.238 111,423 C111,425.762 113.239,428 116,428 C118.761,428 121,425.762 121,423 C121,420.238 118.761,418 116,418 L116,418 Z M116,440 C114.337,440.009 106,427.181 106,423 C106,417.478 110.477,413 116,413 C121.523,413 126,417.478 126,423 C126,427.125 117.637,440.009 116,440 L116,440 Z M116,411 C109.373,411 104,416.373 104,423 C104,428.018 114.005,443.011 116,443 C117.964,443.011 128,427.95 128,423 C128,416.373 122.627,411 116,411 L116,411 Z"></path>
                  </g>
                </g>
              </svg>
            </i>
            <div>
              <h4>Coimbatore</h4>
            </div>
          </div> */}
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
      <h3>Quick Links</h3>
      <ul className="footer-links">
        {['Contact', 'Frequently Asked Questions', 'Return and replacement Policy', 'Privacy Policy', 'Terms and Conditions'].map((link, index) => {
          // Define the routing path for each link
          const path = link.toLowerCase().replace(/\s+/g, '-');  // Create a dynamic path for each link
          return (
            <li key={index}>
              <Link to={`/${path}`}>  {/* Use Link component for routing */}
                <i className="fa-solid fa-caret-right"></i>
                {link}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>

        {/* Newsletter Subscription Section */}
        <div className="footer-section">
          <h3>Subscribe Newsletter</h3>
          <p>Subscribe to our newsletter to get our latest updates & news</p>
      <form className="footer-form" onSubmit={handleSubscribe}>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Subscribe</button>
      </form>
      {message && <p className="footer-message">{message}</p>}
          <div className="footer-reviews">
            <ul>
              {[...Array(5)].map((_, index) => (
                <li key={index}>
                  <i className="fa-solid fa-star"></i>
                </li>
              ))}
            </ul>
            <h5>4.9 | 6000+ Reviews</h5>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>© Copyright 2025 by Ganga Collections. Developed and Maintained by <a href="https://www.yatratechs.com/" style={{color:"#f0a500"}}>YatraTechs</a></p>
      </div>
    </footer>
  );
}

export default Footer;
