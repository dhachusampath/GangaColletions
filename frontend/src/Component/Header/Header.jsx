import React, { useEffect, useState, useRef } from "react";
import { Search, User, ShoppingCart, Menu, Plus, Minus, XCircle } from "react-feather";
import "./Header.css";
import logoname from "../../assets/GC-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../Context/Store";
import axios from 'axios'; // Axios for API requests
import SearchBar from "../SearchBar/SearchBar";

const Header = ({ setShowLogin }) => {
  const { cartSidebarOpen, API_BASE_URL,toggleCartSidebar,userId, cart,setCart, updateQuantity, removeFromCart,authToken, calculateSubtotal, setAuthToken,setUserId } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  // const [authToken, setAuthTokenState] = useState(null);  // Local state for authToken
  const [showDropdownDesktop, setShowDropdownDesktop] = useState(false);
  const [showDropdownMobile, setShowDropdownMobile] = useState(false);
    const navigate = useNavigate();
  const itemCount = cart.length;
  const dropdownRefDesktop = useRef(null);
  const dropdownRefMobile = useRef(null);

    const [userRole, setUserRole] = useState("retailer"); // Default to 'retailer'
  

  const categories = [
    { name: "Mugapu Thali chains", subcategories: [] },
    {
      name: "Impon jewelleries",
      subcategories: [
        "Dollar Chains",
        "Attigai",
        "Bangles",
        "Rings",
        "Metti / Toe rings",
        "Thali urukkal",
        "kaapu / kada",
      ],
    },
    {
      name: "Necklace",
      subcategories: [
        "Gold plated Necklace",
        "Stone necklace",
        "Antique & Matte necklace",
      ],
    },
    {
      name: "Haram",
      subcategories: [
        "Goldplated",
        "Stone Haram",
        "Antique & Matte",
      ],
    },
    {
      name: "Combo sets",
      subcategories: [
        "Gold plated Combo sets",
        "Stone sets Combo sets",
      ],
    },
    { name: "Daily use chains", subcategories: [] },
    { name: "Forming", subcategories: [] },
    {
      name: "Bangles",
      subcategories: [
        "Gold plated Bangles",
        "Microplated Bangles",
        "Impon Bangles",
        "Antique & Matte Bangles",
        "Baby Bangles",
      ],
    },
    {
      name: "Earrings",
      subcategories: [
        "Gold plated Earrings",
        "Microplated Earrings",
        "Impon Earrings",
        "Antique & Matte",
      ],
    },
    { name: "Anklets", subcategories: [] },
    { name: "Maatal & Tikka", subcategories: [] },
    { name: "Combo offer sets", subcategories: [] },
    { name: "Hipbelts", subcategories: [] },
  ];

  const toggleDropdownMenu = () => setShowDropdown(!showDropdown);
  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };
  useEffect(() => {
    const fetchProfileData = async () => {
      const storedUserId = localStorage.getItem('userId');
      if (!storedUserId) return;
  
      try {
        const response = await axios.get(`${API_BASE_URL}/auth/user/${storedUserId}`);
        const user = response.data.user;
  
        if (user?.isRetailer === false) {
          setUserRole("wholesaler");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchProfileData();
  }, []);
  
  const handleLogout = () => {
    navigate("/");
    localStorage.clear();
    setAuthToken(null);
    setUserId(null);
    setShowDropdownDesktop(false);
    setShowDropdownMobile(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleCategoryClick = (category) => {
    navigate("/menu", { state: { filter: category } });
    setMobileMenuOpen(false)
  };

  const handleSubcategoryClick = (subcategory, category) => {
    navigate("/menu", { state: { filter: subcategory, parentCategory: category } });
    setMobileMenuOpen(false)
  };
  

  const handleProfileClickDesktop = () => {
    if (authToken) {
      setShowDropdownDesktop(!showDropdownDesktop);
    } else {
      setShowLogin(true);
    }
  };

  const handleProfileClickMobile = () => {
    if (authToken) {
      setShowDropdownMobile(!showDropdownMobile);
    } else {
      setShowLogin(true);
    }
  };

  const handleViewCart = () => {
    toggleCartSidebar(); // Close the sidebar
    navigate("/cart"); // Navigate to the cart page
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch); // Toggle the search input visibility
  };

  // Check for token in localStorage when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setAuthToken(token); // Set authToken from localStorage
    if (token) {
      setAuthToken(token);  // Set authToken in context if it's present
    }
  }, [setAuthToken ,dropdownRefDesktop,dropdownRefMobile ]);  // Dependency array includes setAuthToken to update context on token change

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRefDesktop.current && !dropdownRefDesktop.current.contains(event.target)) {
        setShowDropdownDesktop(false);
      }
      if (dropdownRefMobile.current && !dropdownRefMobile.current.contains(event.target)) {
        setShowDropdownMobile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  
  return (
    <header className="header">
      {/* Desktop Header */}
      <div className="desktop-header">
        <Link to="/">
          <div className="logo">
            <img src={logoname} alt="Logo" style={{ width: "80px" }} />
            {/* Conditionally render the tag if userRole is 'Wholesaler' */}
            {userRole === "wholesaler" && (
              <span className="wholesaler-tag">Wholesaler</span>
            )}
          </div>
        </Link>
        <nav className="nav">
          <a href="/">Home</a>
          <div className="dropdown">
            <button className="dropdown-btn">Collection</button>
            <div className="dropdown-content">
              {categories.map((cat, index) => (
                <div key={index} className="category">
                  <h4 onClick={() => handleCategoryClick(cat.name)}>{cat.name}</h4>
                  <ul>
                    {cat.subcategories.map((sub, subIndex) => (
                      <li key={subIndex} onClick={() => handleSubcategoryClick(sub, cat.name)}>
  {sub}
</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <a href="/about">About</a>
          <Link to="/contact">
            <a href="/contact">Contact Us</a>
          </Link>
        </nav>
        <div className="actions">
          <Search className="icon" onClick={toggleSearch} />
          <div className="user-profile" ref={dropdownRefDesktop}>
            {authToken ? (
              <div className="dropdown-container">
                <User className="icon" onClick={handleProfileClickDesktop} />
                {showDropdownDesktop && (
                  <div className="dropdown-menu">
                    <Link to="/myaccount">My Account</Link>
                    <button onClick={handleLogout}>Logout</button>
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

      {/* Search Input below the header */}
      {showSearch && (
       <SearchBar setShowSearch={setShowSearch}/>
      )}

      {/* Mobile Header */}
      <div className="mobile-header">
        <Menu className="icon" style={{ color: "ff9800" }} onClick={toggleMobileMenu} />
        <Link to="/">
          <div className="logo">
            <img src={logoname} alt="Logo" style={{ width: "75px" }} />
                        {/* Conditionally render the tag if userRole is 'Wholesaler' */}
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
                    <Link to="/myaccount">My Account</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <User className="icon" onClick={() => setShowLogin(true)} />
            )}
          </div>
          <Link to="/cart" className="cart-link">
            <ShoppingCart className="icon" />
            {itemCount > 0 && <span className="cart-count">{itemCount}</span>}
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar">
          <button className="close-btn" onClick={toggleMobileMenu}>
            <XCircle/>
          </button>
          <nav className="mobile-nav">
            <Link to="/" onClick={toggleMobileMenu}>
              Home
            </Link>
            {categories.map((cat, index) => (
        <div className="mobile-category" key={index}>
          {/* Category Button (Click to Expand/Collapse) */}
          <button className="category-btn">
  <span onClick={() => handleCategoryClick(cat.name)}>{cat.name}</span>
  <span onClick={(e) => { e.stopPropagation(); toggleCategory(cat.name); }}>
    {expandedCategories[cat.name] ? <Minus /> : <Plus />}
  </span>
</button>
          {/* Subcategories List (Only shown when expanded) */}
          {expandedCategories[cat.name] && (
            <ul className="nested-list">
              {cat.subcategories.map((sub, subIndex) => (
                <li key={subIndex} onClick={() => handleSubcategoryClick(sub, cat.name)}>
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
              {cart.map((item) => {
                return(
                <li key={`${item.id}-${item.size}`} className="cart-item">
                  <img src={`${API_BASE_URL}/images/${item.image}`} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <span>{item.name}</span>
                    {item.size && <span>Size: {item.size}</span>}
                    <div className="quantity-controls">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="quantity-btn"
                        disabled={item.quantity === 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId , item.size, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <span className="item-price">₹{item.price * item.quantity}</span>
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="remove-item-btn"
                    >
                      Remove
                    </button>
                  </div>
                </li>
                )
})}
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
