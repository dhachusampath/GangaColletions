import React, { useState, useEffect } from "react";
import "./StockControl.css";
import { useStore } from "../Context/Store";
import axios from "axios";
import { FiSearch, FiCheck, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

const StockControl = () => {
  const { products, setProducts, API_BASE_URL } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState({ message: "", type: "" });
  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'lowStock', 'outOfStock'

  // Filter products based on search and stock status
  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.subcategory?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.itemcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Stock status filter
    let matchesStock = true;
    if (activeTab === "lowStock") {
      matchesStock = product.sizes.some(size => size.stock > 0 && size.stock <= 10);
    } else if (activeTab === "outOfStock") {
      matchesStock = product.sizes.some(size => size.stock === 0);
    }
    
    return matchesSearch && matchesStock;
  });

  // Validate stock input
  const validateStock = (stock) => {
    return /^\d+$/.test(stock) && Number(stock) >= 0;
  };

  // Update temporary stock changes
  const handleTemporaryStockChange = (productId, sizeIndex, value) => {
    const stockValue = value.trim() === "" ? null : Number(value);

    if (stockValue !== null && !validateStock(stockValue)) {
      setErrors((prev) => ({
        ...prev,
        [`${productId}-${sizeIndex}`]: "Must be a positive number",
      }));
      return;
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${productId}-${sizeIndex}`];
        return newErrors;
      });
    }

    setPendingUpdates((prev) => {
      const existingUpdateIndex = prev.findIndex(
        (update) => update.productId === productId && update.sizeIndex === sizeIndex
      );
      if (existingUpdateIndex > -1) {
        const updated = [...prev];
        updated[existingUpdateIndex].newStock = stockValue;
        return updated;
      }
      return [...prev, { productId, sizeIndex, newStock: stockValue }];
    });
  };

  // Handle stock update confirmation
  const handleUpdateConfirmation = async () => {
    if (!pendingUpdates.length) return;

    // Check for validation errors before proceeding
    if (Object.keys(errors).length > 0) {
      setUpdateFeedback({
        message: "Please fix input errors before updating stock",
        type: "error"
      });
      setTimeout(() => setUpdateFeedback({ message: "", type: "" }), 3000);
      return;
    }

    setIsLoading(true);
    try {
      const updatesToProcess = [...pendingUpdates];
      
      // Process updates in batches of 5 to avoid overwhelming the server
      while (updatesToProcess.length > 0) {
        const batch = updatesToProcess.splice(0, 5);
        await Promise.all(
          batch.map(update => 
            axios.put(`${API_BASE_URL}/products/update-stock/${update.productId}`, {
              sizeIndex: update.sizeIndex,
              newStock: update.newStock,
            })
          )
        );
      }

      // Update state after successful updates
      setProducts((prev) =>
        prev.map((product) => {
          const updatesForProduct = pendingUpdates.filter(
            (update) => update.productId === product.itemcode
          );
          if (!updatesForProduct.length) return product;

          const updatedSizes = product.sizes.map((size, index) => {
            const updateForSize = updatesForProduct.find((u) => u.sizeIndex === index);
            return updateForSize ? { ...size, stock: updateForSize.newStock } : size;
          });

          return { ...product, sizes: updatedSizes };
        })
      );

      setUpdateFeedback({
        message: `${pendingUpdates.length} stock levels updated successfully!`,
        type: "success"
      });
      setPendingUpdates([]);
    } catch (error) {
      console.error("Error updating stock:", error.response?.data || error.message);
      setUpdateFeedback({
        message: "Error updating stock. Please try again.",
        type: "error"
      });
    } finally {
      setIsLoading(false);
      setTimeout(() => setUpdateFeedback({ message: "", type: "" }), 5000);
    }
  };

  // Reset all pending changes
  const handleResetChanges = () => {
    setPendingUpdates([]);
    setErrors({});
    setUpdateFeedback({
      message: "All pending changes have been reset",
      type: "info"
    });
    setTimeout(() => setUpdateFeedback({ message: "", type: "" }), 3000);
  };

  return (
    <div className="stock-control-container">
      <header className="stock-control-header">
        <h1 className="stock-control-title">Inventory Management</h1>
        <p className="stock-control-subtitle">Manage and update product stock levels</p>
      </header>

      {/* Controls Section */}
      <div className="stock-control-toolbar">
        {/* Search Bar */}
        <div className="stock-search-container">
          <FiSearch className="stock-search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="stock-search-input"
          />
        </div>

        {/* Stock Status Tabs */}
        <div className="stock-status-tabs">
          <button
            className={`stock-tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Items
          </button>
          <button
            className={`stock-tab ${activeTab === "lowStock" ? "active" : ""}`}
            onClick={() => setActiveTab("lowStock")}
          >
            Low Stock
          </button>
          <button
            className={`stock-tab ${activeTab === "outOfStock" ? "active" : ""}`}
            onClick={() => setActiveTab("outOfStock")}
          >
            Out of Stock
          </button>
        </div>

        {/* Action Buttons */}
        <div className="stock-action-buttons">
          <button
            className="stock-reset-btn"
            onClick={handleResetChanges}
            disabled={pendingUpdates.length === 0}
          >
            <FiRefreshCw /> Reset Changes
          </button>
          <button
            className="stock-update-btn"
            onClick={handleUpdateConfirmation}
            disabled={pendingUpdates.length === 0 || isLoading}
          >
            {isLoading ? "Updating..." : "Update Stock"} {pendingUpdates.length > 0 && `(${pendingUpdates.length})`}
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {updateFeedback.message && (
        <div className={`stock-feedback stock-feedback-${updateFeedback.type}`}>
          {updateFeedback.type === "error" ? <FiAlertCircle /> : <FiCheck />}
          {updateFeedback.message}
        </div>
      )}

      {/* Mobile View */}
      <div className="stock-mobile-view">
        {filteredProducts.length > 0 ? (
          <div className="stock-mobile-list">
            {filteredProducts.map((product) => (
              <div key={product.itemcode} className="stock-mobile-card">
                <div className="stock-mobile-header">
                  <h3 className="stock-product-name">{product.name}</h3>
                  <span className="stock-product-code">{product.itemcode}</span>
                </div>
                <div className="stock-mobile-category">
                  {product.category} / {product.subcategory}
                </div>
                
                {product.sizes.map((size, index) => (
                  <div key={index} className="stock-size-row">
                    <div className="stock-size-info">
                      <span className="stock-size-label">Size:</span>
                      <span className="stock-size-value">{size.size}</span>
                      <span className="stock-size-label">Current:</span>
                      <span className={`stock-size-value ${size.stock <= 10 ? "low-stock" : ""} ${size.stock === 0 ? "out-of-stock" : ""}`}>
                        {size.stock}
                      </span>
                    </div>
                    <div className="stock-size-control">
                      <input
                        type="number"
                        value={
                          pendingUpdates.find(
                            (u) => u.productId === product.itemcode && u.sizeIndex === index
                          )?.newStock ?? size.stock
                        }
                        onChange={(e) =>
                          handleTemporaryStockChange(product.itemcode, index, e.target.value)
                        }
                        className={`stock-input ${errors[`${product.itemcode}-${index}`] ? "error" : ""}`}
                        min="0"
                      />
                      {errors[`${product.itemcode}-${index}`] && (
                        <span className="stock-error-text">{errors[`${product.itemcode}-${index}`]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="stock-empty-state">
            <FiAlertCircle className="stock-empty-icon" />
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Desktop View */}
      <div className="stock-desktop-view">
        {filteredProducts.length > 0 ? (
          <table className="stock-table">
            <thead>
              <tr>
                <th className="stock-th-product">Product</th>
                <th className="stock-th-category">Category</th>
                <th className="stock-th-sizes">Sizes & Stock</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.itemcode} className="stock-table-row">
                  <td className="stock-td-product">
                    <div className="stock-product-info">
                      <div className="stock-product-name">{product.name}</div>
                      <div className="stock-product-code">{product.itemcode}</div>
                    </div>
                  </td>
                  <td className="stock-td-category">
                    {product.category}
                    <div className="stock-subcategory">{product.subcategory}</div>
                  </td>
                  <td className="stock-td-sizes">
                    <div className="stock-sizes-container">
                      {product.sizes.map((size, index) => (
                        <div key={index} className="stock-size-container">
                          <div className="stock-size-header">
                            <span className="stock-size-name">{size.size}</span>
                            <span className={`stock-current ${size.stock <= 10 ? "low-stock" : ""} ${size.stock === 0 ? "out-of-stock" : ""}`}>
                              Current: {size.stock}
                            </span>
                          </div>
                          <div className="stock-input-group">
                            <input
                              type="number"
                              value={
                                pendingUpdates.find(
                                  (u) => u.productId === product.itemcode && u.sizeIndex === index
                                )?.newStock ?? size.stock
                              }
                              onChange={(e) =>
                                handleTemporaryStockChange(product.itemcode, index, e.target.value)
                              }
                              className={`stock-input ${errors[`${product.itemcode}-${index}`] ? "error" : ""}`}
                              min="0"
                            />
                            {errors[`${product.itemcode}-${index}`] && (
                              <span className="stock-error-text">{errors[`${product.itemcode}-${index}`]}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="stock-empty-state">
            <FiAlertCircle className="stock-empty-icon" />
            <p>No products found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockControl;