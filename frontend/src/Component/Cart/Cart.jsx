import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Cart.css";
import { Trash } from "react-feather";
import cartimg from "../../assets/empty-cart.png";
import { useStore } from "../Context/Store";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Cart = ({ setShowLogin }) => {
  const {
    cart,
    API_BASE_URL,
    updateQuantity,
    removeFromCart,
    calculateSubtotal,
    authToken,
  } = useStore();

  const [loadingItems, setLoadingItems] = useState({});
  const [shippingCost, setShippingCost] = useState(0);
  const [stockErrors, setStockErrors] = useState({});
  const navigate = useNavigate();


  const showToast = (message,type="error") =>{
    toast[type](
      <div
      style={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"

      }}
      >
        <span>{message}</span>

        <button
         onClick={() => toast.dismiss()}

         style={{
          background:"transparent",
          border:"none",
          color:"white",
          cursor:"pointer",
          fontSize:"16px",
          fontWeight:"bold",
          padding:"0 0 0 10px",
         }}
        >
        
          ×
        </button>
      </div>,
      {
        position:"top-center",
        autoClose:3000,
        closeButton:false

      }
    )
  }
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const checkStockAndUpdate = async (productId, size, newQuantity) => {
    const itemKey = `${productId}-${size}`;
    setLoadingItems((prev) => ({ ...prev, [itemKey]: true }));
    setStockErrors((prev) => ({ ...prev, [itemKey]: null }));

    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/product/${productId}`
      );
      const product = response.data;
      const sizeData = product.sizes.find((s) => s.size === size);

      if (!sizeData) {
        const errorMsg = "This size is no longer available";
        setStockErrors((prev) => ({ ...prev, [itemKey]: errorMsg }));
        showToast(errorMsg);
        return false;
      }

      const sizeStock = sizeData.stock;
      const maxQuantityLimit = product.maxQuantity || 50;
      const maxAllowed = Math.min(maxQuantityLimit, sizeStock);

      if (newQuantity > maxAllowed) {
        const errorMsg = `Maximum quantity reached! Only ${maxAllowed} items available`;
        setStockErrors((prev) => ({ ...prev, [itemKey]: errorMsg }));
        showToast(errorMsg);
        return false;
      }

      updateQuantity(productId, size, newQuantity);
      return true;
    } catch (error) {
      const errorMsg = "Error checking stock availability";
      setStockErrors((prev) => ({ ...prev, [itemKey]: errorMsg }));
      showToast(errorMsg);
      return false;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemKey]: false }));
    }
  };

  const handleQuantityChange = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    await checkStockAndUpdate(productId, size, newQuantity);
  };

  const handleCheckout = () => {
    if (!authToken) {
      setShowLogin(true);
      return;
    }

    const hasErrors = Object.values(stockErrors).some(Boolean);
    if (hasErrors) {
      showToast("Please resolve stock availability issues before checkout");
      return;
    }

    const totalAmount = getTotalAmount() + shippingCost;
    navigate("/checkout", {
      state: { cartItems: cart, shippingCost, total: totalAmount },
    });
  };

  useEffect(() => {
    const validateCartItems = async () => {
      for (const item of cart) {
        await checkStockAndUpdate(item.productId, item.size, item.quantity);
      }
    };
    validateCartItems();
  }, []);

  return (
    <div className="cart-container">
  
   
    <ToastContainer
  position="top-center"
  autoClose={5000}
  hideProgressBar={true}
  newestOnTop={true}
  closeOnClick={false}
  rtl={false}
  pauseOnFocusLoss
  draggable={false}
  pauseOnHover
  className="toast-alert"
  toastClassName="alert-toast"
  bodyClassName="alert-body"
/>
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
              <div className="Product-code">ItemCode</div>
              <div className="Product-image">Image</div>
              <div className="Product-details">Product</div>
              <div className="Product-Price">Price</div>
              <div className="Product-quantity">Quantity</div>
              <div className="Product-removal">Total</div>
              <div className="Product-line-price">Remove</div>
            </div>

            {cart.map((item) => {
              const itemKey = `${item.productId}-${item.size}`;
              const isLoading = loadingItems[itemKey];
              const error = stockErrors[itemKey];

              return (
                <div className="cart-Item" key={itemKey}>
                  <div className="product-code">{item.itemcode}</div>
                  <img
                    src={`${API_BASE_URL}/images/${item.image}`}
                    alt={item.name}
                    className="Product-Image"
                  />
                  <div className="product-details">
                    <h2>{item.name}</h2>
                    <p>Size: {item.size}</p>
                    {error && <p className="stock-error">{error}</p>}
                  </div>
                  <div className="product-price">₹ {item.price}</div>
                  <div className="product-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.size,
                          item.quantity - 1
                        )
                      }
                      disabled={item.quantity === 1 || isLoading}
                    >
                      -
                    </button>
                    <span>{isLoading ? "..." : item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(
                          item.productId,
                          item.size,
                          item.quantity + 1
                        )
                      }
                      disabled={isLoading}
                    >
                      +
                    </button>
                  </div>
                  <div className="product-total">
                    ₹ {item.price * item.quantity}
                  </div>
                  <Trash
                    className="icon"
                    onClick={() =>
                      !isLoading && removeFromCart(item.productId, item.size)
                    }
                    disabled={isLoading}
                  />
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div>
              <span>Total: ₹ {getTotalAmount() + shippingCost}</span>
            </div>
            <button
              className="Checkout-button"
              onClick={handleCheckout}
              disabled={Object.values(stockErrors).some(Boolean)}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
