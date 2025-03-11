import React, { useState, useEffect } from "react";
import { useStore } from "../Context/Store";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "./InventoryControl.css"; // Import custom styles

const InventoryControl = () => {
  const { products, setProducts, API_BASE_URL, lowStockAlerts, setLowStockAlerts } = useStore();

  useEffect(() => {
    checkLowStock();
  }, [products]);

  const checkLowStock = () => {
    const alerts = [];

    products.forEach((product) => {
      product.sizes.forEach((size) => {
        if (size.stock < size.thresholdStock) {
          const missingStock = size.thresholdStock - size.stock;
          alerts.push({
            product: product.name,
            size: size.size,
            stock: size.stock,
            threshold: size.thresholdStock,
            missingStock,
          });
          // toast.warn(
          //   `Low Stock Alert: ${product.name} (Size: ${size.size}) - Stock: ${size.stock}, Missing: ${missingStock}`,
          //   { position: "top-right" }
          // );
        }
      });
    });

    setLowStockAlerts(alerts);
  };

  const handleThresholdChange = (productId, sizeIndex, value) => {
    if (value < 0) {
      toast.error("Threshold value cannot be negative", { position: "top-right" });
      return;
    }
    
    const updatedProducts = products.map((product) => {
      if (product.id === productId) {
        const updatedSizes = product.sizes.map((size, index) => {
          if (index === sizeIndex) {
            return { ...size, thresholdStock: Number(value) };
          }
          return size;
        });
        return { ...product, sizes: updatedSizes };
      }
      return product;
    });

    setProducts(updatedProducts);
  };

  const saveUpdatedThresholds = async () => {
    if (!window.confirm("Are you sure you want to update the threshold limits?")) {
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/products/update-thresholds`, { products });
      if (response.status === 200) {
        toast.success("Threshold limits updated successfully!", { position: "top-right" });
      }
    } catch (error) {
      console.error("Error updating thresholds:", error.response?.data || error.message);
      toast.error("Failed to update threshold limits. Please try again.", { position: "top-right" });
    }
  };

  return (
    <div className="inventory-control-container">
      <h1 className="inventory-control-title">Inventory Control</h1>
      <table className="inventory-control-table">
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Size</th>
            <th>Stock</th>
            <th>Threshold</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) =>
            product.sizes.map((size, index) => (
              <tr key={`${product.id}-${index}`}>
                <td>{product.name}</td>
                <td>{size.size}</td>
                <td>{size.stock}</td>
                <td>
                  <input
                    type="number"
                    className="inventory-threshold-input"
                    value={size.thresholdStock || ""}
                    onChange={(e) =>
                      handleThresholdChange(product.id, index, e.target.value)
                    }
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <button className="inventory-save-button" onClick={saveUpdatedThresholds}>
        Save Threshold Limits
      </button>

      <h2 className="inventory-alerts-title">Low Stock Alerts</h2>
      <ul className="inventory-alerts-list">
        {lowStockAlerts.length > 0 ? (
          lowStockAlerts.map((alert, index) => (
            <li key={index} className="inventory-alert-item">
              {alert.product} (Size: {alert.size}) - Stock: {alert.stock}, 
              Threshold: {alert.threshold}, Missing: {alert.missingStock}
            </li>
          ))
        ) : (
          <p className="inventory-no-alerts">No alerts</p>
        )}
      </ul>
      <ToastContainer />
    </div>
  );
};

export default InventoryControl;
