import React, { useEffect } from "react";
import "./PrivacyPolicy.css";

const PrivacyPolicy = () => {
      useEffect(() => {
            // Scroll to the top of the page
            window.scrollTo(0, 0);
          }, []); // Empty dependency array ensures this runs only once when the component mounts
  return (
    <div className="privacy-container">
      <div className="privacy-banner">
        <h1>Privacy Policy</h1>
        <p>We value your privacy and are committed to protecting your personal information.</p>
      </div>

      <div className="privacy-content">
        <section className="privacy-section">
          <h2>1. Introduction</h2>
          <p>
            This Privacy Policy describes how we collect, use, and protect your personal information when you visit our
            website. By using our services, you consent to the collection and use of your data as described in this policy.
          </p>
        </section>

        <section className="privacy-section">
          <h2>2. Information We Collect</h2>
          <p>
            We collect the following types of personal information when you interact with our website:
            <ul>
              <li>Contact Information: Name, email address, phone number, etc.</li>
              <li>Payment Information: Credit/debit card details or other payment methods.</li>
              <li>Usage Data: Information about how you use our website, such as IP address, browser type, and device information.</li>
            </ul>
          </p>
        </section>

        <section className="privacy-section">
          <h2>3. How We Use Your Information</h2>
          <p>
            We use the information we collect for various purposes, including:
            <ul>
              <li>To process and fulfill your orders and requests.</li>
              <li>To improve our website and services.</li>
              <li>To communicate with you about your account, orders, and promotions.</li>
              <li>To comply with legal obligations and enforce our terms of service.</li>
            </ul>
          </p>
        </section>

        <section className="privacy-section">
          <h2>4. Sharing Your Information</h2>
          <p>
            We do not sell your personal information to third parties. However, we may share your data with trusted third
            parties in the following circumstances:
            <ul>
              <li>Service Providers: We may share your information with third-party vendors who help us process payments, fulfill orders, or improve our services.</li>
              <li>Legal Compliance: We may share your information if required by law or to protect the rights of our business.</li>
            </ul>
          </p>
        </section>

        <section className="privacy-section">
          <h2>5. Data Security</h2>
          <p>
            We take reasonable steps to protect your personal information from unauthorized access, alteration, or
            disclosure. However, no method of transmission over the Internet is 100% secure, so we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className="privacy-section">
          <h2>6. Cookies and Tracking Technologies</h2>
          <p>
            Our website uses cookies and other tracking technologies to enhance your experience. These tools allow us to
            collect usage data, personalize your experience, and improve our services. You can disable cookies in your browser
            settings, but this may affect your ability to use certain features on our site.
          </p>
        </section>

        <section className="privacy-section">
          <h2>7. Your Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
            <ul>
              <li>The right to access the personal data we hold about you.</li>
              <li>The right to correct any inaccuracies in your data.</li>
              <li>The right to request the deletion of your personal information.</li>
            </ul>
            To exercise any of these rights, please contact us using the information provided below.
          </p>
        </section>

        <section className="privacy-section">
          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We do not knowingly collect personal information
            from children. If you believe we have collected personal information from a child under 13, please contact us
            immediately.
          </p>
        </section>

        <section className="privacy-section">
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Any changes will be posted on this page, and the "Last Updated"
            date will be revised. Your continued use of our website after any updates constitutes your acceptance of the
            modified policy.
          </p>
        </section>

        <section className="privacy-section">
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please
            contact us at:
            <br />
            Email: [Your Contact Email]
            <br />
            Phone: [Your Contact Number]
            <br />
            Address: [Your Business Address]
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
