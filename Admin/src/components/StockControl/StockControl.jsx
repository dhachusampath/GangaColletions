import React, { useState } from "react";
import "./StockControl.css";
import { useStore } from "../Context/Store";
import axios from "axios";

const StockControl = () => {
  const { products, setProducts, API_BASE_URL } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [updateFeedback, setUpdateFeedback] = useState("");
  const [pendingUpdates, setPendingUpdates] = useState([]);
  const [errors, setErrors] = useState({});

  // Filter products by search term
  const filteredProducts = products.filter((product) => {
    const name = product.name || "";
    const category = product.category || "";
    const subcategory = product.subcategory || "";
    const itemcode = product.itemcode || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
      itemcode.toLowerCase().includes(searchTerm.toLowerCase())
    );
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
        [`${productId}-${sizeIndex}`]: "Stock must be a positive number",
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
      alert("Please fix input errors before updating stock.");
      return;
    }

    if (window.confirm("Do you want to update the stock?")) {
      try {
        for (const update of pendingUpdates) {
          const { productId, sizeIndex, newStock } = update;
          await axios.put(`${API_BASE_URL}/products/update-stock/${productId}`, {
            sizeIndex,
            newStock,
          });
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

        setUpdateFeedback("Stock levels updated successfully!");
        setPendingUpdates([]);
      } catch (error) {
        console.error("Error updating stock:", error.response?.data || error.message);
        setUpdateFeedback("Error updating stock. Please try again.");
      } finally {
        setTimeout(() => setUpdateFeedback(""), 3000);
      }
    }
  };

  return (
    <div className="stock-inventory-container">
      <h1>Stock Inventory Management</h1>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by name, category, subcategory, or item code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Mobile Design */}
      <div className="mobile-design">
        <div className="product-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.itemcode}>
                <h2>{product.name}</h2>
                {product.sizes.map((size, index) => (
                  <div key={index} className="size-row">
                    <span>
                      <strong>Size:</strong> {size.size}, <strong>Stock:</strong>
                    </span>
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
                      className="stock-input"
                    />
                    {errors[`${product.itemcode}-${index}`] && (
                      <span className="error-text">{errors[`${product.itemcode}-${index}`]}</span>
                    )}
                  </div>
                ))}
                <button className="update-button" onClick={handleUpdateConfirmation}>
                  Update Stock
                </button>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>

      {/* Desktop Design */}
      <div className="desktop-design">
        <h2>Product List</h2>
        {updateFeedback && <p className="update-feedback">{updateFeedback}</p>}
        {filteredProducts.length > 0 ? (
          <table className="product-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Subcategory</th>
                <th>Item Code</th>
                <th>Sizes</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.itemcode}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.subcategory}</td>
                  <td>{product.itemcode}</td>
                  <td>
                    {product.sizes.map((size, index) => (
                      <div key={index} className="size-row">
                        <span>
                          <strong>Size:</strong> {size.size}, <strong>Stock:</strong>
                        </span>
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
                          className="stock-input"
                        />
                        {errors[`${product.itemcode}-${index}`] && (
                          <span className="error-text">{errors[`${product.itemcode}-${index}`]}</span>
                        )}
                      </div>
                    ))}
                  </td>
                  <td>
                    <button className="update-button" onClick={handleUpdateConfirmation}>
                      Update Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default StockControl;
