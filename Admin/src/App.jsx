import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar'; 
import ProductManagement from './components/ProductManagement/ProductManagement';
import BulkAction from './components/BulkAction/BulkAction';
import ProductList from './components/ProductList/ProductList';
import StockControl from './components/StockControl/StockControl';
import InventoryControl from './components/InventoryControl/InventoryControl';
import Dashboard from './components/Dashboard/Dashboard';
import AllOrders from './components/AllOrders/AllOrders';
import UserList from './components/UserList/UserList';
import UserRoleUpdate from './components/UserList/UserRoleUpdate';
import BillingSystem from './components/BillingSystem/BillingSystem';
import FAQ from './components/FAQ/FAQ';
import Login from './components/Login/Login';
import BarcodeScanner from './components/BarcodeGenerator/BarcodeScanner';
import CouponGenerator from './components/CouponGenerator/CouponGenerator';
import { useStore } from './components/Context/Store';
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';
import ReviewsList from './components/Reviews/ReviewsList';
import ManagePopularProducts from './components/PopularProducts/ManagePopularProducts';
import BillingOrdersAdmin from './components/BillingOrdersAdmin/BillingOrdersAdmin';
import axios from 'axios';

const App = () => {
  const [activeContent, setActiveContent] = useState('dashboard');
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useStore();

  // Function to check backend connection
  const checkBackendConnection = async () => {
    try {
      const response = await axios.get(`https://gangacollection-backend.onrender.com/api/health`);
      if (response.status === 200) {
        setIsBackendConnected(true);
      }
    } catch (error) {
      console.error('Backend is not connected:', error);
      setIsBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const handleMenuClick = (menu) => {
    setActiveContent(menu);
  };

  return (
    <div className="app">
      <Router>
        {loading ? (
          <div className="loading-screen">Checking backend connection...</div>
        ) : !isBackendConnected ? (
<div className="error-screen"> Backend is not connected. Please contact your admin.</div>
        ) : !user ? (
          <Login setUser={setUser} />
        ) : (
          <>
            <Sidebar onMenuClick={handleMenuClick} role={user.role} setUser={setUser} />
            <div className="main-content">
                {activeContent === 'dashboard' && <Dashboard />}
                {activeContent === 'Addnewproduct' && user.role === 'Admin' && <ProductManagement />}
                {activeContent === 'Bulkaction' && <BulkAction />}
                {activeContent === 'Productlist' && <ProductList />}
                {activeContent === 'StockControl' && <StockControl />}
                {activeContent === 'inventoryControl' && <InventoryControl />}
                {activeContent === 'allorders' && <AllOrders />}
                {activeContent === 'userlist' && user.role === 'Admin' && <UserList />}
                {activeContent === 'userroleupdate' && user.role === 'Admin' && <UserRoleUpdate />}
                {activeContent === 'billing' && <BillingSystem />}
                {activeContent === 'faq' && <FAQ />}
                {activeContent === 'BarcodeGenerate' && <BarcodeScanner />}
                {activeContent === 'CouponGenerate' && <CouponGenerator />}
                {activeContent === 'reviewlist' && <ReviewsList />}
                {activeContent === 'popularproducts' && <ManagePopularProducts />}
                {activeContent === 'Bill_Orders' && <BillingOrdersAdmin />}
              <ScrollToTopButton/>
              </div>
          </>
        )}
      </Router>
    </div>
  );
};

export default App;

