import React, { useEffect, useRef, useState } from "react";
import "./CategoriesPage.css";

const categories = [
  { id: 1, name: "Mugappu Thali Chains", image: "https://www.shrishtijewels.in/cdn/shop/files/img_2337.jpg?v=1730994924" },
  { id: 2, name: "Impon Jewelleries", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_7998.jpg?v=1731086540" },
  { id: 3, name: "Necklace", image: "https://www.shrishtijewels.in/cdn/shop/files/img_2523.jpg?v=1730995009" },
  { id: 4, name: "Haram", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2628.jpg?v=1731086845" },
  { id: 5, name: "Combo Sets", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2629.jpg?v=1731086846" },
  { id: 6, name: "Daily Use Chains", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2634.jpg?v=1731086846" },
  { id: 7, name: "Forming Chains", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2635.jpg?v=1731087220" },
  { id: 8, name: "Bangles", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2630.jpg?v=1731086846" },
  { id: 9, name: "Earrings", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2632.jpg?v=1731086846" },
  { id: 10, name: "Anklets", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2631.jpg?v=1731086846" },
  { id: 11, name: "Maatal & Tikka", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2630.jpg?v=1731086846" },
  { id: 12, name: "Combo Offer Sets", image: "https://www.shrishtijewels.in/cdn/shop/files/IMG_2632.jpg?v=1731086846" }
];

const CategoriesPage = () => {
  const [inView, setInView] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const gridRef = useRef(null);
  const autoScrollTimeout = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.005 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, []);

  // Auto-scroll logic with pause on user scroll
  useEffect(() => {
    const gridElement = gridRef.current;

    if (!gridElement) return;

    const startAutoScroll = () => {
      autoScrollTimeout.current = setInterval(() => {
        gridElement.scrollBy({ top: 0, left: 1, behavior: "smooth" });

        if (gridElement.scrollLeft + gridElement.clientWidth >= gridElement.scrollWidth) {
          gridElement.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        }
      },30);
    };
    
    

    const stopAutoScroll = () => {
      clearInterval(autoScrollTimeout.current);
    };

    const handleUserScroll = () => {
      setIsUserScrolling(true);
      stopAutoScroll();

      // Resume auto-scroll after 2 seconds of inactivity
      clearTimeout(autoScrollTimeout.current);
      autoScrollTimeout.current = setTimeout(() => {
        setIsUserScrolling(false);
        startAutoScroll();
      }, 5500);
    };

    // Start auto-scroll
    startAutoScroll();

    // Listen for user interaction
    gridElement.addEventListener("scroll", handleUserScroll);

    return () => {
      stopAutoScroll();
      gridElement.removeEventListener("scroll", handleUserScroll);
    };
  }, []);

  return (
    <div className="categories-page">
      <header className="categories-header">
        <h1>Categories</h1>
        <p>500+ exclusive products</p>
      </header>
      <div ref={gridRef} className="categories-grid">
        {categories.map((category, index) => (
          <div
            key={category.id}
            className={`category-card ${inView ? (index < 5 ? "slide-right" : "slide-left") : "reverse-animation"}`}
          >
            <img src={category.image} alt={category.name} className="category-image" />
            <p className="category-name">{category.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
