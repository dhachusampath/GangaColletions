import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to install axios: npm install axios
import "./ManagePopularProducts.css";
import { useStore } from "../Context/Store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManagePopularProducts = () => {
  const { API_BASE_URL,products } = useStore();
  const [popularProducts, setPopularProducts] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const productsPerPage = 6;

  // Fetch popular products from the backend
  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/products/popular`);
        setPopularProducts(response.data);
      } catch (error) {
        console.error("Error fetching popular products:", error);
      }
    };
    fetchPopularProducts();
  }, []);

  // Add a product to the popular list

  const addToPopular = async (product) => {
    if (popularProducts.some((p) => p.itemcode === product.itemcode)) {
      toast.warning("This product is already in the popular list.");
      return;
    }
  
    setLoading(true); // Disable buttons
    try {
      await axios.post(`${API_BASE_URL}/products/popular/${product.itemcode}`);
      setPopularProducts([...popularProducts, product]);
      toast.success("Product added to popular list successfully!");
    } catch (error) {
      console.error("Error adding to popular:", error);
      toast.error("Failed to add product to popular list.");
    } finally {
      setLoading(false); // Re-enable buttons
    }
  };
  
  const removeFromPopular = async (itemcode) => {
    setLoading(true); // Disable buttons
    try {
      await axios.delete(`${API_BASE_URL}/products/popular/${itemcode}`);
      setPopularProducts(popularProducts.filter((product) => product.itemcode !== itemcode));
      toast.success("Product removed from popular list successfully!");
    } catch (error) {
      console.error("Error removing from popular:", error);
      toast.error("Failed to remove product from popular list.");
    } finally {
      setLoading(false); // Re-enable buttons
    }
  };

  const filteredProducts = products.filter((product) => {
    const nameMatch = product.name?.toLowerCase().includes(filter.toLowerCase());
    const categoryMatch = product.category?.toLowerCase().includes(filter.toLowerCase());
    const subcategoryMatch = product.subcategory?.toLowerCase().includes(filter.toLowerCase());
    return nameMatch || categoryMatch || subcategoryMatch;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="popular-products-container">
      <h1 className="heading">Manage Popular Products</h1>
      <div className="filter-container">
        <input
          type="text"
          className="filter-input"
          placeholder="Search by name, category, or subcategory..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      <div className="content-container">
        <div className="product-list">
          <h2 className="subheading">All Products</h2>
          <div className="product-grid">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <div key={product.itemcode} className="product-card">
                  <img src={`${API_BASE_URL}/images/${product.images[0]}`} alt={product.image || "Product Image"} className="product-image" />
                  <h3 className="product-title">{product.name || "Untitled"}</h3>
                  <p className="product-description">{product.description || "No description available"}</p>
                  <p className="product-category">Category: {product.category || "N/A"}</p>
                  <p className="product-subcategory">Subcategory: {product.subcategory || "N/A"}</p>
                  <p className="product-price">Cost Price: ₹{product.costPrice}</p>
                  <p className="product-polish">Polish: {product.polish}</p>
                  <button
  className="add-button"
  onClick={() => addToPopular(product)}
  disabled={popularProducts.some((p) => p.itemcode === product.itemcode)}
>
  Add to Popular
</button>                </div>
              ))
            ) : (
              <p>No products found.</p>
            )}
          </div>

          <div className="pagination-container">
            <button className="pagination-button" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
            <span className="pagination-info">Page {currentPage} of {Math.ceil(filteredProducts.length / productsPerPage)}</span>
            <button className="pagination-button" onClick={() => paginate(currentPage + 1)} disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}>Next</button>
          </div>
        </div>

        <div className="popular-list">
          <h2 className="subheading">Popular Products</h2>
          <div className="product-grid">
            {popularProducts.length > 0 ? (
              popularProducts.map((product) => (
                <div key={product.itemcode} className="product-card popular-card">
                  <img src={`${API_BASE_URL}/images/${product.images}`} alt={product.image || "Product Image"} className="product-image" />
                  <h3 className="product-title">{product.name || "Untitled"}</h3>
                  <p className="product-description">{product.description || "No description available"}</p>
                  <p className="product-category">Category: {product.category || "N/A"}</p>
                  <p className="product-subcategory">Subcategory: {product.subcategory || "N/A"}</p>
                  <p className="product-price">Cost Price: ₹{product.costPrice}</p>
                  <p className="product-polish">Polish: {product.polish}</p>
                  <button className="remove-button" onClick={() => removeFromPopular(product.itemcode)}>Remove</button>
                </div>
              ))
            ) : (
              <p>No popular products added yet.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ManagePopularProducts;
