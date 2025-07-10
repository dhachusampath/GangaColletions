import React, { useRef, useState, useEffect } from "react";
import "./PopularProducts.css";
import { useStore } from "../Context/Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PopularProducts = () => {
  const sliderRef = useRef(null);
  const { API_BASE_URL, userRole, addToCart } = useStore();
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const autoScrollInterval = useRef(null);
  const navigate = useNavigate();
  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products/popular`);
      if(response.data && Array.isArray(response.data)){
 setProducts(response.data);
      }
      else{
        console.error("Unexpected response format",response.data);
        setProducts([]);
      }
     
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].offsetWidth;
      sliderRef.current.scrollBy({ left: -slideWidth, behavior: "smooth" });
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    }
    stopAutoScroll();
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const slideWidth = sliderRef.current.children[0].offsetWidth;
      sliderRef.current.scrollBy({ left: slideWidth, behavior: "smooth" });
      setCurrentIndex((prev) => Math.min(products.length - 1, prev + 1));
    }
    stopAutoScroll();
  };

  const autoScroll = () => {
    autoScrollInterval.current = setInterval(() => {
      slideRight();
    }, 2000);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
      autoScrollInterval.current = null;
    }
  };

  const handleUserScroll = () => {
    stopAutoScroll();
  };

  useEffect(() => {
    if (products.length > 0) {
      autoScroll();
    }
    return () => stopAutoScroll();
  }, [products]);

  if (isLoading) {
    return (
      <div className="popular-products-section">
        <header className="Popular-categories-header">
          <h1>Popular Products</h1>
          <p>Explore our diverse range of top-rated products!</p>
        </header>
        <div className="loading-container">
          <div className="gold-spinner"></div>
          <p>Loading our finest products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="popular-products-section">
      <header className="Popular-categories-header">
        <h1>Popular Products</h1>
        <p>Explore our diverse range of top-rated products!</p>
      </header>
      <div className="slider-container">
        <button className="slider-button left" onClick={slideLeft}>
          &#8249;
        </button>
        <div
          className="slider-wrapper"
          ref={sliderRef}
          onScroll={handleUserScroll}
        >
          {products.map((product, index) => (
<div 
  key={product._id} 
  className="card"
  onClick={(e) => {
    // Only navigate if the click wasn't on the button or select dropdown
    if (!e.target.closest('.add-to-cart, .size-dropdown')) {
      navigate(`/product/${product._id}`);
    }
  }}
  style={{ cursor: 'pointer' }}
>              <img
    src={`${API_BASE_URL}/images/${product.images[0]}`}
    alt={product.name}
    className="card-image"
  />
<h3 className="card-name" title={product.name}>
  {product.name.length > 18 ? `${product.name.substring(0, 18)}...` : product.name}
</h3>              <p className="card-price">
                ₹
                {userRole === "retailer"
                  ? product.sizes[0].retailPrice
                  : product.sizes[0].wholesalePrice}
              </p>
              <label className="size-label" htmlFor={`size-select-${index}`}>
                Variants:
              </label>
              <select
                id={`size-select-${index}`}
                className="size-dropdown"
                defaultValue=""
              >
                <option value="" disabled>
                  Select
                </option>
                {product.sizes.map((size, idx) => (
                  <option key={idx} value={size.size}>
                    {size.size} - ₹
                    {userRole === "retailer"
                      ? size.retailPrice
                      : size.wholesalePrice}
                  </option>
                ))}
              </select>
              <button
                className="add-to-cart"
                onClick={() => {
                  const sizeDropdown = document.getElementById(
                    `size-select-${index}`
                  );
                  const selectedSize = sizeDropdown.value;
                  const currentPrice =
                    userRole === "retailer"
                      ? product.sizes.find((s) => s.size === selectedSize)
                          ?.retailPrice
                      : product.sizes.find((s) => s.size === selectedSize)
                          ?.wholesalePrice;
                  if (selectedSize && currentPrice) {
                    addToCart(product, selectedSize, currentPrice);
                  } else {
                    alert("Please select a size.");
                  }
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
        <button className="slider-button right" onClick={slideRight}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default PopularProducts;