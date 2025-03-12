import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Checkout.css";
import { useStore } from "../Context/Store";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const Checkout = () => {
  const { state ,API_BASE_URL} = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const {url,userId ,setCart }=useStore();
  const cartItems = state?.cartItems || []; // Fallback to an empty array if no data
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [deliveryCharge, setDeliveryCharge] = useState(80); // Default charge
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mobileNumber: "",
  });
  const [billingAddress, setBillingAddress] = useState({
    firstName: "",
    lastName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    mobileNumber: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [coupons, setCoupons] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  useEffect(() => {
    // Fetch coupons from the backend
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${url}/coupons`);
        setCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons", error);
      }
    };

    fetchCoupons();
  }, []);

   const applyCoupon = () => {
    setError(""); // Clear previous errors
    const coupon = coupons.find((c) => c.couponCode === couponCode);
  
    if (!coupon) {
      setError("Invalid coupon code");
      toast.error("Invalid coupon code"); // Show error message
      return;
    }
  
    // Check coupon expiry
    const currentDate = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    if (expiryDate < currentDate) {
      setError("Coupon has expired");
      toast.error("Coupon has expired"); // Show error message
      return;
    }
  
    // Check if subtotal meets coupon's minimum required amount
    if (subtotal < coupon.amount) {
      setError(`Coupon is valid only for orders above ₹${coupon.amount.toFixed(2)}`);
      toast.error(`Coupon is valid only for orders above ₹${coupon.amount.toFixed(2)}`); // Show error message
      return;
    }
  
    // Calculate discount
    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (coupon.discountValue / 100) * subtotal;
    } else if (coupon.discountType === "fixed") {
      discountAmount = coupon.discountValue;
    }
  
    // Ensure discount doesn't exceed subtotal
    if (discountAmount > subtotal) {
      discountAmount = subtotal;
    }
  
    setDiscount(discountAmount);
    setTotal(subtotal - discountAmount); // Update the total
  
    // Show success message
    toast.success("Coupon added successfully!");
    setCouponCode("")
  };
  

  // Delivery Charges calculation 
  useEffect(() => {
    let charge = 80; // Default charge
  
    switch (shippingAddress.state) {
      case "Tamil Nadu":
        charge = 80;
        break;
      case "Kerala":
        charge = 100;
        break;
      case "Karnataka":
        charge = 100;
        break;
      case "Andhra Pradesh":
        charge = 100;
        break;
      case "Telangana":
        charge = 100;
        break;
      case "Andaman and Nicobar":
        charge = 100;
        break;
      default:
        charge = 100;
        break;
    }
  
  
    setDeliveryCharge(charge);
  }, [shippingAddress.state, subtotal]);
  
  useEffect(() => {
    setTotal(subtotal - discount + deliveryCharge);
  }, [subtotal, discount, deliveryCharge]);

  useEffect(() => {
    if (!Array.isArray(cartItems)) {
      console.error("cartItems is not an array:", cartItems);
      return;
    }

    // Validate and calculate
    const validatedItems = cartItems.filter(
      (item) => typeof item.price === "number" && typeof item.quantity === "number"
    );

    const calculatedSubtotal = validatedItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setSubtotal(calculatedSubtotal);
    setTotal(calculatedSubtotal); // Adjust for tax/shipping if needed
  }, [cartItems]);
  const validateFields = (address) => {
    const fieldErrors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const mobileRegex = /^\d{10}$/;
    const pinCodeRegex = /^\d{6}$/;
  
    Object.entries(address).forEach(([key, value]) => {
      if (!value.trim()) {
        fieldErrors[key] = `${key} is required`;
      } else {
        // Additional validations
        if ((key === "firstName" || key === "lastName" || key === "city") && !nameRegex.test(value)) {
          fieldErrors[key] = `${key} should contain only letters`;
        }
        if (key === "mobileNumber" && !mobileRegex.test(value)) {
          fieldErrors[key] = `${key} should be a valid 10-digit number`;
        }
        if (key === "zipCode" && !pinCodeRegex.test(value)) {
          fieldErrors[key] = `${key} should be a valid 6-digit number`;
        }
      }
    });
  
    return fieldErrors;
  };
  

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBillingAddressChange = (e) => {
    const { name, value } = e.target;
    setBillingAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate shipping address
    const shippingErrors = validateFields(shippingAddress);
    let billingErrors = {};
  
    // Validate billing address only if not using the same address
    if (!useSameAddress) {
      billingErrors = validateFields(billingAddress);
    }
  
    // Combine errors
    const combinedErrors = { ...shippingErrors, ...billingErrors };
    setErrors(combinedErrors);
  
    if (Object.keys(combinedErrors).length > 0) {
      // Get field names with errors
      const missingFields = Object.keys(combinedErrors)
        .map((field) => field.replace(/([A-Z])/g, " $1").toLowerCase())
        .join(", ");
      alert(`Please fill in the following fields: ${missingFields}`);
      return;
    }
    setLoading(true);
  
    // Prepare data for navigation
    const dataToPass = {
      cartItems,
      shippingAddress,
      billingAddress: useSameAddress ? shippingAddress : billingAddress,
    };
  
    // Call Razorpay payment
  
    const handleRazorpayPayment = async (data) => {
      try {
        const totalAmount = total * 100; // Convert to paise
    
        const response = await fetch(`${API_BASE_URL}/create-order`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: totalAmount }),
        });
    
        const orderData = await response.json();
    
        if (!orderData.id) {
          alert("Failed to create order. Please try again.");
          return;
        }
    
        // Fetch user details using userId
        const storedUserId = localStorage.getItem("userId");  // Assuming userId is saved in localStorage
        if (!storedUserId) {
          alert("User is not logged in");
          return;
        }
    
        const userResponse = await axios.get(`${API_BASE_URL}/auth/user/${storedUserId}`);
        const userDetails = userResponse.data;
        
        // Extract the user's email from the response
        const userEmail = userDetails.user.email;
        
        console.log("User Email:", userEmail);
       
          
        const options = {
          key: "rzp_test_EmkCRNH5To2ks8", // Replace with your Razorpay key
          amount: orderData.amount,
          currency: "INR",
          name: "Ganga Collections",
          description: "Purchase of items",
          order_id: orderData.id,
          handler: async function (response) {
            // Store order details in the backend
            const orderDetails = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              cartItems,
              userId: storedUserId,
              shippingAddress,
              billingAddress: useSameAddress ? shippingAddress : billingAddress,
              totalAmount: totalAmount / 100, // Convert back to INR
              userDetails, // Send the fetched user details
              userEmail
            };
    
            const saveOrderResponse = await fetch(`${API_BASE_URL}/save-order`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(orderDetails),
            });
    
            const result = await saveOrderResponse.json();
    
            if (result.success) {
              const uniqueOrderId = result.orderId; // Get unique order ID from backend
    
              // Remove cart items from backend
              await fetch(`${API_BASE_URL}/cart/clear-cart`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: storedUserId }),
              });
    
              // Clear the cart in frontend
              setCart([]); // Clear cart state
              localStorage.removeItem("cart"); // Clear cart from local storage
    
              // Redirect to confirmation page with unique order ID
              navigate("/order-confirmation", { state: { uniqueOrderId, orderDetails } });
            } else {
              navigate("/order-failure"); // Redirect to failure page
            }
          },
    
          prefill: {
            name: shippingAddress.fullName,
            email: shippingAddress.email,
            contact: shippingAddress.phone,
          },
          theme: {
            color: "#3399cc",
          },
        };
    
        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error("Razorpay error:", error);
        alert("Error processing payment. Please try again.");
        setLoading(false); // Reset loading state on error
      }
    };
    
    handleRazorpayPayment(dataToPass);
  };

  

  const getFieldError = (field) => errors[field] ? "error" : "";

  return (
    <>
      <main className="checkout-container">
        <div className="grid-container">
          <div className="lg:col-span-2 space-y-8">
            <section className="section">
              <div className="flex items-center justify-between mb-4">
                <h2 className="section-header">Shipping Address</h2>
              </div>
              <form className="custom-checkout-form" onSubmit={handleSubmit}>
                {/* Shipping Address Inputs */}
                <div className="custom-form-row">
                <div className={`custom-form-group ${getFieldError("firstName")}`}>
                    <label className="custom-form-label">First Name</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="firstName"
                      value={shippingAddress.firstName}
                      onChange={handleAddressChange}
                      placeholder="John"
                    />
                      {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                  </div>
                  <div className={`custom-form-group ${getFieldError("lastName")}`}>
                  <label className="custom-form-label">Last Name</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="lastName"
                      value={shippingAddress.lastName}
                      onChange={handleAddressChange}
                      placeholder="Doe"
                    />
                   {errors.firstName && <p className="error-message">{errors.lastName}</p>}

                  </div>
                </div>
                <div className={`custom-form-group ${getFieldError("streetAddress")}`}>
                <label className="custom-form-label">Street Address</label>
                  <input
                    type="text"
                    className="custom-form-input"
                    name="streetAddress"
                    value={shippingAddress.streetAddress}
                    onChange={handleAddressChange}
                    placeholder="123 Main St"
                  />
                    {errors.firstName && <p className="error-message">{errors.streetAddress}</p>}
                
                </div>
                <div className="custom-form-group">
                  <label className="custom-form-label">Landmark (optional)</label>
                  <input
                    type="text"
                    className="custom-form-input"
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="custom-form-row">
                <div className={`custom-form-group ${getFieldError("city")}`}>
                    <label className="custom-form-label">City</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="city"
                      value={shippingAddress.city}
                      onChange={handleAddressChange}
                      placeholder="Coimbatore"
                    />
                  {errors.firstName && <p className="error-message">{errors.city}</p>}
                  </div>
                  <div className={`custom-form-group ${getFieldError("state")}`}>
                  <label className="custom-form-label">State</label>
  <select
    className="custom-form-select"
    name="state"
    value={shippingAddress.state}
    onChange={handleAddressChange}
  >
    <option>Select State</option>
    <option>Andhra Pradesh</option>
    <option value="Andhra Pradesh">Andhra Pradesh</option>
    <option>Assam</option>
    <option>Bihar</option>
    <option>Chhattisgarh</option>
    <option>Goa</option>
    <option>Gujarat</option>
    <option>Haryana</option>
    <option>Himachal Pradesh</option>
    <option>Jharkhand</option>
    <option value="Karnataka">Karnataka</option>
    <option value="Kerala">Kerala</option>
    <option>Madhya Pradesh</option>
    <option>Maharashtra</option>
    <option>Manipur</option>
    <option>Meghalaya</option>
    <option>Mizoram</option>
    <option>Nagaland</option>
    <option>Odisha</option>
    <option>Punjab</option>
    <option>Rajasthan</option>
    <option>Sikkim</option>
    <option value="Tamil Nadu">Tamil Nadu</option>
    <option value="Telangana">Telangana</option>
    <option>Uttar Pradesh</option>
    <option>Uttarakhand</option>
    <option>West Bengal</option>
    <option value="Andaman and Nicobar">Andaman and Nicobar</option>
    <option>Chandigarh</option>
    <option>Dadra and Nagar Haveli and Daman and Diu</option>
    <option>Lakshadweep</option>
    <option>Delhi</option>
    <option>Puducherry</option>
  </select>
  {errors.firstName && <p className="error-message">{errors.state}</p>}
</div>
<div className={`custom-form-group ${getFieldError("zipCode")}`}>
                    <label className="custom-form-label">ZIP Code</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="zipCode"
                      value={shippingAddress.zipCode}
                      onChange={handleAddressChange}
                      placeholder="641062"
                    />
             {errors.firstName && <p className="error-message">{errors.zipCode}</p>}
                  </div>
                  <div className={`custom-form-group ${getFieldError("mobileNumber")}`}>
                <label className="custom-form-label">Mobile Number</label>
                <input
                  type="text"
                  className="custom-form-input"
                  name="mobileNumber"
                  value={shippingAddress.mobileNumber}
                  onChange={handleAddressChange}
                  placeholder="1234567890"
                />
                  {errors.firstName && <p className="error-message">{errors.mobileNumber}</p>}
              </div>
                </div>
                {/* Checkbox for Billing Address */}
                <div className="custom-form-group">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={useSameAddress}
                      onChange={(e) => setUseSameAddress(e.target.checked)}
                    />
                    <span className="checkbox-label">Use the same address for billing</span>
                  </label>
                </div>
                {/* Billing Address Inputs */}
                {!useSameAddress && (
                  <div className="billing-address">
                    <h3 className="section-header">Billing Address</h3>
                    <div className="custom-form-row">
                    <div className={`custom-form-group ${getFieldError("firstName")}`}>
                    <label className="custom-form-label">First Name</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="firstName"
                      value={billingAddress.firstName}
                      onChange={handleBillingAddressChange}
                      placeholder="John"
                    />
                      {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                  </div>
                  <div className={`custom-form-group ${getFieldError("lastName")}`}>
                  <label className="custom-form-label">Last Name</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="lastName"
                      value={billingAddress.lastName}
                      onChange={handleBillingAddressChange}
                      placeholder="Doe"
                    />
                   {errors.firstName && <p className="error-message">{errors.lastName}</p>}

                  </div>
                </div>
                <div className={`custom-form-group ${getFieldError("streetAddress")}`}>
                <label className="custom-form-label">Street Address</label>
                  <input
                    type="text"
                    className="custom-form-input"
                    name="streetAddress"
                    value={billingAddress.streetAddress}
                    onChange={handleBillingAddressChange}
                    placeholder="123 Main St"
                  />
                    {errors.firstName && <p className="error-message">{errors.streetAddress}</p>}
                
                </div>
                <div className="custom-form-group">
                  <label className="custom-form-label">Landmark (optional)</label>
                  <input
                    type="text"
                    className="custom-form-input"
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="custom-form-row">
                <div className={`custom-form-group ${getFieldError("city")}`}>
                    <label className="custom-form-label">City</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="city"
                      value={billingAddress.city}
                      onChange={handleBillingAddressChange}
                      placeholder="Coimbatore"
                    />
                  {errors.firstName && <p className="error-message">{errors.city}</p>}
                  </div>
                  <div className={`custom-form-group ${getFieldError("state")}`}>
                  <label className="custom-form-label">State</label>
  <select
    className="custom-form-select"
    name="state"
    value={billingAddress.state}
    onChange={handleBillingAddressChange}
    >
    <option>Select State</option>
    <option>Andhra Pradesh</option>
    <option>Arunachal Pradesh</option>
    <option>Assam</option>
    <option>Bihar</option>
    <option>Chhattisgarh</option>
    <option>Goa</option>
    <option>Gujarat</option>
    <option>Haryana</option>
    <option>Himachal Pradesh</option>
    <option>Jharkhand</option>
    <option>Karnataka</option>
    <option>Kerala</option>
    <option>Madhya Pradesh</option>
    <option>Maharashtra</option>
    <option>Manipur</option>
    <option>Meghalaya</option>
    <option>Mizoram</option>
    <option>Nagaland</option>
    <option>Odisha</option>
    <option>Punjab</option>
    <option>Rajasthan</option>
    <option>Sikkim</option>
    <option>Tamil Nadu</option>
    <option>Telangana</option>
    <option>Uttar Pradesh</option>
    <option>Uttarakhand</option>
    <option>West Bengal</option>
    <option>Andaman and Nicobar Islands</option>
    <option>Chandigarh</option>
    <option>Dadra and Nagar Haveli and Daman and Diu</option>
    <option>Lakshadweep</option>
    <option>Delhi</option>
    <option>Puducherry</option>
  </select>
  {errors.firstName && <p className="error-message">{errors.state}</p>}
</div>
<div className={`custom-form-group ${getFieldError("zipCode")}`}>
                    <label className="custom-form-label">ZIP Code</label>
                    <input
                      type="text"
                      className="custom-form-input"
                      name="zipCode"
                      value={billingAddress.zipCode}
                      onChange={handleBillingAddressChange}
                      placeholder="641062"
                    />
             {errors.firstName && <p className="error-message">{errors.zipCode}</p>}
                  </div>
                  <div className={`custom-form-group ${getFieldError("mobileNumber")}`}>
                <label className="custom-form-label">Mobile Number</label>
                <input
                  type="text"
                  className="custom-form-input"
                  name="mobileNumber"
                  value={billingAddress.mobileNumber}
                  onChange={handleBillingAddressChange}
                  placeholder="1234567890"
                />
                  {errors.firstName && <p className="error-message">{errors.mobileNumber}</p>}
              </div>
                </div>
                  </div>
                )}
              </form>
            </section>
          </div>
          <div className="lg:col-span-1">
            <div className="order-summary-container">
              <h2 className="order-summary-header">Order Summary</h2>
              {cartItems.map((item) => (
              <div className="order-item">
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                  className="order-item-image"
                />
                <div className="order-item-details">
                  <h3 className="order-item-title">{item.name}</h3>
                  <p className="order-item-text">Varient: {item.size}</p>
                  <p className="order-item-text">Quantity: {item.quantity}</p>
                  <p className="order-item-price">₹{item.price * item.quantity}</p>
                </div>
              </div>
              ))}
                {error && <p style={{ color: "red", padding:"0px 8px 8px 5px"}}>{error}</p>}
              <div className="promo-container">
                <input type="text" className="promo-input" placeholder="Promo Code" value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)} />
                <button onClick={applyCoupon} className="promo-button">Apply</button>
              </div>

              <div className="price-summary-container">
                <div className="price-summary-item">
                  <span className="price-summary-text">Subtotal</span>
                  <span>₹ 
                  {/* {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} */}
                  {subtotal}
                  </span>
                </div>
                <div className="price-summary-item">
  <span className="price-summary-text">Tax is already included</span>
</div>
                <div className="price-summary-item">
                  <span className="price-summary-text">Shipping</span>
                  <span className="text-green-600">₹{deliveryCharge.toFixed(2)}</span>
                </div>

                <div className="price-summary-item">
                  <span className="price-summary-text">Coupon Discount</span>
                  <span>₹{discount.toFixed(2)}</span>
                </div>
              </div>

              <div className="price-summary-item">
                <span className="price-summary-total">Total</span>
                {/* <span className="price-summary-total">₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)} */}
                <span className="price-summary-total">₹{total}
                </span>
              </div>

              <button
  type="submit"
  className="checkout-button"
  disabled={loading}
  onClick={handleSubmit}
  style={loading ? { pointerEvents: "none" } : {}}
>
  <span>{loading ? "Processing..." : "Proceed to Payment"}</span>
  <i className="fas fa-lock ml-2"></i>
</button>



              <div className="footer-container">
                <span className="footer-links">Terms and Conditions</span> | <span className="footer-links">Privacy Policy</span>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer/>
      </main>
    </>
  );
};

export default Checkout;