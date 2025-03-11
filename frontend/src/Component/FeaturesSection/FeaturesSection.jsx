import React from "react";
import "./FeaturesSection.css"; // Create a CSS file for styling

const features = [
  {
    icon: "fa-solid fa-shield-alt", // FontAwesome icon class
    title: "Secure payment",
    description: "by all payment method",
  },
  {
    icon: "fa-solid fa-lightbulb", // FontAwesome icon class
    title: "Budget friendly",
    description: "for All occasions",
  },
  {
    icon: "fa-solid fa-circle-question", // FontAwesome icon class
    title: "Have question to ask",
    description: "contact us",
  },
  {
    icon: "fa-solid fa-box", // FontAwesome icon class
    title: "World wide delivery",
    description: "provided",
  },
];

const FeaturesSection = () => {
  return (
    <div className="features-section">
      {features.map((feature, index) => (
        <div key={index} className="feature-item">
          <div className="icon">
            <i className={feature.icon}></i> {/* Render FontAwesome icon */}
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturesSection;
