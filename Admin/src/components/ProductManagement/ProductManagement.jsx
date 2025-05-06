import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useStore } from "../Context/Store";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { FiEdit, FiTrash2, FiPlus, FiX, FiSearch, FiCamera } from "react-icons/fi";
import { FaBarcode } from "react-icons/fa";
import "./ProductManagement.css"

const categories = [
  { name: "Mugapu Thali chains", subcategories: [] },
  { name: "BRACELETS & KADA", subcategories: [] },
  { name: "DOLLAR CHAINS", subcategories: [] },
  {
    name: "Impon jewelleries",
    subcategories: [
      "Dollar Chains",
      "Attigai",
      "Bangles",
      "Rings",
      "Metti / Toe rings",
      "Thali urukkal",
      "kaapu / kada",
    ],
  },
  {
    name: "Necklace",
    subcategories: [
      "Gold plated Necklace",
      "Stone necklace",
      "Antique & Matte necklace",
    ],
  },
  {
    name: "Haram",
    subcategories: ["Goldplated", "Stone Haram", "Antique & Matte"],
  },
  {
    name: "Combo sets",
    subcategories: ["Gold plated Combo sets", "Stone sets Combo sets"],
  },
  { name: "Daily use chains", subcategories: [] },
  { name: "Forming", subcategories: [] },
  {
    name: "Bangles",
    subcategories: [
      "Gold plated Bangles",
      "Microplated Bangles",
      "Impon Bangles",
      "Antique & Matte Bangles",
      "Baby Bangles",
    ],
  },
  {
    name: "Earrings",
    subcategories: [
      "Gold plated Earrings",
      "Microplated Earrings",
      "Impon Earrings",
      "Antique & Matte",
    ],
  },
  { name: "Anklets", subcategories: [] },
  { name: "Maatal & Tikka", subcategories: [] },
  { name: "Combo offer sets", subcategories: [] },
  { name: "Hipbelts", subcategories: [] },
];


