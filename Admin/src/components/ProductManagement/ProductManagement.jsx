import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductManagement.css";
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import axios from "axios";
import { useStore } from "../Context/Store";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";

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
const API_BASE_URL ="http://localhost:5000/api"
const ProductManagement = () => {
  const { products, setProducts,   } = useStore();
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
  const [newImageFiles, setNewImageFiles] = useState([]); // Track newly uploaded files
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

  // Handle barcode scan
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
    axios.get(`${API_BASE_URL}/api/products`)
      .then((res) => {
        console.log("Fetched products:", res.data);
        setProducts(res.data || []);  // Ensure it's always an array
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Toggle barcode scanner
  const toggleBarcodeScanner = (index) => {
    setIsBarcodeScanning(!isBarcodeScanning);
    setSizeIndexToScan(index);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => {
      console.log("Preserving images during input change:", prevProduct.images); // Debugging
      return {
        ...prevProduct,
        [name]: value,
        images: prevProduct.images, // Preserve the images array
      };
    });
    setErrors({ ...errors, [name]: !value });
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const category = categories.find((cat) => cat.name === selectedCategory);
    setNewProduct((prevProduct) => {
      console.log("Preserving images during category change:", prevProduct.images); // Debugging
      return {
        ...prevProduct,
        category: selectedCategory,
        subcategory: "",
        images: prevProduct.images, // Preserve the images array
      };
    });
    setSubcategories(category ? category.subcategories : []);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
  
    // Store the new files in the state
    setNewImageFiles(files);
  
    // Create temporary URLs for preview
    const imageUrls = files.map((file) => URL.createObjectURL(file));
  
    // Append new image URLs to the existing images
    setNewProduct((prevProduct) => {
      console.log("Preserving images during image upload:", prevProduct.images); // Debugging
      return {
        ...prevProduct,
        images: [...prevProduct.images, ...imageUrls], // Preserve existing images
      };
    });
  
    setErrors({ ...errors, images: false });
  };

  // Add size
  const addSize = () => {
    setNewProduct((prevProduct) => {
      console.log("Preserving images during add size:", prevProduct.images); // Debugging
      return {
        ...prevProduct,
        sizes: [
          ...prevProduct.sizes,
          { size: "", barcode: "", retailPrice: "", wholesalePrice: "", stock: "", thresholdStock: "" },
        ],
        images: prevProduct.images, // Preserve the images array
      };
    });
  };
  
  const removeSize = (index) => {
    setNewProduct((prevProduct) => {
      console.log("Preserving images during remove size:", prevProduct.images); // Debugging
      return {
        ...prevProduct,
        sizes: prevProduct.sizes.filter((_, i) => i !== index),
        images: prevProduct.images, // Preserve the images array
      };
    });
  };
  

  // Update size
  const updateSize = (index, key, value) => {
    setNewProduct((prevProduct) => {
      console.log("Preserving images during size update:", prevProduct.images); // Debugging
      const updatedSizes = prevProduct.sizes.map((size, i) =>
        i === index ? { ...size, [key]: value } : size
      );
      return {
        ...prevProduct,
        sizes: updatedSizes,
        images: prevProduct.images, // Preserve the images array
      };
    });
  };

  // Validate form
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

  // Delete an image
  const handleDeleteImage = (image) => {
    if (image.startsWith("blob:")) {
      // Remove the image from the newImageFiles array
      const updatedNewImageFiles = newImageFiles.filter(
        (file) => URL.createObjectURL(file) !== image
      );
      setNewImageFiles(updatedNewImageFiles);
    } else {
      // Add the deleted image to the deletedImages array
      setDeletedImages((prev) => [...prev, image]);
    }
  
    // Remove the image from the current product's images
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: prevProduct.images.filter((img) => img !== image),
    }));
  };

  // Delete all images
  const handleDeleteAllImages = () => {
    setDeletedImages((prev) => [...prev, ...newProduct.images]);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      images: [],
    }));
    setNewImageFiles([]);
  };

  // Save product
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
  
    // Preserve existing images
    let existingImages = newProduct.images?.filter((img) => img.startsWith("http") || img.endsWith(".png") || img.endsWith(".jpg"));
    
    if (existingImages.length > 0) {
      console.log("Existing Images Preserved:", existingImages);
      formData.append("existingImages", JSON.stringify(existingImages));
    }
  
    // Append new image files (uploaded images)
    if (newImageFiles && newImageFiles.length > 0) {
      newImageFiles.forEach((file) => formData.append("newImages", file));
      console.log("New Images Added:", newImageFiles);
    }
  
    // Append deleted images (images to be removed)
    if (deletedImages && deletedImages.length > 0) {
      formData.append("deletedImages", JSON.stringify(deletedImages));
    }
  
    try {
      let response;
  
      if (isEditing) {
        response = await axios.put(
          `${API_BASE_URL}/products/update/${products[editIndex]._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
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
  
  

  // Edit product
  const handleEditProduct = (index) => {
    const productToEdit = products[index];
  
    setIsEditing(true);
    setEditIndex(index);
  
    setNewProduct({
      ...productToEdit,
      images: productToEdit.images ? [...productToEdit.images] : [], // Preserve existing images
    });
  
    console.log("Preserving images during edit:", productToEdit.images); // Debugging
    setShowModal(true);
  };
  
  

  // Delete product
  const handleDeleteProduct = async (index) => {
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
  };

  // Reset form
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
  };

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    [product.name, product.itemcode, product.barcode, product.category, product.subCategory]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="pm-container">
      <header className="pm-header">
        <h1 className="pm-title">Product Management</h1>
        <div className="pm-header-actions">
          <input
            className={`pm-search-input ${errors.searchTerm ? "pm-input-error" : ""}`}
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="pm-add-product-btn"
            onClick={() => setShowModal(true)}
          >
            Add Product
          </button>
        </div>
      </header>

      <table className="pm-product-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Variants</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.itemcode}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>
                {product.sizes.map((size, idx) => (
                  <div key={idx}>
                    {size.size} - {size.stock} in stock
                  </div>
                ))}
              </td>
              <td>
                <button
                  className="pm-edit-btn"
                  onClick={() => handleEditProduct(index)}
                >
                  Edit
                </button>
                <button
                  className="pm-delete-btn"
                  onClick={() => handleDeleteProduct(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="pm-modal">
          <div className="pm-modal-content">
            <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
            <input
              type="text"
              name="itemcode"
              placeholder="Item Code"
              className={`pm-input ${errors.itemcode ? "pm-input-error" : ""}`}
              value={newProduct.itemcode}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              className={`pm-input ${errors.name ? "pm-input-error" : ""}`}
              value={newProduct.name}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              placeholder="Description"
              className={`pm-textarea ${errors.description ? "pm-input-error" : ""}`}
              value={newProduct.description}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="polish"
              placeholder="Polish"
              className={`pm-input ${errors.polish ? "pm-input-error" : ""}`}
              value={newProduct.polish}
              onChange={handleInputChange}
            />
            <select
              name="category"
              className={`pm-input ${errors.category ? "pm-input-error" : ""}`}
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

            {subcategories.length > 0 && (
              <select
                name="subcategory"
                className="pm-input"
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
            )}
            <input
              type="number"
              name="costPrice"
              placeholder="Cost Price"
              className={`pm-input ${errors.costPrice ? "pm-input-error" : ""}`}
              value={newProduct.costPrice}
              onChange={handleInputChange}
            />

            <h3>Upload Images</h3>
            <input
              type="file"
              multiple
              className={`pm-image-input ${errors.images ? "pm-input-error" : ""}`}
              onChange={handleImageUpload}
              accept="image/*"
            />
            {newProduct.images.length > 0 && (
              <div className="pm-image-preview">
                <h4>Uploaded Images:</h4>
                {newProduct.images.map((image, index) => (
                  <div key={index} className="pm-image-item">
                    <img
                      src={image.startsWith("blob:") ? image : `${API_BASE_URL}/images/${image}`}
                      alt={`Product Image ${index + 1}`}
                      className="pm-image-thumbnail"
                    />
                    {/* <button
                      className="pm-remove-image-btn"
                      type="button"
                      onClick={() => handleDeleteImage(image)}
                    >
                      Delete
                    </button> */}
                  </div>
                ))}
                <button
                  className="pm-delete-all-images-btn"
                  type="button"
                  onClick={handleDeleteAllImages}
                >
                  Delete Images
                </button>
              </div>
            )}

            <h3>Variants</h3>
            <button className="pm-add-size-btn" onClick={addSize}>
              Add Variants
            </button>
            {newProduct.sizes.map((size, index) => (
              <div key={index} className="pm-size-entry">
                <div className="pm-serial-number">{index + 1}</div>
                <input
                  type="text"
                  placeholder="Size or Color"
                  className="pm-size-input"
                  value={size.size}
                  onChange={(e) => updateSize(index, "size", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Barcode"
                  id={`barcode-${index}`}
                  className="pm-size-input"
                  value={size.barcode}
                  onChange={(e) => updateSize(index, "barcode", e.target.value)}
                />
                <button
                  className="pm-remove-size-btn"
                  onClick={() => toggleBarcodeScanner(index)}
                >
                  {isBarcodeScanning && sizeIndexToScan === index
                    ? "Stop Scanning"
                    : "Scan Barcode"}
                </button>
                {isBarcodeScanning && (
                  <BarcodeScannerComponent
                    onUpdate={handleBarcodeScan}
                    width={300}
                    height={200}
                  />
                )}
                <input
                  type="number"
                  placeholder="Retail Price"
                  className="pm-size-input"
                  value={size.retailPrice}
                  onChange={(e) => updateSize(index, "retailPrice", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Wholesale Price"
                  className="pm-size-input"
                  value={size.wholesalePrice}
                  onChange={(e) => updateSize(index, "wholesalePrice", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  className="pm-size-input"
                  value={size.stock}
                  onChange={(e) => updateSize(index, "stock", e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Threshold Stock"
                  className="pm-size-input"
                  value={size.thresholdStock}
                  onChange={(e) => updateSize(index, "thresholdStock", e.target.value)}
                />
                <button
                  className="pm-remove-size-btn"
                  onClick={() => removeSize(index)}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              className="pm-save-btn"
              onClick={handleSaveProduct}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="pm-loading-spinner"></span> Processing...
                </>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </button>
            <button className="pm-cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}
      <ScrollToTopButton />
      <ToastContainer />
    </div>
  );
};

export default ProductManagement;