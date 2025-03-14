import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { Trash } from "react-feather";
import cartimg from "../../assets/empty-cart.png";
import { useStore } from "../Context/Store";

const Cart = ({setShowLogin}) => {
  const { cart, API_BASE_URL, updateQuantity, calculateSubtotal,removeFromCart } = useStore();
  const [shippingCost, setShippingCost] = useState(0);
  const navigate = useNavigate();

  // Calculate total amount for cart
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = () => {
    const token = localStorage.getItem("token"); // Assuming token is stored in localStorage

    if (!token) {
      setShowLogin(true); // Prompt user to log in
      return;
    }
    const totalAmount = getTotalAmount() + shippingCost;
    navigate("/checkout", { state: { cartItems: cart, shippingCost, total: totalAmount } });
  };

  return (
    <div className="cart-container">
      <header className="cart-header">
        <h1>My Cart ({cart.length} items)</h1>
        <Link to="/menu">
          <button className="continue-shopping">← Continue shopping</button>
        </Link>
      </header>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <img src={cartimg} alt="Empty cart" />
          <h2>Your cart is empty</h2>
        </div>
      ) : (
        <div>
          <div className="Cart-items">
          <div className="cart-item-Header">
            <div className="Product-image">Image</div>
            <div className="Product-details">Product</div>
            <div className="Product-Price">Price</div>
            <div className="Product-quantity">Quantity</div>
            <div className="Product-removal">Total</div>
            <div className="Product-line-price">Remove</div>
          </div>
            {cart.map((item) => (
              <div className="cart-Item" key={item.id}>
                <img src={`${API_BASE_URL}/images/${item.image}`} alt={item.name} className="Product-Image" />
                <div className="product-details">
                  <h2>{item.name}</h2>
                  <p>Variants: {item.size}</p>
                </div>
                <div className="product-price">₹ {item.price}</div>
                <div className="product-quantity">
                  <button
                    onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                    disabled={item.quantity === 1}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="product-total">₹ {item.price * item.quantity}</div>
                <Trash   onClick={() => removeFromCart(item.productId, item.size)} className="icon"/>
               </div>
            ))}
          </div>

          <div className="cart-summary">
            {/* <div>
              <span>Shipping Cost:</span>
              <select onChange={(e) => setShippingCost(parseFloat(e.target.value))}>
                <option value="0">Free</option>
                <option value="12.99">₹12.99</option>
              </select>
            </div> */}
            <div>Total: ₹ {getTotalAmount() + shippingCost}</div>
            <button className="Checkout-button" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;