const ProductManagement = () => {
  const { products, setProducts ,API_BASE_URL } = useStore();
  const [newProduct, setNewProduct] = useState({
    itemcode: "",
    name: "",
    description: "",
    polish: "",
    category: "",
    subcategory: "",
    costPrice: "",
    images: [],
    sizes: [],
  });
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errors, setErrors] = useState({});
  const [subcategories, setSubcategories] = useState([]);
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false);
  const [sizeIndexToScan, setSizeIndexToScan] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const handleBarcodeScan = (err, result) => {
    if (result) {
      setNewProduct((prevProduct) => {
        const updatedSizes = [...prevProduct.sizes];
        if (sizeIndexToScan !== null) {
          updatedSizes[sizeIndexToScan].barcode = result.text;
        }
        return { ...prevProduct, sizes: updatedSizes };
      });
      setIsBarcodeScanning(false);
      setSizeIndexToScan(null);
      toast.success("Barcode scanned successfully!");
    }
  };

  useEffect(() => {
    axios.get(`${API_BASE_URL}/products`)
      .then((res) => {
        setProducts(res.data || []);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  const toggleBarcodeScanner = (index) => {
    setIsBarcodeScanning(!isBarcodeScanning);
    setSizeIndexToScan(index);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
      images: prevProduct.images,
    }));
    setErrors({ ...errors, [name]: !value });
  };

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const category = categories.find((cat) => cat.name === selectedCategory);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      category: selectedCategory,
      subcategory: "",
      images: prevProduct.images,
    }));
    setSubcategories(category ? category.subcategories : []);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
  
    setNewImageFiles(files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
  
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: [...prevProduct.images, ...imageUrls],
    }));
  
    setErrors({ ...errors, images: false });
  };

  const addSize = () => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      sizes: [
        ...prevProduct.sizes,
        { size: "", barcode: "", retailPrice: "", wholesalePrice: "", stock: "", thresholdStock: "" },
      ],
      images: prevProduct.images,
    }));
  };
  
  const removeSize = (index) => {
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      sizes: prevProduct.sizes.filter((_, i) => i !== index),
      images: prevProduct.images,
    }));
  };

  const updateSize = (index, key, value) => {
    setNewProduct((prevProduct) => {
      const updatedSizes = prevProduct.sizes.map((size, i) =>
        i === index ? { ...size, [key]: value } : size
      );
      return {
        ...prevProduct,
        sizes: updatedSizes,
        images: prevProduct.images,
      };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    ["itemcode", "name", "description", "category", "polish"].forEach((field) => {
      if (!newProduct[field]) {
        newErrors[field] = true;
        isValid = false;
      }
    });

    if (newProduct.images.length === 0) {
      newErrors.images = true;
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleDeleteImage = (image) => {
    if (image.startsWith("blob:")) {
      const updatedNewImageFiles = newImageFiles.filter(
        (file) => URL.createObjectURL(file) !== image
      );
      setNewImageFiles(updatedNewImageFiles);
    } else {
      setDeletedImages((prev) => [...prev, image]);
    }
  
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((img) => img !== image),
    }));
  };

  const handleDeleteAllImages = () => {
    setDeletedImages((prev) => [...prev, ...newProduct.images]);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: [],
    }));
    setNewImageFiles([]);
  };

  const handleSaveProduct = async () => {
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }
  
    setLoading(true);
  
    const formData = new FormData();
    formData.append("itemcode", newProduct.itemcode);
    formData.append("name", newProduct.name);
    formData.append("description", newProduct.description);
    formData.append("polish", newProduct.polish);
    formData.append("category", newProduct.category);
    formData.append("subcategory", newProduct.subcategory);
    formData.append("costPrice", newProduct.costPrice);
    formData.append("sizes", JSON.stringify(newProduct.sizes));
  
    let existingImages = newProduct.images?.filter((img) => 
      img.startsWith("http") || img.endsWith(".png") || img.endsWith(".jpg")
    );
    
    if (existingImages.length > 0) {
      formData.append("existingImages", JSON.stringify(existingImages));
    }
  
    if (newImageFiles && newImageFiles.length > 0) {
      newImageFiles.forEach((file) => formData.append("newImages", file));
    }
  
    if (deletedImages && deletedImages.length > 0) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
    }
  
    try {
      let response;
  
      if (isEditing) {
        response = await axios.put(
          `${API_BASE_URL}/products/update/${products[editIndex]._id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        response = await axios.post(`${API_BASE_URL}/products/add`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
  
      if (response.data) {
        toast.success(isEditing ? "Product updated successfully" : "Product added successfully");
        const updatedProducts = isEditing
          ? products.map((product, index) => (index === editIndex ? response.data.product : product))
          : [...products, response.data.product];
        setProducts(updatedProducts);
      }
  
      resetForm();
    } catch (error) {
      toast.error(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const handleEditProduct = (index) => {
    const productToEdit = products[index];
    setIsEditing(true);
    setEditIndex(index);
    setNewProduct({
      ...productToEdit,
      images: productToEdit.images ? [...productToEdit.images] : [],
    });
    setShowModal(true);
  };
  
  const handleDeleteProduct = async (index) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const productId = products[index]._id;
        const response = await axios.delete(`${API_BASE_URL}/products/delete/${productId}`);
        if (response.data) {
          toast.success("Product deleted successfully");
          setProducts(products.filter((_, i) => i !== index));
        }
      } catch (error) {
        toast.error(`Error: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  const resetForm = () => {
    setNewProduct({
      itemcode: "",
      name: "",
      description: "",
      polish: "",
      category: "",
      subcategory: "",
      costPrice: "",
      images: [],
      sizes: [],
    });
    setNewImageFiles([]);
    setIsEditing(false);
    setEditIndex(null);
    setShowModal(false);
    setErrors({});
    setActiveTab("details");
  };

  const filteredProducts = products.filter((product) =>
    [product.name, product.itemcode, product.barcode, product.category, product.subCategory]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="jewel-admin-container">
      <div className="jewel-admin-header">
        <h1 className="jewel-admin-title">Manage Product</h1>
        <div className="jewel-admin-actions">
          <div className="jewel-search-box">
            <FiSearch className="jewel-search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="jewel-search-input"
            />
          </div>
          <button
            className="jewel-primary-btn"
            onClick={() => setShowModal(true)}
          >
            <FiPlus className="jewel-btn-icon" /> Add Product
          </button>
        </div>
      </div>

      <div className="jewel-product-table-container">
        <table className="jewel-product-table">
          <thead>
            <tr>
              <th>Item Code</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Variants</th>
              <th>Stock Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <tr key={index}>
                  <td className="jewel-code-cell">{product.itemcode}</td>
                  <td className="jewel-name-cell">
                    {product.images?.length > 0 && (
                      <img 
                        src={`${API_BASE_URL}/images/${product.images[0]}`} 
                        alt={product.name} 
                        className="jewel-product-thumb"
                      />
                    )}
                    {product.name}
                  </td>
                  <td>
                    <div className="jewel-category-badge">
                      {product.category}
                      {product.subcategory && (
                        <span className="jewel-subcategory-badge">{product.subcategory}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="jewel-variants-list">
                      {product.sizes.map((size, idx) => (
                        <div key={idx} className="jewel-variant-item">
                          <span className="jewel-variant-size">{size.size}</span>
                          {size.barcode && (
                            <span className="jewel-variant-barcode">{size.barcode}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>
                    {product.sizes.map((size, idx) => (
                      <div key={idx} className="jewel-stock-indicator">
                        <div className={`jewel-stock-level ${
                          size.stock <= 0 ? 'jewel-out-of-stock' : 
                          size.stock <= size.thresholdStock ? 'jewel-low-stock' : 'jewel-in-stock'
                        }`}>
                          {size.stock <= 0 ? 'Out of stock' : 
                           size.stock <= size.thresholdStock ? 'Low stock' : 'In stock'}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td>
                    <div className="jewel-action-buttons">
                      <button
                        className="jewel-edit-btn"
                        onClick={() => handleEditProduct(index)}
                      >
                        <FiEdit />
                      </button>
                      <button
                        className="jewel-delete-btn"
                        onClick={() => handleDeleteProduct(index)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="jewel-no-products">
                  No products found. Add your first product!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="jewel-modal-overlay">
          <div className="jewel-modal">
            <div className="jewel-modal-header">
              <h2>{isEditing ? "Edit Product" : "Add New Product"}</h2>
              <button className="jewel-modal-close" onClick={resetForm}>
                <FiX />
              </button>
            </div>
            
            <div className="jewel-modal-tabs">
              <button 
                className={`jewel-tab ${activeTab === "details" ? "active" : ""}`}
                onClick={() => setActiveTab("details")}
              >
                Product Details
              </button>
              <button 
                className={`jewel-tab ${activeTab === "variants" ? "active" : ""}`}
                onClick={() => setActiveTab("variants")}
                disabled={!newProduct.itemcode}
              >
                Variants & Pricing
              </button>
              <button 
                className={`jewel-tab ${activeTab === "images" ? "active" : ""}`}
                onClick={() => setActiveTab("images")}
                disabled={!newProduct.itemcode}
              >
                Images
              </button>
            </div>
            
            <div className="jewel-modal-body">
              {activeTab === "details" && (
                <div className="jewel-form-section">
                  <div className="jewel-form-group">
                    <label className="jewel-form-label">Item Code*</label>
                    <input
                      type="text"
                      name="itemcode"
                      placeholder="Enter unique item code"
                      className={`jewel-form-input ${errors.itemcode ? "error" : ""}`}
                      value={newProduct.itemcode}
                      onChange={handleInputChange}
                    />
                    {errors.itemcode && <span className="jewel-error-message">Item code is required</span>}
                  </div>
                  
                  <div className="jewel-form-group">
                    <label className="jewel-form-label">Product Name*</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter product name"
                      className={`jewel-form-input ${errors.name ? "error" : ""}`}
                      value={newProduct.name}
                      onChange={handleInputChange}
                    />
                    {errors.name && <span className="jewel-error-message">Name is required</span>}
                  </div>
                  
                  <div className="jewel-form-group">
                    <label className="jewel-form-label">Description*</label>
                    <textarea
                      name="description"
                      placeholder="Enter product description"
                      className={`jewel-form-textarea ${errors.description ? "error" : ""}`}
                      value={newProduct.description}
                      onChange={handleInputChange}
                      rows="3"
                    />
                    {errors.description && <span className="jewel-error-message">Description is required</span>}
                  </div>
                  
                  <div className="jewel-form-group">
                    <label className="jewel-form-label">Polish Type*</label>
                    <input
                      type="text"
                      name="polish"
                      placeholder="Enter polish type"
                      className={`jewel-form-input ${errors.polish ? "error" : ""}`}
                      value={newProduct.polish}
                      onChange={handleInputChange}
                    />
                    {errors.polish && <span className="jewel-error-message">Polish is required</span>}
                  </div>
                  
                  <div className="jewel-form-row">
                    <div className="jewel-form-group jewel-form-col">
                      <label className="jewel-form-label">Category*</label>
                      <select
                        name="category"
                        className={`jewel-form-select ${errors.category ? "error" : ""}`}
                        value={newProduct.category}
                        onChange={handleCategoryChange}
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.name} value={cat.name}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && <span className="jewel-error-message">Category is required</span>}
                    </div>
                    
                    {subcategories.length > 0 && (
                      <div className="jewel-form-group jewel-form-col">
                        <label className="jewel-form-label">Subcategory</label>
                        <select
                          name="subcategory"
                          className="jewel-form-select"
                          value={newProduct.subcategory}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Subcategory</option>
                          {subcategories.map((subcat, index) => (
                            <option key={index} value={subcat}>
                              {subcat}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  
                  <div className="jewel-form-group">
                    <label className="jewel-form-label">Cost Price (₹)</label>
                    <input
                      type="number"
                      name="costPrice"
                      placeholder="Enter cost price"
                      className="jewel-form-input"
                      value={newProduct.costPrice}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === "variants" && (
                <div className="jewel-form-section">
                  <div className="jewel-variants-header">
                    <h3>Product Variants</h3>
                    <button className="jewel-add-variant-btn" onClick={addSize}>
                      <FiPlus /> Add Variant
                    </button>
                  </div>
                  
                  {newProduct.sizes.length === 0 ? (
                    <div className="jewel-no-variants">
                      <p>No variants added yet. Add your first variant!</p>
                    </div>
                  ) : (
                    <div className="jewel-variants-container">
                      {newProduct.sizes.map((size, index) => (
                        <div key={index} className="jewel-variant-card">
                          <div className="jewel-variant-header">
                            <span className="jewel-variant-number">Variant #{index + 1}</span>
                            <button 
                              className="jewel-remove-variant-btn"
                              onClick={() => removeSize(index)}
                            >
                              <FiX />
                            </button>
                          </div>
                          
                          <div className="jewel-variant-form">
                            <div className="jewel-form-group">
                              <label className="jewel-form-label">Size/Color</label>
                              <input
                                type="text"
                                placeholder="e.g., Small, Gold, etc."
                                className="jewel-form-input"
                                value={size.size}
                                onChange={(e) => updateSize(index, "size", e.target.value)}
                              />
                            </div>
                            
                            <div className="jewel-form-group">
                              <label className="jewel-form-label">Barcode</label>
                              <div className="jewel-barcode-input-group">
                                <input
                                  type="text"
                                  placeholder="Scan or enter barcode"
                                  className="jewel-form-input"
                                  value={size.barcode}
                                  onChange={(e) => updateSize(index, "barcode", e.target.value)}
                                />
                                <button
                                  className="jewel-scan-btn"
                                  onClick={() => toggleBarcodeScanner(index)}
                                >
                                  <FaBarcode />
                                </button>
                              </div>
                            </div>
                            
                            <div className="jewel-form-row">
                              <div className="jewel-form-group jewel-form-col">
                                <label className="jewel-form-label">Retail Price (₹)</label>
                                <input
                                  type="number"
                                  placeholder="Retail price"
                                  className="jewel-form-input"
                                  value={size.retailPrice}
                                  onChange={(e) => updateSize(index, "retailPrice", e.target.value)}
                                />
                              </div>
                              
                              <div className="jewel-form-group jewel-form-col">
                                <label className="jewel-form-label">Wholesale Price (₹)</label>
                                <input
                                  type="number"
                                  placeholder="Wholesale price"
                                  className="jewel-form-input"
                                  value={size.wholesalePrice}
                                  onChange={(e) => updateSize(index, "wholesalePrice", e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="jewel-form-row">
                              <div className="jewel-form-group jewel-form-col">
                                <label className="jewel-form-label">Current Stock</label>
                                <input
                                  type="number"
                                  placeholder="Available quantity"
                                  className="jewel-form-input"
                                  value={size.stock}
                                  onChange={(e) => updateSize(index, "stock", e.target.value)}
                                />
                              </div>
                              
                              <div className="jewel-form-group jewel-form-col">
                                <label className="jewel-form-label">Low Stock Threshold</label>
                                <input
                                  type="number"
                                  placeholder="Minimum stock level"
                                  className="jewel-form-input"
                                  value={size.thresholdStock}
                                  onChange={(e) => updateSize(index, "thresholdStock", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {isBarcodeScanning && (
                    <div className="jewel-barcode-scanner-modal">
                      <div className="jewel-barcode-scanner-container">
                        <h4>Scan Barcode</h4>
                        <BarcodeScannerComponent
                          onUpdate={handleBarcodeScan}
                          width={400}
                          height={300}
                        />
                        <button
                          className="jewel-secondary-btn"
                          onClick={() => setIsBarcodeScanning(false)}
                        >
                          Cancel Scanning
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {activeTab === "images" && (
                <div className="jewel-form-section">
                  <div className="jewel-images-upload">
                    <label className="jewel-image-upload-label">
                      <input
                        type="file"
                        multiple
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="jewel-image-upload-input"
                      />
                      <div className={`jewel-image-upload-box ${errors.images ? "error" : ""}`}>
                        <FiCamera className="jewel-upload-icon" />
                        <span>Click to upload images or drag and drop</span>
                        <span className="jewel-upload-hint">PNG, JPG up to 5MB</span>
                      </div>
                    </label>
                    {errors.images && <span className="jewel-error-message">At least one image is required</span>}
                  </div>
                  
                  {newProduct.images.length > 0 && (
                    <div className="jewel-images-preview">
                      <div className="jewel-images-header">
                        <h4>Product Images ({newProduct.images.length})</h4>
                        <button
                          className="jewel-text-btn danger"
                          onClick={handleDeleteAllImages}
                        >
                          Remove All
                        </button>
                      </div>
                      
                      <div className="jewel-images-grid">
                        {newProduct.images.map((image, index) => (
                          <div key={index} className="jewel-image-item">
                            <img
                              src={image.startsWith("blob:") ? image : `${API_BASE_URL}/images/${image}`}
                              alt={`Product ${index + 1}`}
                              className="jewel-image-thumbnail"
                            />
                            <button
                              className="jewel-image-remove-btn"
                              onClick={() => handleDeleteImage(image)}
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="jewel-modal-footer">
              <button
                className="jewel-secondary-btn"
                onClick={resetForm}
                disabled={loading}
              >
                Cancel
              </button>
              {activeTab !== "details" && (
                <button
                  className="jewel-secondary-btn"
                  onClick={() => setActiveTab(activeTab === "variants" ? "details" : "variants")}
                  disabled={loading}
                >
                  {activeTab === "variants" ? "Back" : "Previous"}
                </button>
              )}
              {activeTab !== "images" ? (
                <button
                  className="jewel-secondary-btn"
                  onClick={() => setActiveTab(activeTab === "details" ? "variants" : "images")}
                  disabled={loading || !newProduct.itemcode}
                >
                  Next
                </button>
              ) : (
                <button
                  className="jewel-primary-btn"
                  onClick={handleSaveProduct}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="jewel-spinner"></span> Processing...
                    </>
                  ) : isEditing ? (
                    "Update Product"
                  ) : (
                    "Save Product"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <ScrollToTopButton />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ProductManagement;