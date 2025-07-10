import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Menu.css";
import { useStore } from "../Context/Store";

const Menu = () => {
  const { products, userRole, categories, API_BASE_URL } = useStore(); // Access global state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [price, setPrice] = useState([100, 12000]);
  const [openCategory, setOpenCategory] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (location.state?.filter) {
      const filter = location.state.filter;
      const parentCategory = location.state.parentCategory || null;

      if (categories.some((cat) => cat.name === filter)) {
        setSelectedCategory(filter);
        setSelectedSubCategory(""); // Reset subcategory
      } else {
        setSelectedCategory(parentCategory); // Set the parent category
        setSelectedSubCategory(filter); // Set the subcategory
      }
    }
  }, [location, categories]);

  const handlePriceChange = (e, index) => {
    const newPrice = [...price];
    newPrice[index] = parseInt(e.target.value);
    setPrice(newPrice);
  };

  const filteredProducts = products.filter((product) => {
    // console.log("Filtering product:", product);
    const isCategoryMatch =
      selectedCategory === "All" || product.category === selectedCategory;

    // If no subcategory is selected or the subcategory is null, we ignore it in the filtering
    const isSubCategoryMatch =
      !selectedSubCategory || product.subcategory === selectedSubCategory;

    // Ensure product has sizes and select the appropriate price
    const productSize =
      product.sizes && product.sizes.length > 0 ? product.sizes[0] : null; // Check if sizes exist and are non-empty
    const productPrice = productSize
      ? userRole === "wholesaler"
        ? productSize.wholesalePrice
        : productSize.retailPrice
      : 0; // Fallback if no sizes or prices available

    const isPriceMatch = productPrice >= price[0] && productPrice <= price[1];

    return isCategoryMatch && isSubCategoryMatch && isPriceMatch;
  });

  // console.log("Filtered products:", filteredProducts);

  const toggleCategory = (categoryName) => {
    setOpenCategory((prev) => (prev === categoryName ? null : categoryName));
  };

  const handleCategoryClick = (category) => {
    // console.log("Category clicked:", category);
    setSelectedCategory(category);
    setSelectedSubCategory(""); // Reset subcategory on category click
    navigate("/menu", { state: { filter: category } });
  };

  const handleSubcategoryClick = (subcategory) => {
    console.log("Subcategory clicked:", subcategory); // Debugging: Log selected subcategory
    setSelectedSubCategory(subcategory);
    navigate("/menu", { state: { filter: subcategory } });
  };

  const handleProductClick = (productId) => {
    // console.log("Product clicked:", productId);
    // Navigate to the product detail page
    navigate(`/product/${productId}`);
  };

  return (
    <div className="container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="sidebar-title">Filter by Category</h2>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.name}>
              <div
                className={`category-item ${
                  selectedCategory === category.name ? "active" : ""
                }`}
                onClick={() => handleCategoryClick(category.name)}
              >
                <span>{category.name}</span>
                {category.subcategories.length > 0 && (
                  <button
                    className="dropdown-toggle"
                    onClick={() => toggleCategory(category.name)}
                  >
                    {openCategory === category.name ? "-" : "+"}
                  </button>
                )}
              </div>
              {/* Subcategories */}
              {openCategory === category.name && (
                <ul className="subcategory-list">
                  {category.subcategories.map((subcat) => (
                    <li
                      key={subcat}
                      className={`subcategory-item ${
                        selectedSubCategory === subcat ? "active" : ""
                      }`}
                      onClick={() => handleSubcategoryClick(subcat)}
                    >
                      {subcat}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>

        {/* Price Filter */}
        <div className="price-filter">
          <h3>Filter by Price</h3>
          <div className="price-slider">
            <input
              type="range"
              min="100"
              max="12000"
              value={price[0]}
              onChange={(e) => handlePriceChange(e, 0)}
            />
            <input
              type="range"
              min="100"
              max="12000"
              value={price[1]}
              onChange={(e) => handlePriceChange(e, 1)}
            />
          </div>
          <div className="price-values">
            <span>Min: ₹{price[0]}</span>
            <span>Max: ₹{price[1]}</span>
          </div>
        </div>

        {/* Reset Button */}
        <button
          className="reset-button"
          onClick={() => {
            setSelectedCategory("All");
            setSelectedSubCategory("");
            setPrice([100, 12000]);
            setOpenCategory(null); // Close any open dropdown
            navigate("/menu", { state: { filter: "All" } });
          }}
        >
          Reset Filters
        </button>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <h1 className="title">EXPLORE THE COLLECTION</h1>
        <div className="products">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <img
                src={`${API_BASE_URL}/images/${product.images[0]}`}
                alt={product.name}
                className="product-image"
              />
              <h3 className="product-name">{product.name}</h3>
              <p className="Product-price">
                {product.sizes && product.sizes.length > 0
                  ? userRole === "wholesaler"
                    ? `₹${product.sizes[0].wholesalePrice.toFixed(2)}`
                    : `₹${product.sizes[0].retailPrice.toFixed(2)}`
                  : "Price not available"}
              </p>
              <button
                onClick={() => handleProductClick(product._id)}
                className="view-button"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
