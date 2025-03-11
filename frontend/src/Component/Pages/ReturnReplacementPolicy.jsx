import React, { useEffect } from "react";
import "./ReturnReplacementPolicy.css";

const ReturnReplacementPolicy = () => {
      useEffect(() => {
            // Scroll to the top of the page
            window.scrollTo(0, 0);
          }, []); // Empty dependency array ensures this runs only once when the component mounts
  return (
    <div className="policy-container">
      <div className="policy-banner">
        <h1>Return and Replacement Policy</h1>
        <p>We strive to ensure your satisfaction with every purchase. If you are not completely satisfied, our return and replacement policy is here to help.</p>
      </div>

      <div className="policy-content">
        <section className="policy-section">
          <h2>1. Return and Replacement Eligibility</h2>
          <p>
            You may request a return or replacement under the following conditions:
            <ul>
              <li>The product is damaged or defective upon arrival.</li>
              <li>The product is different from what you ordered.</li>
              <li>The product is unused, unopened, and in its original packaging (for non-defective returns).</li>
              <li>Returns and replacements must be requested within [X] days of receiving your order (check your business’s specific return window).</li>
            </ul>
          </p>
        </section>

        <section className="policy-section">
          <h2>2. How to Request a Return or Replacement</h2>
          <p>
            To initiate a return or replacement, please follow these steps:
            <ol>
              <li>Contact our customer service team at [Your Contact Email] or [Phone Number].</li>
              <li>Provide your order number, product details, and the reason for the return or replacement.</li>
              <li>Our team will review your request and provide further instructions on how to return or exchange the item.</li>
              <li>If your request is approved, we will send you a return shipping label (if applicable) or arrange for a replacement to be shipped to you.</li>
            </ol>
          </p>
        </section>

        <section className="policy-section">
          <h2>3. Non-Returnable/Non-Replacement Items</h2>
          <p>
            Certain items are not eligible for return or replacement, including:
            <ul>
              <li>Products that have been used, damaged, or altered after delivery.</li>
              <li>Perishable goods such as food or plants.</li>
              <li>Personalized or custom-made items that were specially made for you.</li>
              <li>Items marked as non-returnable or final sale at the time of purchase.</li>
            </ul>
          </p>
        </section>

        <section className="policy-section">
          <h2>4. Refunds</h2>
          <p>
            Once we receive the returned item and inspect it, we will issue a refund to the original payment method. Please note:
            <ul>
              <li>Refunds will be processed within [X] business days after receiving the returned item.</li>
              <li>If the return is due to a defect or error on our part, we will cover the return shipping cost.</li>
              <li>For non-defective returns, the customer will be responsible for return shipping fees unless otherwise specified.</li>
            </ul>
          </p>
        </section>

        <section className="policy-section">
          <h2>5. Damaged or Defective Items</h2>
          <p>
            If you receive a damaged or defective item, please contact us within [X] days of receiving the product. We will arrange for a replacement or refund at no additional cost to you. You may be asked to provide photos of the damage or defect to help us resolve the issue promptly.
          </p>
        </section>

        <section className="policy-section">
          <h2>6. Exchanges</h2>
          <p>
            If you would like to exchange an item for a different size, color, or model, please contact us to initiate the exchange process. Depending on the product and availability, we will either arrange a direct exchange or process a return and place a new order for you.
          </p>
        </section>

        <section className="policy-section">
          <h2>7. Shipping Costs</h2>
          <p>
            For returns and replacements due to customer preferences (e.g., wrong size or color), the customer is responsible for the return shipping cost. However, if the return is due to an error on our part (e.g., defective or incorrect items), we will cover the return shipping cost.
          </p>
        </section>

        <section className="policy-section">
          <h2>8. Contact Us</h2>
          <p>
            If you have any questions or concerns about our return and replacement policy, please feel free to contact our customer service team at:
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

export default ReturnReplacementPolicy;
