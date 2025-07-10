import React, { useEffect, useState } from "react";
import "./ProductDetail.css";
import { ZoomIn, ZoomOut, XCircle, ArrowLeft, ArrowRight } from "react-feather";
import { useParams } from "react-router-dom";
import { useStore } from "../Context/Store";
import ReviewSection from "../ReviewSection/ReviewSection";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProductDetail = () => {
  const { products, userRole, addToCart, API_BASE_URL } = useStore();
  const { productId } = useParams();
  const product = products.find((prod) => prod._id === productId);

  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [magnifyStyle, setMagnifyStyle] = useState({});
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedTab, setSelectedTab] = useState("details");
  const [selectedSize, setSelectedSize] = useState("");
  const [currentPrice, setCurrentPrice] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [dropdownTouched, setDropdownTouched] = useState(false);

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
    setDropdownTouched(true);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (selectedSize) {
      const sizeDetails = product?.sizes.find(
        (size) => size.size === selectedSize
      );
      if (sizeDetails) {
        setCurrentPrice(
          userRole === "wholesaler"
            ? sizeDetails.wholesalePrice
            : sizeDetails.retailPrice
        );
        setSelectedStock(sizeDetails.stock);
      }
    } else {
      setCurrentPrice(null);
      setSelectedStock(null);
    }
  }, [selectedSize, product?.sizes, userRole]);

  const renderTabContent = () => {
    if (selectedTab === "details") {
      return (
        <div className="tab-content">
          <h3>Additional Details</h3>
          <ul className="details-grid">
            <li>
              <strong>Polish:</strong> {product?.polish}
            </li>
            {product?.sizes && product?.sizes.length > 0 && (
              <li>
                <strong>Available Sizes:</strong>{" "}
                {product?.sizes.map((size) => size.size).join(", ")}
              </li>
            )}
          </ul>
        </div>
      );
    } else if (selectedTab === "reviews") {
      return (
        <div className="review-form-container">
          <h3>Reviews</h3>
          <ReviewSection productId={productId} />
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
    const prevIndex =
      (currentIndex - 1 + product?.images.length) % product?.images.length;
    setSelectedImage(product?.images[prevIndex]);
  };

  const handleAddToCart = () => {
    if (product?.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        toast.error("Please select a variant before adding to cart", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          style: {
            fontSize: "14px",
            fontWeight: "500",
          },
        });
        return;
      }

      if (selectedStock === 0) {
        toast.error("This variant is currently out of stock", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
    }

    addToCart(product, selectedSize, currentPrice);
    toast.success("Item added to cart successfully!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  return (
    <>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="product-detail-container">
        <div className="image-container">
          <div
            className="main-image"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={`${API_BASE_URL}/images/${selectedImage}`}
              alt="Main Product"
              style={magnifyStyle}
              onClick={() => openFullScreen(selectedImage)}
            />
          </div>
          <div className="thumbnail-container">
            {product?.images?.map((img, index) => (
              <img
                key={index}
                src={`${API_BASE_URL}/images/${img}`}
                alt={`Thumbnail ${index + 1}`}
                className={`thumbnail ${img === selectedImage ? "selected" : ""}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="details-container">
          <h2>{product?.name}</h2>
          {product?.itemcode && (
            <p>
              <strong>ItemCode : </strong>
              {product.itemcode}
            </p>
          )}
          <p className="description">{product?.description}</p>
          <p>
            <strong>Polish:</strong> {product?.polish}
          </p>

          {product?.sizes && product.sizes.length > 0 && (
            <label>
              <strong>Select Variant:</strong>
              <select
                value={selectedSize}
                onChange={handleSizeChange}
                onClick={() => setDropdownTouched(true)}
                className="size-dropdown"
              >
                <option value="">Select any Variant</option>
                {product.sizes.map((size) => (
                  <option
                    key={size.size}
                    value={size.size}
                    disabled={size.stock === 0}
                  >
                    {size.size} {size.stock === 0 ? "(Out of Stock)" : ""}
                  </option>
                ))}
              </select>
            </label>
          )}

          {currentPrice !== null ? (
            <p className="price">₹{currentPrice.toFixed(2)}</p>
          ) : (
            <p className="price-hint">Select a size to see the price</p>
          )}

          <button
            className={`add-to-cart-button ${
              (!selectedSize && dropdownTouched) || selectedStock === 0 ? "invalid" : ""
            }`}
            onClick={handleAddToCart}
            disabled={selectedStock === 0}
          >
            {!selectedSize
              ? "Add to Cart"
              : selectedStock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </button>
        </div>

        {isFullScreen && (
          <div className="fullscreen-overlay" onClick={closeFullScreen}>
            <div
              className="fullscreen-content"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={`${API_BASE_URL}/images/${selectedImage}`}
                alt="Fullscreen"
                style={{ transform: `scale(${zoom})` }}
              />
              <div className="zoom-controls">
                <button onClick={goToPrevImage}>
                  <ArrowLeft className="icon" />
                </button>
                <button onClick={zoomIn}>
                  <ZoomIn className="icon" />
                </button>
                <button onClick={zoomOut}>
                  <ZoomOut className="icon" />
                </button>
                <button onClick={goToNextImage}>
                  <ArrowRight className="icon" />
                </button>
                <button onClick={closeFullScreen}>
                  <XCircle className="icon" />
                </button>
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