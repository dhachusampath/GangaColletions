import React, { useEffect } from "react";
import "./TermsAndConditions.css";

const TermsAndConditions = () => {
    useEffect(() => {
        // Scroll to the top of the page
        window.scrollTo(0, 0);
      }, []); // Empty dependency array ensures this runs only once when the component mounts
  return (
    <div className="terms-container">
      <div className="terms-banner">
        <h1>Terms and Conditions</h1>
        <p>By accessing and using this website, you agree to comply with the following terms and conditions.</p>
      </div>

      <div className="terms-content">
        <section className="terms-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to our website. These Terms and Conditions govern the use of our services, products, and any content
            provided on this site. By accessing or using this website, you agree to be bound by these terms. If you do not
            agree with these terms, please do not use this website.
          </p>
        </section>

        <section className="terms-section">
          <h2>2. Products and Services</h2>
          <p>
            We offer various products and services, which are described in detail on this website. We reserve the right to
            modify or discontinue products at any time without prior notice. All product prices are subject to change and may
            vary depending on availability and promotions.
          </p>
        </section>

        <section className="terms-section">
          <h2>3. Ordering and Payment</h2>
          <p>
            By placing an order through our website, you are making an offer to purchase the selected products or services.
            All orders are subject to acceptance by us, and we may refuse to process any order at our discretion. Payment
            information must be accurate, and you agree to provide current, complete, and accurate purchase information.
          </p>
        </section>

        <section className="terms-section">
          <h2>4. Shipping and Delivery</h2>
          <p>
            We will ship your order to the address provided during checkout. Please ensure that the shipping address is
            accurate. We are not responsible for delays or issues caused by incorrect or incomplete shipping information.
            Delivery times may vary depending on the destination and shipping method selected.
          </p>
        </section>

        <section className="terms-section">
          <h2>5. Returns and Refunds</h2>
          <p>
            We accept returns within 30 days from the date of purchase for items that are unused, unopened, and in their
            original packaging. Certain items may be excluded from returns, such as personalized or customized products. If
            you receive a damaged or defective item, please contact us immediately for assistance.
          </p>
        </section>

        <section className="terms-section">
          <h2>6. Intellectual Property</h2>
          <p>
            All content on this website, including text, images, logos, trademarks, and graphics, is the property of the
            website owner and is protected by copyright, trademark, and other intellectual property laws. You may not use
            any content from this site without permission.
          </p>
        </section>

        <section className="terms-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            We are not liable for any direct, indirect, incidental, special, or consequential damages arising out of the use
            or inability to use this website or any products purchased through the website. We do not guarantee the
            availability or accuracy of any content or product on the site.
          </p>
        </section>

        <section className="terms-section">
          <h2>8. Privacy Policy</h2>
          <p>
            Your use of this website is also governed by our Privacy Policy, which outlines how we collect, use, and protect
            your personal information. Please review our Privacy Policy for further details.
          </p>
        </section>

        <section className="terms-section">
          <h2>9. Governing Law</h2>
          <p>
            These Terms and Conditions are governed by and construed in accordance with the laws of [Your Country/State].
            Any disputes arising from these terms will be resolved in the appropriate courts in [Your City/State].
          </p>
        </section>

        <section className="terms-section">
          <h2>10. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be posted on
            this page with an updated date. Your continued use of this website after changes are made will constitute your
            acceptance of those changes.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
