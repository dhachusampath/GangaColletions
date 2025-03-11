import React, { useRef } from "react";
import "./BillTemplate.css";

const BillTemplate = ({ orderList = [], customerInfo = {}, totalDiscount = 3 }) => {
  const billRef = useRef(null);
// Calculate Discount Amount (3% of Subtotal)


  // Generate random invoice number
  const generateInvoiceNumber = () => `INV-${Math.floor(100000 + Math.random() * 900000)}`;

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const {
    name = "Unknown",
    address = "Not Provided",
    phone = "N/A",
    paymentMethod = "N/A",
  } = customerInfo;

  // Calculate Subtotal (Sum of all item total prices)
  const subTotal = orderList.reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate Discount Amount (3% of Subtotal)
  const discountAmount = (subTotal * totalDiscount) / 100;

  // Amount before tax (Subtotal - Discount)
  const beforeTaxAmount = subTotal - discountAmount;
  
  // GST Calculation (3% of Before Tax Amount)
  const gstAmount = (beforeTaxAmount * 3) / 100;
  
  // Final Grand Total (Before Tax Amount + GST)
  const grandTotal = beforeTaxAmount + gstAmount;

  return (
    <>
      <div className="bill-template-container" ref={billRef}>
        {/* Header Section */}
        <div className="bill-header-section">
          <div className="bill-logo">
            <img src="/logo.png" alt="Company Logo" />
          </div>
          <div className="bill-company-info">
            <h1>Ganga Collections</h1>
            <p>123 Bazaar Street, Coimbatore, Tamil Nadu</p>
            <p>GSTIN: 33AABCD0568Q1Z</p>
          </div>
          <div className="bill-invoice-details">
            <p><strong>Invoice No:</strong> {generateInvoiceNumber()}</p>
            <p><strong>Invoice Date:</strong> {formatDate(new Date())}</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bill-customer-info">
          <h2>Customer Details</h2>
          <p><strong>Type:</strong> Wholesale / Retail</p>
          <p><strong>Name:</strong> {name}</p>
          <p><strong>Address:</strong> {address}</p>
          <p><strong>Mobile:</strong> {phone}</p>
        </div>

        {/* Order Details */}
        <div className="bill-order-details">
          <h2>Order Summary</h2>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>HSN Code</th>
                <th>Quantity</th>
                <th>Price (₹)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {orderList.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>71179010</td>
                  <td>{item.quantity}</td>
                  <td>{item.price.toFixed(2)}</td>
                  <td>{item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Section */}
{/* Total Section */}
<div className="bill-total-section">
  <p><strong>Subtotal:</strong> ₹{subTotal.toFixed(2)}</p>
  <p><strong>Discount ({totalDiscount}%):</strong> -₹{discountAmount.toFixed(2)}</p>
  <p><strong>Amount Before Tax:</strong> ₹{beforeTaxAmount.toFixed(2)}</p>
  <p><strong>GST (3%):</strong> ₹{gstAmount.toFixed(2)}</p>
  <p><strong>Grand Total:</strong> ₹{grandTotal.toFixed(2)}</p>
</div>


        {/* Payment Section */}
        <div className="bill-payment-section">
          <div className="bill-payment-details">
            <p><strong>Payment Mode:</strong> {paymentMethod}</p>
            <p><strong>Account Name:</strong> Ganga Collections</p>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bill-terms-section">
          <p><strong>No refund or exchange.</strong></p>
          <p>Goods once sold will not be taken back.</p>
        </div>

        {/* Footer Section */}
        <div className="bill-footer-section">
          <p>For Ganga Collections</p>
          <p>Authorized Signatory</p>
        </div>
      </div>
    </>
  );
};

export default BillTemplate;
