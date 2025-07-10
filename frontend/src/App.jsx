import React, { useState, useEffect, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import Loader from "./Component/Loader/Loader";
import OrderFailure from "./Component/OrderConfirmation/OrderFailure";

// Lazy components
const Header = lazy(() => import("./Component/Header/Header"));
const Home = lazy(() => import("./Component/Pages/Home"));
const Footer = lazy(() => import("./Component/Footer/Footer"));
const BottomBar = lazy(() => import("./Component/BottomBar/BottomBar"));
const AuthPage = lazy(() => import("./Component/LoginSignup/AuthPage"));
const Menu = lazy(() => import("./Component/Menu/Menu"));
const ProductDetail = lazy(() =>
  import("./Component/ProductDetail/ProductDetail")
);
const Cart = lazy(() => import("./Component/Cart/Cart"));
const Checkout = lazy(() => import("./Component/Checkout/Checkout"));
const OrderConfirmation = lazy(() =>
  import("./Component/OrderConfirmation/OrderConfirmation")
);
const MyAccountPage = lazy(() => import("./Component/Myaccount/MyAccountPage"));
const Contact = lazy(() => import("./Component/Contact/Contact"));
const AboutUs = lazy(() => import("./Component/Pages/AboutUs"));
const FAQ = lazy(() => import("./Component/FAQ/FAQ"));
const TermsAndConditions = lazy(() =>
  import("./Component/Pages/TermsAndConditions")
);
const PrivacyPolicy = lazy(() => import("./Component/Pages/PrivacyPolicy"));
const ReturnReplacementPolicy = lazy(() =>
  import("./Component/Pages/ReturnReplacementPolicy")
);

const AppContent = () => {
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const isFirstTime = sessionStorage.getItem("logoLoaderShown");

    if (location.pathname === "/" && !isFirstTime) {
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
        sessionStorage.setItem("logoLoaderShown", "true");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const userId = urlParams.get("userId");

    if (token && userId) {
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      window.location.href = "/";
    }
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Suspense fallback={<></>}>
      <>
        <Header setShowLogin={setShowLogin} />
        {showLogin && <AuthPage setShowLogin={setShowLogin} />}
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
          <Route
            path="/terms-and-conditions"
            element={<TermsAndConditions />}
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route
            path="/return-and-replacement-policy"
            element={<ReturnReplacementPolicy />}
          />
          <Route path="/order-failure" element={<OrderFailure />} />
        </Routes>
        <Footer />
        <BottomBar setShowLogin={setShowLogin} />
      </>
    </Suspense>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
