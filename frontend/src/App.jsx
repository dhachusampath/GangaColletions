import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Loader from './Component/Loader/Loader'; // Loader shown while lazy components load
import { useStore } from './Component/Context/Store';
import OrderFailure from './Component/OrderConfirmation/OrderFailure';
// import ContactButton from './Component/ContactButton/ContactButton';


// Lazy load components
const Header = lazy(() => import('./Component/Header/Header'));
const Home = lazy(() => import('./Component/Pages/Home'));
const Footer = lazy(() => import('./Component/Footer/Footer'));
const BottomBar = lazy(() => import('./Component/BottomBar/BottomBar'));
const AuthPage = lazy(() => import('./Component/LoginSignup/AuthPage'));
const Menu = lazy(() => import('./Component/Menu/Menu'));
const ProductDetail = lazy(() => import('./Component/ProductDetail/ProductDetail'));
const Cart = lazy(() => import('./Component/Cart/Cart'));
const Checkout = lazy(() => import('./Component/Checkout/Checkout'));
const OrderConfirmation = lazy(() => import('./Component/OrderConfirmation/OrderConfirmation'));
const MyAccountPage = lazy(() => import('./Component/Myaccount/MyAccountPage'));
const Contact = lazy(() => import('./Component/Contact/Contact'));
const AboutUs = React.lazy(() => import('./Component/Pages/AboutUs'));
const FAQ = React.lazy(() => import('./Component/FAQ/FAQ'));
const TermsAndConditions = React.lazy(() => import('./Component/Pages/TermsAndConditions'));
const PrivacyPolicy = React.lazy(() => import('./Component/Pages/PrivacyPolicy'));
const ReturnReplacementPolicy = React.lazy(() => import('./Component/Pages/ReturnReplacementPolicy'));

const App = () => {
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  // const { setAuthToken, setUserId } = useStore();
  
  useEffect(() => {
    // Simulate image loading completion or any necessary delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000); // Adjust this time depending on how long your images take to load

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, []);
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
      const userId = urlParams.get("userId");
    
      if (token && userId) {
        // Store token and userId in local storage
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        window.location.href = "/"; // Example redirection
  
      }
    }, []);
  return (
    <Router>
      {loading ? (
        <Loader /> // Display loader animation while initial loading is in progress
      ) : (
        <Suspense fallback={<Loader />}>
          <>
            <Header setShowLogin={setShowLogin} />
            {showLogin && <AuthPage path="/login"setShowLogin={setShowLogin} />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart setShowLogin={setShowLogin} />} />
              <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/myaccount" element={<MyAccountPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/frequently-asked-questions" element={<FAQ />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/return-and-replacement-policy" element={<ReturnReplacementPolicy />} />
        <Route path="/order-failure" element={<OrderFailure />} />
              </Routes>
            <Footer />
            {/* <ContactButton/> */}
            <BottomBar setShowLogin={ setShowLogin }/>
          </>
        </Suspense>
      )}
    </Router>
  );
};

export default App;
