import React, { useState, useEffect } from "react";
import { useStore } from "../Context/Store";
import "./ProductList.css";

const ProductList = () => {
  const { products, API_BASE_URL } = useStore();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
  });
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Function to handle product click (open the modal)
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedProduct(null);
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Function to handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Apply filters and search
  useEffect(() => {
    let filtered = [...products];

    if (filters.category) {
      filtered = filtered.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.subcategory) {
      filtered = filtered.filter(
        (product) => product.subcategory === filters.subcategory
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.itemcode.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
      );
    }

    setFilteredProducts(filtered);
  }, [filters, products, searchTerm]);

  // Function to reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      subcategory: "",
    });
    setSearchTerm("");
  };

  // Enhanced function to convert product data to CSV format
  const convertToCSV = (data) => {
    const header = [
      "Item Code",
      "Product Name",
      "Description",
      "Polish",
      "Category",
      "Subcategory",
      "Cost Price (₹)",
      "Size",
      "Retail Price (₹)",
      "Wholesale Price (₹)",
      "Stock",
      "Barcode",
      "Threshold Stock",
    ];

    const rows = data.flatMap((product) => {
      return product.sizes.map((size) => {
        return [
          `"${product.itemcode}"`,
          `"${product.name}"`,
          `"${product.description}"`,
          `"${product.polish || ""}"`,
          `"${product.category}"`,
          `"${product.subcategory || ""}"`,
          `"${product.costPrice}"`,
          `"${size.size}"`,
          `"${size.retailPrice}"`,
          `"${size.wholesalePrice}"`,
          `"${size.stock}"`,
          `"${size.barcode}"`,
          `"${size.thresholdStock}"`,
        ];
      });
    });

    // Combine header and rows into CSV content
    const csvContent = [header, ...rows].map((row) => row.join(",")).join("\n");
    return csvContent;
  };

  // Function to download the CSV file
  const downloadCSV = () => {
    const csvData = convertToCSV(filteredProducts);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "filtered_product_list.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique categories and subcategories for filter dropdowns
  const categories = [...new Set(products.map((product) => product.category))];
  const subcategories = [
    ...new Set(products.map((product) => product.subcategory).filter(Boolean)),
  ];

  return (
    <div className="pl-container">
      <div className="pl-header">
        <h1 className="pl-title">Product List</h1>
        
        <div className="pl-search-container">
          <input
            type="text"
            placeholder="Search products..."
            className="pl-search-input"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="pl-download-btn" onClick={downloadCSV}>
            <i className="fas fa-download"></i> {!isMobile && 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Filter Section */}
      <div className="pl-filters-container">
        <div className="pl-filter-group">
          <label htmlFor="category" className="pl-filter-label">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className="pl-filter-select"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="pl-filter-group">
          <label htmlFor="subcategory" className="pl-filter-label">Subcategory</label>
          <select
            id="subcategory"
            name="subcategory"
            value={filters.subcategory}
            onChange={handleFilterChange}
            className="pl-filter-select"
          >
            <option value="">All Subcategories</option>
            {subcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>
                {subcategory}
              </option>
            ))}
          </select>
        </div>

        <button onClick={resetFilters} className="pl-reset-btn">
          <i className="fas fa-sync-alt"></i> {!isMobile && 'Reset'}
        </button>
      </div>

      {/* Product Count */}
      <div className="pl-product-count">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Product Table */}
      <div className="pl-table-container">
        <table className="pl-product-table">
          <thead>
            <tr>
              <th className="pl-th">Item Code</th>
              <th className="pl-th">Product</th>
              {!isMobile && (
                <>
                  <th className="pl-th">Category</th>
                  <th className="pl-th">Subcategory</th>
                </>
              )}
              <th className="pl-th">Size</th>
              <th className="pl-th">Price (₹)</th>
              <th className="pl-th">Stock</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr key={product.id} className="pl-tr">
                  <td className="pl-td pl-itemcode">{product.itemcode}</td>
                  <td className="pl-td">
                    <button
                      onClick={() => handleProductClick(product)}
                      className="pl-product-btn"
                    >
                      {product.name}
                      {isMobile && (
                        <div className="pl-mobile-details">
                          <span>{product.category}</span>
                          {product.subcategory && <span> • {product.subcategory}</span>}
                        </div>
                      )}
                    </button>
                  </td>
                  {!isMobile && (
                    <>
                      <td className="pl-td">{product.category}</td>
                      <td className="pl-td">{product.subcategory || "-"}</td>
                    </>
                  )}
                  <td className="pl-td pl-sizes">
                    {product.sizes.map((size) => size.size).join(", ")}
                  </td>
                  <td className="pl-td pl-prices">
                    {product.sizes.map((size) => `₹${size.retailPrice}`).join(", ")}
                  </td>
                  <td className="pl-td pl-stocks">
                    {product.sizes.map((size) => (
                      <span 
                        key={size.size} 
                        className={`pl-stock-indicator ${
                          size.stock <= size.thresholdStock ? 'pl-low-stock' : 
                          size.stock <= size.thresholdStock * 2 ? 'pl-medium-stock' : 'pl-high-stock'
                        }`}
                      >
                        {size.stock}
                      </span>
                    ))}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="pl-tr">
                <td colSpan={isMobile ? 4 : 7} className="pl-no-results">
                  No products found matching your criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for showing product details */}
      {selectedProduct && (
        <div className="pl-modal-overlay">
          <div className="pl-modal-content">
            <button className="pl-modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            
            <div className="pl-modal-header">
              <h2 className="pl-modal-title">{selectedProduct.name}</h2>
              <div className="pl-modal-subtitle">
                <span className="pl-modal-itemcode">{selectedProduct.itemcode}</span>
                <span className="pl-modal-category">{selectedProduct.category}</span>
                {selectedProduct.subcategory && (
                  <span className="pl-modal-subcategory">{selectedProduct.subcategory}</span>
                )}
              </div>
            </div>
            
            <div className="pl-modal-body">
              <div className="pl-modal-section">
                <h3 className="pl-modal-section-title">Description</h3>
                <p className="pl-modal-text">{selectedProduct.description}</p>
                {selectedProduct.polish && (
                  <p className="pl-modal-text">
                    <strong>Polish:</strong> {selectedProduct.polish}
                  </p>
                )}
                <p className="pl-modal-text">
                  <strong>Cost Price:</strong> ₹{selectedProduct.costPrice}
                </p>
              </div>
              
              <div className="pl-modal-section">
                <h3 className="pl-modal-section-title">Size & Pricing</h3>
                <div className="pl-sizes-grid">
                  {selectedProduct.sizes.map((size, index) => (
                    <div key={index} className="pl-size-card">
                      <div className="pl-size-header">
                        <span className="pl-size-name">{size.size}</span>
                        <span className={`pl-stock-badge ${
                          size.stock <= size.thresholdStock ? 'pl-stock-critical' : 
                          size.stock <= size.thresholdStock * 2 ? 'pl-stock-warning' : 'pl-stock-good'
                        }`}>
                          {size.stock} in stock
                        </span>
                      </div>
                      <div className="pl-size-details">
                        <div className="pl-price-row">
                          <span>Retail:</span>
                          <span className="pl-price-value">₹{size.retailPrice}</span>
                        </div>
                        <div className="pl-price-row">
                          <span>Wholesale:</span>
                          <span className="pl-price-value">₹{size.wholesalePrice}</span>
                        </div>
                        <div className="pl-meta-row">
                          <span>Barcode:</span>
                          <span className="pl-meta-value">{size.barcode || 'N/A'}</span>
                        </div>
                        <div className="pl-meta-row">
                          <span>Reorder at:</span>
                          <span className="pl-meta-value">{size.thresholdStock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {selectedProduct.images.length > 0 && (
                <div className="pl-modal-section">
                  <h3 className="pl-modal-section-title">Product Images</h3>
                  <div className="pl-images-grid">
                    {selectedProduct.images.map((image, index) => (
                      <div key={index} className="pl-image-container">
                        <img
                          src={`${API_BASE_URL}/images/${image}`}
                          alt={`Product ${index + 1}`}
                          className="pl-product-image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;