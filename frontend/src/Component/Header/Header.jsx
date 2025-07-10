import React, { useEffect, useState, useRef } from "react";
import {
  Search,
  User,
  ShoppingCart,
  Menu,
  Plus,
  Minus,
  XCircle,
} from "react-feather";
import "./Header.css";
import logoname from "../../assets/GC-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../Context/Store";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = ({ setShowLogin }) => {
  const {
    cartSidebarOpen,
    categories,
    API_BASE_URL,
    toggleCartSidebar,
    userId,
    cart,
    setCart,
    updateQuantity,
    removeFromCart,
    authToken,
    calculateSubtotal,
    setAuthToken,
    setUserId,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdownDesktop, setShowDropdownDesktop] = useState(false);
  const [showDropdownMobile, setShowDropdownMobile] = useState(false);
  const [userRole, setUserRole] = useState("retailer");
  const [userDetails, setUserDetails] = useState(null);
  const [loadingItems, setLoadingItems] = useState({});

  const dropdownRefDesktop = useRef(null);
  const dropdownRefMobile = useRef(null);
  const navigate = useNavigate();
  const itemCount = cart.length;

  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token);
  }, [setAuthToken]);

  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUserId = localStorage.getItem("userId");
      if (!storedUserId) return;

      try {
        const response = await axios.get(
          `${API_BASE_URL}/auth/user/${storedUserId}`
        );
        const user = response.data.user;

        if (user?.isRetailer === false) {
          setUserRole("wholesaler");
        }

        setUserDetails(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchProfileData();
  }, [API_BASE_URL]);

  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
    setAuthToken(null);
    setUserId(null);
    setShowDropdownDesktop(false);
    setShowDropdownMobile(false);
    toast.success("Logged out successfully", {
      position: "top-right",
      autoClose: 2000,
    });
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const handleCategoryClick = (category) => {
    navigate("/menu", { state: { filter: category } });
    setMobileMenuOpen(false);
  };

  const handleSubcategoryClick = (subcategory, category) => {
    navigate("/menu", {
      state: { filter: subcategory, parentCategory: category },
    });
    setMobileMenuOpen(false);
  };

  const handleProfileClickDesktop = () => {
    if (authToken) setShowDropdownDesktop(!showDropdownDesktop);
    else setShowLogin(true);
  };

  const handleProfileClickMobile = () => {
    if (authToken) setShowDropdownMobile(!showDropdownMobile);
    else setShowLogin(true);
  };

  const handleViewCart = () => {
    toggleCartSidebar();
    navigate("/cart");
  };

  const toggleSearch = () => setShowSearch(!showSearch);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const checkStockAndUpdate = async (productId, size, newQuantity) => {
    const itemKey = `${productId}-${size}`;
    setLoadingItems((prev) => ({ ...prev, [itemKey]: true }));

    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/product/${productId}`
      );
      const product = response.data;
      const sizeData = product.sizes.find((s) => s.size === size);

      if (!sizeData) {
        toast.error("This size is no longer available", {
          position: "top-right",
          autoClose: 3000,
        });
        return false;
      }

      const sizeStock = sizeData.stock;
      const maxQuantityLimit = product.maxQuantity || 50;
      const maxAllowed = Math.min(maxQuantityLimit, sizeStock);

      if (newQuantity > maxAllowed) {
        toast.error(
          `Maximum quantity reached! You can only add up to ${maxAllowed} items.`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        return false;
      }

      updateQuantity(productId, size, newQuantity);
      return true;
    } catch (error) {
      console.error("Stock check failed:", error);
      toast.error("Failed to update quantity. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return false;
    } finally {
      setLoadingItems((prev) => ({ ...prev, [itemKey]: false }));
    }
  };

  const handleRemoveItem = async (productId, size) => {
    try {
      await removeFromCart(productId, size);
      toast.success("Item removed from cart", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Failed to remove item", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRefDesktop.current &&
        !dropdownRefDesktop.current.contains(event.target)
      ) {
        setShowDropdownDesktop(false);
      }
      if (
        dropdownRefMobile.current &&
        !dropdownRefMobile.current.contains(event.target)
      ) {
        setShowDropdownMobile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      <ToastContainer />
      {/* Desktop Header */}
      <div className="desktop-header">
        <Link to="/">
          <div className="logo">
            <img src={logoname} alt="Logo" style={{ width: "80px" }} />
            {userRole === "wholesaler" && (
              <span className="wholesaler-tag">Wholesaler</span>
            )}
          </div>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <div className="dropdown">
            <button className="dropdown-btn">Collection</button>
            <div className="dropdown-content">
              {categories.map((cat, index) => (
                <div key={index} className="category">
                  <h4 onClick={() => handleCategoryClick(cat.name)}>
                    {cat.name}
                  </h4>
                  <ul>
                    {cat.subcategories.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        onClick={() => handleSubcategoryClick(sub, cat.name)}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact Us</Link>
        </nav>
        <div className="actions">
          <Search className="icon" onClick={toggleSearch} />
          <div className="user-profile" ref={dropdownRefDesktop}>
            {authToken ? (
              <div className="dropdown-container">
                <User className="icon" onClick={handleProfileClickDesktop} />
                {showDropdownDesktop && (
                  <div className="dropdown-menu">
                    {userDetails && (
                      <div className="user-info">
                        <p>
                          <strong>{userDetails.name}</strong>
                        </p>
                        <hr />
                      </div>
                    )}
                    <div className="cl">
                      <Link to="/myaccount">
                        <h1 className='k'>My Account</h1>
                      </Link>
                      <button className="btnn" onClick={handleLogout}>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <User className="icon" onClick={() => setShowLogin(true)} />
            )}
          </div>
          <div className="cart-icon-container">
            <ShoppingCart className="icon" onClick={toggleCartSidebar} />
            {itemCount > 0 && <span className="Cart-count">{itemCount}</span>}
          </div>
        </div>
      </div>

      {showSearch && <SearchBar setShowSearch={setShowSearch} />}

      {/* Mobile Header */}
      <div className="mobile-header">
        <Menu className="icon" onClick={toggleMobileMenu} />
        <Link to="/">
          <div className="logo">
            <img src={logoname} alt="Logo" style={{ width: "75px" }} />
            {userRole === "wholesaler" && (
              <span className="wholesaler-tag">Wholesaler</span>
            )}
          </div>
        </Link>
        <div className="actions">
          <Search className="icon" onClick={toggleSearch} />
          <div className="user-profile" ref={dropdownRefMobile}>
            {authToken ? (
              <div className="dropdown-container">
                <User className="icon" onClick={handleProfileClickMobile} />
                {showDropdownMobile && (
                  <div className="dropdown-menu">
                    {userDetails && (
                      <div className="user-info">
                        <p>
                          <strong>{userDetails.name}</strong>
                        </p>
                        <hr />
                      </div>
                    )}
                    <Link to="/myaccount" className="p">
                      My Account
                    </Link>
                    <button onClick={handleLogout} className="lo">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <User className="icon" onClick={() => setShowLogin(true)} />
            )}
          </div>
          <ShoppingCart className="icon" onClick={toggleCartSidebar} />
          {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar">
          <button className="close-btn" onClick={toggleMobileMenu}>
            <XCircle />
          </button>
          <nav className="mobile-nav">
            <Link to="/" onClick={toggleMobileMenu}>
              Home
            </Link>
            {categories.map((cat, index) => (
              <div className="mobile-category" key={index}>
                <button className="category-btn">
                  <span onClick={() => handleCategoryClick(cat.name)}>
                    {cat.name}
                  </span>
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategory(cat.name);
                    }}
                  >
                    {expandedCategories[cat.name] ? <Minus /> : <Plus />}
                  </span>
                </button>
                {expandedCategories[cat.name] && (
                  <ul className="nested-list">
                    {cat.subcategories.map((sub, subIndex) => (
                      <li
                        key={subIndex}
                        onClick={() => handleSubcategoryClick(sub, cat.name)}
                      >
                        {sub}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <Link to="/about" onClick={toggleMobileMenu}>
              About
            </Link>
            <Link to="/contactus" onClick={toggleMobileMenu}>
              Contact Us
            </Link>
          </nav>
        </div>
      )}

      {/* Cart Sidebar */}
      {cartSidebarOpen && (
        <div className="cart-sidebar">
          <button className="close-btn" onClick={toggleCartSidebar}>
            <XCircle />
          </button>
          <div className="cart-content">
            <h3>Your Cart</h3>
            <ul className="cart-items">
              {cart.length === 0 ? (
                <div>
                  <p className="p">No items in this cart</p>
                  <Link to="/menu">
                    <button className="btns">Continue Shopping</button>
                  </Link>
                </div>
              ) : (
                cart.slice(0, 15).map((item) => {
                  const itemKey = `${item.productId}-${item.size}`;
                  const isLoading = loadingItems[itemKey];

                  return (
                    <li key={itemKey} className="cart-item">
                      <img
                        src={`${API_BASE_URL}/images/${item.image}`}
                        alt={item.name}
                        className="cart-item-image"
                      />
                      <div className="cart-item-details">
                        <span>{item.name}</span>
                        {item.itemcode && (
                          <span className="code">
                            Item Code: {item.itemcode}
                          </span>
                        )}
                        {item.size && <span>Size: {item.size}</span>}

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              !isLoading &&
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.quantity - 1
                              )
                            }
                            className="quantity-btn"
                            disabled={item.quantity === 1 || isLoading}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={async () => {
                              if (!isLoading) {
                                await checkStockAndUpdate(
                                  item.productId,
                                  item.size,
                                  item.quantity + 1
                                );
                              }
                            }}
                            className="quantity-btn"
                            disabled={isLoading}
                          >
                            {isLoading ? "..." : "+"}
                          </button>
                          {item.quantity >= (item.maxQuantity || 52) && (
                            <span className="max-quantity-message">
                              (Max {item.maxQuantity || 50})
                            </span>
                          )}
                        </div>
                        <span className="item-price">
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            !isLoading &&
                            handleRemoveItem(item.productId, item.size)
                          }
                          className="remove-item-btn"
                          disabled={isLoading}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
            <div className="Cart-summary fixed-summary">
              <p>
                <strong>Total:</strong> ₹{calculateSubtotal()}
              </p>
              <button className="view-cart-btn" onClick={handleViewCart}>
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
