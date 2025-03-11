import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import { ZoomIn, ZoomOut, XCircle, ArrowLeft, ArrowRight } from "react-feather";
import { useParams } from "react-router-dom";
import { useStore } from "../Context/Store";
import ReviewSection from "../ReviewSection/ReviewSection";

const ProductDetail = () => {
  const { products, userRole, addToCart,url } = useStore();
  const { productId } = useParams();  // The ID passed via URL is now the MongoDB _id
  const product = products.find((prod) => prod._id === productId);  // Search by _id

  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [magnifyStyle, setMagnifyStyle] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedTab, setSelectedTab] = useState("details"); 
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null); 
  const [selectedStock, setSelectedStock] = useState(null);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedSize) {
      const sizeDetails = product?.sizes.find(size => size.size === selectedSize);
      if (sizeDetails) {
        setCurrentPrice(userRole === "wholesaler" ? sizeDetails.wholesalePrice : sizeDetails.retailPrice);
      }
    } else {
      setCurrentPrice(null); // Reset price if no size is selected
    }
  }, [selectedSize, product?.sizes, userRole]); // Re-run effect on selectedSize or userRole change

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
  
    const sizeDetails = product?.sizes.find((s) => s.size === size);
    if (sizeDetails) {
      setCurrentPrice(userRole === "wholesaler" ? sizeDetails.wholesalePrice : sizeDetails.retailPrice);
      setSelectedStock(sizeDetails.stock); // Update stock availability
    } else {
      setCurrentPrice(null);
      setSelectedStock(null);
    }
  };
  

  const renderTabContent = () => {
    if (selectedTab === "details") {
      return (
        <div className="tab-content">
          <h3>Additional Details</h3>
          <ul className="details-grid">
            <li><strong>Polish:</strong> {product?.polish}</li>
            {product?.sizes && product?.sizes.length > 0 && (
              <li><strong>Available Sizes:</strong> {product?.sizes.map(size => size.size).join(", ")}</li>
            )}
          </ul>
        </div>
      );
    } else if (selectedTab === "reviews") {
      return (
        <div className="review-form-container">
          <h3>Reviews</h3>
          {/* <div className="no-reviews">
            <p><i className="fa-solid fa-info-circle"></i> There are no reviews yet.</p>
          </div> */}
          <ReviewSection productId={productId}/>
          {/* Add review form here */}
        </div>
      );
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMagnifyStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseLeave = () => {
    setMagnifyStyle({ transform: "scale(1)" });
  };

  const openFullScreen = (img) => {
    setSelectedImage(img);
    setIsFullScreen(true);
    setZoom(1);
  };

  const closeFullScreen = () => {
    setIsFullScreen(false);
  };

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.2);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => (prevZoom > 1 ? prevZoom - 0.2 : 1));
  };

  const goToNextImage = () => {
    const currentIndex = product?.images.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % product?.images.length;
    setSelectedImage(product?.images[nextIndex]);
  };

  const goToPrevImage = () => {
    const currentIndex = product?.images.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + product?.images.length) % product?.images.length;
    setSelectedImage(product?.images[prevIndex]);
  };

  const handleAddToCart = () => {
    if (product?.sizes && product?.sizes.length > 0 && !selectedSize) {
      alert("Please select a size before adding to the cart.");
      return;
    }
    addToCart(product, selectedSize, currentPrice);
  };
    
  return (
    <>
      <div className="product-detail-container">
        {/* Left Side: Image */}
        <div className="image-container">
  <div
    className="main-image"
    onMouseMove={handleMouseMove}
    onMouseLeave={handleMouseLeave}
  >
    <img
      src={`${url}/images/${selectedImage}`}  // Update the image URL
      alt="Main Product"
      style={magnifyStyle}
      onClick={() => openFullScreen(selectedImage)}
    />
  </div>
  <div className="thumbnail-container">
    {product.images.map((img, index) => (
      <img
        key={index}
        src={`${url}/images/${img}`}  // Update the image URL for thumbnails
        alt={`Thumbnail ${index + 1}`}
        className={`thumbnail ${img === selectedImage ? "selected" : ""}`}
        onClick={() => setSelectedImage(img)}
      />
    ))}
  </div>
</div>


        {/* Right Side: Product Details */}
        <div className="details-container">
      <h2>{product.name}</h2>
      <p className="description">{product.description}</p>
      <p><strong>Polish:</strong> {product.polish}</p>
      
      {product.sizes && product.sizes.length > 0 && (
        <label>
          <strong>Select Variant:</strong>
          <select value={selectedSize} onChange={handleSizeChange} className="size-dropdown">
  <option value="">Select any Variant</option>
  {product.sizes.map((size) => (
    <option key={size.size} value={size.size} disabled={size.stock === 0}>
      {size.size} {size.stock === 0 ? "(Out of Stock)" : ""}
    </option>
  ))}
</select>

        </label>
      )}

      {/* Display current price based on selected size and user role */}
      {currentPrice !== null ? (
        <p className="price">₹{currentPrice.toFixed(2)}</p>
      ) : (
        <p className="price">Select a size to see the price</p>
      )}
      
      <button 
  className="add-to-cart-button" 
  onClick={handleAddToCart} 
  disabled={!selectedSize || selectedStock === 0}
>
  {selectedStock === 0 ? "Out of Stock" : "Add to Cart"}
</button>

    </div>

        {/* Fullscreen Modal */}
        {isFullScreen && (
          <div className="fullscreen-overlay" onClick={closeFullScreen}>
            <div className="fullscreen-content" onClick={(e) => e.stopPropagation()}>
              <img
                src={`${url}/images/${selectedImage}`}
                alt="Fullscreen"
                style={{ transform: `scale(${zoom})` }}
              />
              <div className="zoom-controls">
                <button onClick={goToPrevImage}>
                  <ArrowLeft className="icon" />
                </button>
                <button onClick={zoomIn}><ZoomIn className="icon" /></button>
                <button onClick={zoomOut}><ZoomOut className="icon" /></button>
                <button onClick={goToNextImage}>
                  <ArrowRight className="icon" />
                </button>
                <button onClick={closeFullScreen}><XCircle className="icon" /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${selectedTab === "details" ? "active" : ""}`}
          onClick={() => setSelectedTab("details")}
        >
          Additional Details
        </button>
        <button
          className={`tab-button ${selectedTab === "reviews" ? "active" : ""}`}
          onClick={() => setSelectedTab("reviews")}
        >
          Reviews
        </button>
      </div>
      {renderTabContent()}
    </>
  );
};

export default ProductDetail;
