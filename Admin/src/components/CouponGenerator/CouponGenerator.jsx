import React, { useState, useEffect } from 'react';
import './CouponGenerator.css';
import { useStore } from '../Context/Store';
import axios from 'axios';

const CouponGenerator = () => {
  const [couponCode, setCouponCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [amount, setAmount] = useState('');
  const [coupons, setCoupons] = useState([]);
  const { API_BASE_URL } = useStore();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/coupons`);
      setCoupons(response.data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const validateCoupon = () => {
    if (!couponCode.trim()) {
      alert('Coupon code cannot be empty.');
      return false;
    }
    if (/\s/.test(couponCode)) {
      alert('Coupon code cannot contain spaces.');
      return false;
    }
    if (coupons.some((coupon) => coupon.couponCode === couponCode)) {
      alert('Coupon code must be unique.');
      return false;
    }
    if (discountValue <= 0) {
      alert('Discount value must be greater than zero.');
      return false;
    }
    if (amount <= 0) {
      alert('Minimum order amount must be greater than zero.');
      return false;
    }
    if (new Date(expiryDate) < new Date()) {
      alert('Expiry date must be in the future.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateCoupon()) return;

    const newCoupon = {
      couponCode,
      discountType,
      discountValue,
      expiryDate,
      amount,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/coupons`, newCoupon);
      setCoupons([...coupons, response.data.coupon]);
      setCouponCode('');
      setDiscountValue('');
      setExpiryDate('');
      setAmount('');
    } catch (error) {
      console.error('Error creating coupon:', error);
    }
  };

  const handleDelete = async (code) => {
    try {
      await axios.delete(`${API_BASE_URL}/coupons/${code}`);
      setCoupons(coupons.filter((coupon) => coupon.couponCode !== code));
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  const handleEdit = (coupon) => {
    setCouponCode(coupon.couponCode);
    setDiscountType(coupon.discountType);
    setDiscountValue(coupon.discountValue);
    setExpiryDate(coupon.expiryDate);
    setAmount(coupon.amount);
  };

  return (
    <div className="coupon-generator-container">
      <h2 className="coupon-generator-title">Coupon Generator</h2>
      <form className="coupon-form" onSubmit={handleSubmit}>
        <div className="coupon-form-group">
          <label htmlFor="couponCode" className="coupon-form-label">Coupon Code</label>
          <input
            type="text"
            id="couponCode"
            className="coupon-form-input"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            required
          />
        </div>
        
        <div className="coupon-form-group">
          <label htmlFor="discountType" className="coupon-form-label">Discount Type</label>
          <select
            id="discountType"
            className="coupon-form-select"
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
            required
          >
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        
        <div className="coupon-form-group">
          <label htmlFor="discountValue" className="coupon-form-label">Discount Value</label>
          <input
            type="number"
            id="discountValue"
            className="coupon-form-input"
            value={discountValue}
            onChange={(e) => setDiscountValue(e.target.value)}
            required
            min="1"
          />
        </div>

        <div className="coupon-form-group">
          <label htmlFor="expiryDate" className="coupon-form-label">Expiry Date</label>
          <input
            type="date"
            id="expiryDate"
            className="coupon-form-input"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            required
          />
        </div>

        <div className="coupon-form-group">
          <label htmlFor="amount" className="coupon-form-label">Amount (Minimum Order Amount)</label>
          <input
            type="number"
            id="amount"
            className="coupon-form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        
        <button type="submit" className="coupon-form-btn">Generate Coupon</button>
      </form>

      {/* Coupons Table */}
      {coupons.length > 0 && (
        <div className="coupon-table-container">
          <h3 className="coupon-table-title">Generated Coupons</h3>
          <table className="coupon-table">
            <thead>
              <tr>
                <th>Coupon Code</th>
                <th>Discount Type</th>
                <th>Discount Value</th>
                <th>Expiry Date</th>
                <th>Minimum Order Amount</th> 
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, index) => (
                <tr key={index}>
                  <td>{coupon.couponCode}</td>
                  <td>{coupon.discountType}</td>
                  <td>{coupon.discountValue}</td>
                  <td>
        {new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'long',
          day: '2-digit',
        }).format(new Date(coupon.expiryDate))}
      </td>
                  <td>{coupon.amount}</td> 
                  <td>
                    <button
                      className="coupon-table-btn edit-btn"
                      onClick={() => handleEdit(coupon)}
                    >
                      Edit
                    </button>
                    <button
                      className="coupon-table-btn delete-btn"
                      onClick={() => handleDelete(coupon.couponCode)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CouponGenerator;
