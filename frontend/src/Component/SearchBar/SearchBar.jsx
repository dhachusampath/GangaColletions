import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { useStore } from "../Context/Store";

const SearchBar = ({ setShowSearch }) => {
  const { products } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current search term:", searchTerm);
    
    if (searchTerm.trim() !== "") {
      console.log("Starting search with term:", searchTerm);
      
      const searchLower = searchTerm.toLowerCase();
      
      const filtered = products.filter((product) => {
        console.log(`Checking product: ${product.name || 'unnamed'}`);
        
        // Case-insensitive search for name
        const nameMatch = product.name?.toLowerCase().includes(searchLower);
        
        // Case-sensitive search for itemcode if it exists
        const itemCodeMatch = product.itemcode 
          ? product.itemcode.includes(searchTerm) 
          : false;
        
        console.log(`Name match: ${nameMatch}, Item Code match: ${itemCodeMatch}`);
        
        return nameMatch || itemCodeMatch;
      });
      
      console.log("Filtered products count:", filtered.length);
      console.log("Filtered products:", filtered);
      
      setFilteredProducts(filtered);
    } else {
      console.log("Search term empty - clearing results");
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  const handleProductClick = (productId) => {
    console.log("Product clicked, navigating to:", productId);
    navigate(`/product/${productId}`);
    setSearchTerm("");
    setShowSearch(false);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search by name or item code..."
        value={searchTerm}
        onChange={(e) => {
          console.log("Input changed:", e.target.value);
          setSearchTerm(e.target.value);
        }}
        autoFocus
      />
      {filteredProducts.length > 0 ? (
        <ul className="search-results">
          {filteredProducts.map((product) => (
            <li
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="search-result-item"
            >
              <div className="product-name">{product.name}</div>
              {product.itemcode && (
                <div className="product-code">Code: {product.itemcode}</div>
              )}
            </li>
          ))}
        </ul>
      ) : searchTerm && (
        <div className="no-results">No products found matching "{searchTerm}"</div>
      )}
    </div>
  );
};

export default SearchBar;