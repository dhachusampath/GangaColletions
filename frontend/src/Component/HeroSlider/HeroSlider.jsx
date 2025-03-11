import React, { useState, useEffect, useRef } from "react";
import "./HeroSlider.css";

const HeroSlider = () => {
  // State to manage the active slide
  const [currentIndex, setCurrentIndex] = useState(0);

  // Images for the mobile slider
  const images = [
    "https://placehold.co/200x200",
    "https://placehold.co/200x200",
    "https://placehold.co/200x200",
  ];

  // Refs for touch events
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Function to go to the next slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Handle touch start event
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // Handle touch move event (to track movement)
  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  // Handle touch end event (to detect swipe)
  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left to go to next slide
      nextSlide();
    } else if (touchEndX.current - touchStartX.current > 50) {
      // Swipe right to go to previous slide
      prevSlide();
    }
  };

  // Autoplay functionality (change slide every 5 seconds)
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // 5 seconds autoplay
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div className="banner">
      {/* Desktop Banner */}
      <div className="desktop-banner">
        <img
          src="https://www.shrishtijewels.in/cdn/shop/files/webbanner.jpg?v=1709377138&width=2000"
          alt="Laptop Banner"
          className="desktop-banner-image"
        />
      </div>

      {/* Mobile/Tablet View */}
      <div
        className="mobile-banner"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Slide images */}
        <div className="mobile-slide-wrapper">
          <img
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="mobile-slide-image"
          />
        </div>

        {/* Navigation buttons */}
        <button className="prev-btn" onClick={prevSlide}>
          &#10094;
        </button>
        <button className="next-btn" onClick={nextSlide}>
          &#10095;
        </button>
      </div>
    </div>
  );
};

export default HeroSlider;
