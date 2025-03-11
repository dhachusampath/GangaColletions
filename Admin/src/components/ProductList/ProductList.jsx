import React, { useState } from "react";
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

  // Function to handle product click (open the modal)
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedProduct(null);
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // Function to apply filters
  const applyFilters = () => {
    let filtered = products;

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

    setFilteredProducts(filtered);
  };

  // Function to reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      subcategory: "",
    });
    setFilteredProducts(products);
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
    link.setAttribute("download", "filtered_product_list.csv"); // Set the file name
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Get unique categories and subcategories for filter dropdowns
  const categories = [...new Set(products.map((product) => product.category))];
  const subcategories = [
    ...new Set(products.map((product) => product.subcategory)),
  ];

  return (
    <div className="product-list-container">
      <h1>Product List</h1>

      {/* Filter Section */}
      <div className="filters">
        <select
          name="category"
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">Select Category</option>
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          name="subcategory"
          value={filters.subcategory}
          onChange={handleFilterChange}
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((subcategory, index) => (
            <option key={index} value={subcategory}>
              {subcategory}
            </option>
          ))}
        </select>

        <button onClick={applyFilters} className="apply-filters-btn">
          Apply Filters
        </button>

        <button onClick={resetFilters} className="reset-filters-btn">
          Reset Filters
        </button>
      </div>

      {/* Button to trigger CSV export */}
      <button onClick={downloadCSV} className="export-csv-btn">
        Export Filtered Data to CSV
      </button>

      <table className="product-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Subcategory</th>
            <th>Size</th>
            <th>Price (₹)</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={product.id}>
              <td>{product.itemcode}</td>
              <td>
                <button
                  onClick={() => handleProductClick(product)}
                  className="product-name"
                >
                  {product.name}
                </button>
              </td>
              <td>{product.category}</td>
              <td>{product.subcategory || "N/A"}</td>
              <td>{product.sizes.map((size) => size.size).join(", ")}</td>
              <td>{product.sizes.map((size) => size.retailPrice).join(", ")}</td>
              <td>{product.sizes.map((size) => size.stock).join(", ")}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for showing product details */}
      {selectedProduct && (
        <div className="product-detail-modal">
          <div className="product-detail-modal-content">
            <span className="product-detail-close" onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedProduct.name}</h2>
            <p>
              <strong>Description:</strong> {selectedProduct.description}
            </p>
            <p>
              <strong>Polish:</strong> {selectedProduct.polish}
            </p>
            <p>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p>
              <strong>Subcategory:</strong> {selectedProduct.subcategory}
            </p>
            <p>
              <strong>Cost Price:</strong> ₹{selectedProduct.costPrice}
            </p>
            <h3>Sizes:</h3>
            <ul>
              {selectedProduct.sizes.map((size, index) => (
                <li key={index}>
                  <strong>Size:</strong> {size.size} |{" "}
                  <strong>Retail Price:</strong> ₹{size.retailPrice} |{" "}
                  <strong>Wholesale Price:</strong> ₹{size.wholesalePrice} |{" "}
                  <strong>Stock:</strong> {size.stock} |{" "}
                  <strong>Barcode:</strong> {size.barcode} |{" "}
                  <strong>Threshold Stock:</strong> {size.thresholdStock}
                </li>
              ))}
            </ul>
            {selectedProduct.images.length > 0 && (
              <div>
                <h3>Product Images:</h3>
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={`${API_BASE_URL}/images/${image}`}
                    alt={`Product Image ${index + 1}`}
                    className="product-image"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;