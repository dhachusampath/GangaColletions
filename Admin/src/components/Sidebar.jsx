import React, { useState } from 'react';
import { HouseSimple, User, CalendarBlank, ChartBar, FileText, Gear, Info, SignOut } from 'phosphor-react';
import { useStore } from './Context/Store';


const Sidebar = ({ onMenuClick, role ,setUser }) => {
  const [isActive, setIsActive] = useState(false);
  const [activeMenu, setActiveMenu] = useState('');
  const {handleLogout}= useStore();
  const toggleSidebar = () => {
    setIsActive(!isActive);
  };
 
  const handleMenuItemClick = (menu) => {
    if (menu === 'dashboard') {
      setActiveMenu('dashboard');
      onMenuClick('dashboard');
    } else {
      setActiveMenu(menu === activeMenu ? '' : menu);
      onMenuClick(menu);
    }
  };

  return (
    <div className={`sidebar ${isActive ? 'active' : ''}`}>
      <div className="menu-btn" onClick={toggleSidebar}>
        <i className={`ph-bold ${isActive ? 'ph-caret-right' : 'ph-caret-left'}`}></i>
      </div>
      <div className="head">
        <div className="user-img">
          <img src="https://static.vecteezy.com/system/resources/previews/019/879/186/large_2x/user-icon-on-transparent-background-free-png.png" alt="" />
        </div>
        <div className="user-details">
          <p className="title">Ganga Collection</p>
          {/* <p className="name">Admin :Name</p> */}
        </div>
      </div>
      <div className="nav">
        <div className="menu">
          <p className="title">Main</p>
          <ul>
            <li className={activeMenu === 'dashboard' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuItemClick('dashboard')}>
                <i className="icon ph-bold ph-house-simple"></i>
                <span className="text">Dashboard</span>
              </a>
            </li>
            
            {/* Conditionally render Product Management based on role */}
            {role === 'Admin' || role === 'Manager' ? (
              <li className={activeMenu === 'viewers' ? 'active' : ''}>
                <a href="#" onClick={() => handleMenuItemClick('viewers')}>
                  <i className="icon ph-bold ph-user"></i>
                  <span className="text">Product Management</span>
                  <i className="arrow ph-bold ph-caret-down"></i>
                </a>
                <ul className="sub-menu" style={{ display: activeMenu === 'viewers' ? 'block' : 'none' }}>
                  <li className={activeMenu === 'Addnewproduct' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('Addnewproduct')}>
                      <span className="text">Add New Product</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'Productlist' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('Productlist')}>
                      <span className="text">Product List</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'popularproducts' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('popularproducts')}>
                      <span className="text">Popular Product</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'Bulkaction' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('Bulkaction')}>
                      <span className="text">Bulk Actions</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'BarcodeGenerate' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('BarcodeGenerate')}>
                      <span className="text">Bar Code Generator</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'CouponGenerate' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('CouponGenerate')}>
                      <span className="text">Coupon Code Generator</span>
                    </a>
                  </li>
                </ul>
              </li>
            ) : null}

            {/* Conditionally render Inventory based on role */}
            {role === 'Admin' || role === 'Manager' ? (
              <li className={activeMenu === 'agenda' ? 'active' : ''}>
                <a href="#" onClick={() => handleMenuItemClick('agenda')}>
                  <i className="icon ph-bold ph-calendar-blank"></i>
                  <span className="text">Inventory</span>
                  <i className="arrow ph-bold ph-caret-down"></i>
                </a>
                <ul className="sub-menu" style={{ display: activeMenu === 'agenda' ? 'block' : 'none' }}>
                  <li className={activeMenu === 'StockControl' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('StockControl')}>
                      <span className="text">Stock Control</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'inventoryControl' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('inventoryControl')}>
                      <span className="text">Inventory Report</span>
                    </a>
                  </li>
                </ul>
              </li>
            ) : null}

            {/* Orders Management (only for Admin/Manager roles) */}
            {role === 'Admin' || role === 'Manager' ? (
              <li className={activeMenu === 'revenue' ? 'active' : ''}>
                <a href="#" onClick={() => handleMenuItemClick('revenue')}>
                  <i className="icon ph-bold ph-chart-bar"></i>
                  <span className="text">Orders Management</span>
                  <i className="arrow ph-bold ph-caret-down"></i>
                </a>
                <ul className="sub-menu" style={{ display: activeMenu === 'revenue' ? 'block' : 'none' }}>
                  <li className={activeMenu === 'allorders' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('allorders')}>
                      <span className="text">Online All Orders</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'Bill_Orders' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('Bill_Orders')}>
                      <span className="text">Offline Bill Orders</span>
                    </a>
                  </li>
                </ul>
              </li>
            ) : null}

            {/* Users menu (Admin only) */}
            {role === 'Admin' ? (
              <li className={activeMenu === 'articles' ? 'active' : ''}>
                 <a href="#" onClick={() => handleMenuItemClick('articles')}>
  <i className="icon ph-bold ph-users"></i>
  <span className="text">Users</span>
  <i className="arrow ph-bold ph-caret-down"></i>
                  </a>

                <ul className="sub-menu" style={{ display: activeMenu === 'articles' ? 'block' : 'none' }}>
                  <li className={activeMenu === 'userlist' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('userlist')}>
                      <span className="text">User List</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'userroleupdate' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('userroleupdate')}>
                      <span className="text">User Role Action</span>
                    </a>
                  </li>
                  <li className={activeMenu === 'reviewlist' ? 'active' : ''}>
                    <a href="#" onClick={() => handleMenuItemClick('reviewlist')}>
                      <span className="text">User Review Management</span>
                    </a>
                  </li>
                </ul>
              </li>
            ) : null}

            {/* Billing (visible for all roles) */}
            <li className={activeMenu === 'billing' ? 'active' : ''}>
            <a href="#" onClick={() => handleMenuItemClick('billing')}>
  <i className="icon ph-bold ph-credit-card"></i>
  <span className="text">Billing</span>
</a>

            </li>
          </ul>
        </div>

        {/* <div className="menu">
          <p className="title">Settings</p>
          <ul>
            <li className={activeMenu === 'settings' ? 'active' : ''}>
              <a href="#" onClick={() => handleMenuItemClick('settings')}>
                <i className="icon ph-bold ph-gear"></i>
                <span className="text">Settings</span>
              </a>
            </li>
          </ul>
        </div> */}
      <div className="menu">
        <p className="title">Account</p>
        <ul>
          <li className={activeMenu === 'faq' ? 'active' : ''}>
            <a href="#" onClick={() => handleMenuItemClick('faq')}>
              <i className="icon ph-bold ph-info"></i>
              <span className="text">FAQ</span>
            </a>
          </li>
          <li  className={activeMenu === 'logout' ? 'active' : ''}>
            <a href="#" onClick={handleLogout}>
              <i className="icon ph-bold ph-sign-out"></i>
              <span className="text">Logout</span>
            </a>
          </li>
        </ul>
      </div>
      </div>

    </div>
  );
};

export default Sidebar;
