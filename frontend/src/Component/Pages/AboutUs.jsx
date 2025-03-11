import React, { useEffect } from "react";
import "./AboutUs.css";

const AboutUs = () => {
      useEffect(() => {
            // Scroll to the top of the page
            window.scrollTo(0, 0);
          }, []); // Empty dependency array ensures this runs only once when the component mounts
  return (
    <div className="about-us-container">
      <div className="about-banner">
        <h1>About Us</h1>
        <p>Crafting timeless elegance for generations.</p>
      </div>
      <div className="about-content">
        <div className="about-section">
          <h2>Our Story</h2>
          <p>
            Founded with passion and a deep appreciation for craftsmanship, we
            have been creating exquisite jewelry pieces that tell unique stories
            since [Insert Year]. Every piece is a testament to our commitment to
            quality and beauty.
          </p>
        </div>
        <div className="about-section">
          <h2>Our Craftsmanship</h2>
          <p>
            Our skilled artisans pour their heart and soul into every design,
            blending traditional techniques with modern artistry. Each piece is
            meticulously crafted to reflect the brilliance and elegance of the
            person who wears it.
          </p>
        </div>
        <div className="about-gallery">
          <div className="gallery-item">
            <img src="https://i.pinimg.com/736x/a7/65/73/a7657363420b8256bec77c049a74a84b.jpg" alt="Crafting Jewelry" />
            <p>Handcrafted with precision</p>
          </div>
          <div className="gallery-item">
            <img src="https://i.pinimg.com/736x/6c/c0/39/6cc0399395bd5a46dd84fbe38057be54.jpg" alt="Jewelry Design" />
            <p>Designs that inspire</p>
          </div>
          <div className="gallery-item">
            <img src="https://i.pinimg.com/736x/e2/d4/70/e2d47084ceb5d91b735f06c3aef29f79.jpg" alt="Timeless Elegance" />
            <p>Timeless elegance</p>
          </div>
        </div>
        <div className="about-section">
          <h2>Our Vision</h2>
          <p>
            We aim to be more than a jewelry brand. Our mission is to create
            cherished memories and moments of joy through our designs. With an
            unwavering focus on quality, we strive to bring a sparkle to your
            life.
          </p>
        </div>
        <div className="about-cta">
          <h3>Discover the Difference</h3>
          <p>
            Explore our collection and become a part of our story. Let us create
            something beautiful together.
          </p>
          <button>Shop Now</button>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
