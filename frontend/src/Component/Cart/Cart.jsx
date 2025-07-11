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
    authToken,
    fetchCart, // Added fetchCart from store
  } = useStore();

  const [loadingItems, setLoadingItems] = useState({});
  const [shippingCost] = useState(0); // Made shippingCost constant since it's not modified
  const [stockErrors, setStockErrors] = useState({});
  const navigate = useNavigate();

  // Improved toast notification
  const showToast = (message, type = "error") => {
    toast[type](message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeButton: false,
    });
  };

  // Memoized total calculation
  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Enhanced stock checking with API error handling
  const checkStockAndUpdate = async (productId, size, newQuantity) => {
    const itemKey = `${productId}-${size}`;
    setLoadingItems((prev) => ({ ...prev, [itemKey]: true }));
    setStockErrors((prev) => ({ ...prev, [itemKey]: null }));

    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/product/${productId}` // Updated API endpoint
      );

      if (!response.data) {
        throw new Error("Product not found");
      }

      const product = response.data;
      const sizeData = product.sizes.find((s) => s.size === size);

      if (!sizeData) {
        throw new Error("This size is no longer available");
      }

      const maxAllowed = Math.min(product.maxQuantity || 50, sizeData.stock);

      if (newQuantity > maxAllowed) {
        throw new Error(`Only ${maxAllowed} items available`);
      }

      // Update backend first

      // Then update local state
      updateQuantity(productId, size, newQuantity);
      return true;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message;
      setStockErrors((prev) => ({ ...prev, [itemKey]: errorMsg }));
      showToast(errorMsg);
      return false;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemKey]: false }));
    }
  };

  // Quantity change handler with validation
  const handleQuantityChange = async (productId, size, newQuantity) => {
    if (newQuantity < 1) return;
    await checkStockAndUpdate(productId, size, newQuantity);
  };

  // Improved checkout handler
  const handleCheckout = () => {
    if (!authToken) {
      setShowLogin(true);
      return;
    }

    if (Object.values(stockErrors).some(Boolean)) {
      showToast("Please resolve stock issues before checkout");
      return;
    }

    navigate("/checkout", {
      state: {
        cartItems: cart,
        shippingCost,
        total: getTotalAmount() + shippingCost,
      },
    });
  };

  // Cart validation on mount
  useEffect(() => {
    const validateCartItems = async () => {
      if (authToken?.userId) {
        try {
          await fetchCart(); // Sync with server cart
          for (const item of cart) {
            await checkStockAndUpdate(item.productId, item.size, item.quantity);
          }
        } catch (error) {
          console.error("Cart validation error:", error);
        }
      }
    };
    validateCartItems();
  }, [authToken]); // Added authToken as dependency

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
                    onError={(e) => {
                      e.target.src = "path/to/default-image.png";
                    }}
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
                      aria-label="Decrease quantity"
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
                      aria-label="Increase quantity"
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
                    aria-label="Remove item"
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
              disabled={
                Object.values(stockErrors).some(Boolean) || cart.length === 0
              }
              aria-label="Proceed to checkout"
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
