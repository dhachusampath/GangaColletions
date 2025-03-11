import React, { useState } from 'react';
import { Home, ShoppingCart, User ,ShoppingBag,} from 'react-feather';  // Importing Feather icons
import './BottomBar.css';  // Import the CSS for styling
import { Link } from 'react-router-dom';
import { useStore } from '../Context/Store';

const BottomBar = ({ setShowLogin }) => {
  // State to track the active link
  const { cart ,authToken} = useStore();
  const [activeLink, setActiveLink] = useState('home');
  const itemCount = cart.length; // Get the number of items in the cart

  // Function to handle active link change
  const handleActiveLink = (link) => {
    setActiveLink(link);
  };

  return (
    <div className="bottom-bar">
      <ul>
      <Link to="/"><li>
          <a
            href="#home"
            onClick={() => handleActiveLink('home')}
            className={activeLink === 'home' ? 'active' : ''}
          >
            <Home className="icon" />
            {/* Home */}
          </a>
        </li>
        </Link>
        <Link to="/menu"><li>
          <a
            href="#shop"
            onClick={() => handleActiveLink('shop')}
            className={activeLink === 'shop' ? 'active' : ''}
          >
           <ShoppingBag className="icon" /> 
            {/* Shop */}
          </a>
        </li>
        </Link> 
        <li>
          <a
            href="#account"
            onClick={() => handleActiveLink('account')}
            className={activeLink === 'account' ? 'active' : ''}
          >
          <div className="user-profile">
            {authToken ? (
              <div className="dropdown-container">
                <Link to="/myaccount"><User className="icon"/></Link>
              </div>
            ) : (
              <User className="icon" onClick={() => setShowLogin(true)} />
            )}
          </div>             
          </a>
        </li>
        <Link to="/cart" className="cart-link">
      <li>
        <a
          href="#cart"
          onClick={() => handleActiveLink('cart')}
          className={activeLink === 'cart' ? 'active' : ''}
        >
           
          <ShoppingCart className="icon" />
          {/* Cart */}
          {itemCount > 0 && <span className="cart-Count">{itemCount}</span>} {/* Cart count */}
        </a>
      </li>
    </Link>
      </ul>
    </div>
  );
};

export default BottomBar;
