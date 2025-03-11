import React, { useState } from "react";
import "./MyAccountPage.css";
import OrderHistory from "../OrderHistory/OrderHistory";
import ProfilePage from "../ProfilePage/ProfilePage";

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfilePage setActiveTab={setActiveTab} />;
      case "orders":
        return <OrderHistory />;
      default:
        return <OrderHistory />;
    }
  };

  return (
    <div className="account-page-container">
      <div className="account-sidebar">
        <h2 className="account-title">My Account</h2>
        <ul className="account-nav">
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </li>
          <li
            className={activeTab === "orders" ? "active" : ""}
            onClick={() => setActiveTab("orders")}
          >
            Order History
          </li>
        </ul>
      </div>
      <div className="account-content">{renderContent()}</div>
    </div>
  );
};

export default MyAccountPage;
