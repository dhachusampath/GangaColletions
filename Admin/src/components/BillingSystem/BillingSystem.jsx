import React, { useState, useEffect } from 'react';
import "./BillingSystem.css";
import { useStore } from '../Context/Store';
import BarcodeScannerComponent from "react-qr-barcode-scanner"; // Barcode scanner component
import { Trash ,Eye, EyeSlash  } from 'phosphor-react';
import BillTemplate from './BillTemplate';
import html2pdf from "html2pdf.js";

const BillingSystem = () => {
  const { products, setProducts ,API_BASE_URL } = useStore();
  const [orderList, setOrderList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [isBarcodeMode, setIsBarcodeMode] = useState(false);
  const [showBill, setShowBill] = useState(false); // Initially hide the bill
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    address: '',
    phone: '',
    paymentMethod: 'Cash'
  });
  const [isBarcodeScanning, setIsBarcodeScanning] = useState(false); // State to handle barcode scanning mode
  const [isMobile, setIsMobile] = useState(false); // State to determine if the device is mobile
  const [selectedSizes, setSelectedSizes] = useState({}); // State to track selected size per product
  const [totalDiscount, setTotalDiscount] = useState(0); // State for total discount percentage
  const [errors, setErrors] = useState({}); // State to track validation errors

  useEffect(() => {
    // Detect if the screen width is mobile or desktop
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Consider 768px and below as mobile
    };

    checkIfMobile(); // Check on initial render

    window.addEventListener('resize', checkIfMobile); // Check on window resize

    return () => window.removeEventListener('resize', checkIfMobile); // Cleanup on unmount
  }, []);

  // Validate Phone Number
  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^\d{10}$/; // 10-digit phone number
    return phoneRegex.test(phone);
  };

  // Validate Discount (0–100)
  const validateDiscount = (discount) => {
    return discount >= 0 && discount <= 100;
  };

  // Validate Quantity (positive number and within stock limit)
  const validateQuantity = (quantity, stock) => {
    return quantity > 0 && quantity <= stock;
  };

  // Add Product to Order List
  const addToOrder = (product, sizeDetails, quantity, priceType) => {
    if (!validateQuantity(quantity, sizeDetails.stock)) {
      alert(`Invalid quantity for ${product.name} (${sizeDetails.size}). Available stock: ${sizeDetails.stock}`);
      return;
    }
  
    const price = priceType === 'retail' ? sizeDetails.retailPrice : sizeDetails.wholesalePrice;
  
    setOrderList((prevList) => [
      ...prevList,
      {
        ...product,
        size: sizeDetails.size,
        sizeIndex: product.sizes.findIndex((s) => s.size === sizeDetails.size),
        quantity,
        priceType, // Track whether retail or wholesale price is selected
        price, // Use the selected price type
        discount: 0, // Default discount is 0%
        totalPrice: price * quantity, // Initial total price without discount
        newStock: sizeDetails.stock - quantity, // Calculate new stock
      },
    ]);
    setSearchQuery("");
  };
 
  // Handle Quantity Change
  const handleQuantityChange = (index, quantity) => {
    const updatedOrderList = [...orderList];
    if (!validateQuantity(quantity, updatedOrderList[index].newStock + updatedOrderList[index].quantity)) {
      alert(`Invalid quantity. Available stock: ${updatedOrderList[index].newStock + updatedOrderList[index].quantity}`);
      return;
    }
    updatedOrderList[index].quantity = quantity;
    const discount = updatedOrderList[index].discount || 0;
    updatedOrderList[index].totalPrice =
      updatedOrderList[index].price * quantity * (1 - discount / 100);
    setOrderList(updatedOrderList);
  };

  // Handle Discount Change for Individual Items
  const handleDiscountChange = (index, discount) => {
    if (!validateDiscount(discount)) {
      alert('Discount must be between 0 and 100.');
      return;
    }
    const updatedOrderList = [...orderList];
    updatedOrderList[index].discount = discount;
    updatedOrderList[index].totalPrice =
      updatedOrderList[index].price * updatedOrderList[index].quantity * (1 - discount / 100);
    setOrderList(updatedOrderList);
  };

  // Handle Total Discount Change
  const handleTotalDiscountChange = (discount) => {
    if (!validateDiscount(discount)) {
      alert('Total discount must be between 0 and 100.');
      return;
    }
    setTotalDiscount(discount);
  };

  // Calculate Subtotal (Sum of all item prices)
  const calculateSubtotal = () => {
    return orderList.reduce((acc, item) => acc + item.totalPrice, 0);
  };

  // Calculate Final Total After Applying Total Discount
  const calculateFinalTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal * (1 - totalDiscount / 100);
  };

  // Handle Barcode Scan
  const handleBarcodeScan = (result) => {
    if (result) {
      setScannedBarcode(result.text); // Update the barcode input with scanned value
      let productFound = false;

      // Search for the product by barcode
      products.forEach((product) => {
        const sizeDetails = product.sizes.find((size) => size.barcode === result.text);
        if (sizeDetails) {
          addToOrder(product, sizeDetails, 1); // Add with default quantity of 1
          productFound = true;
        }
      });

      if (!productFound) {
        alert('Product not found for this barcode.');
      }

      // Close the barcode scanner on mobile after successful scan
      if (isMobile) {
        setIsBarcodeMode(false); // Hide the barcode scanner
      }
    }
  };

  // Handle Product Search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.itemcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sizes.some(size => size.barcode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Validate Customer Information
  const validateCustomerInfo = () => {
    const errors = {};
    if (!customerInfo.name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!customerInfo.address.trim()) {
      errors.address = 'Address is required.';
    }
    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required.';
    } else if (!validatePhoneNumber(customerInfo.phone)) {
      errors.phone = 'Invalid phone number. Must be 10 digits.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  // Handle Bill Submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission from refreshing the page
  
    if (orderList.length === 0) {
      alert("Order list is empty. Add products to proceed.");
      return;
    }
  
    if (!validateCustomerInfo()) {
      return; // Stop if customer info is invalid
    }
  
    const finalTotal = calculateFinalTotal();
  
    const orderData = {
      customerInfo,
      orderList,
      totalDiscount,
      finalTotal,
      date: new Date().toISOString(),
    };
  
    try {
      // Save order to backend
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message);
  
        // Update backend stock for each product in the order
        await Promise.all(
          orderList.map((item) =>
            fetch(`${API_BASE_URL}/products/update-stock/${item.itemcode}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                sizeIndex: item.sizeIndex,
                newStock: item.newStock,
              }),
            })
          )
        );
  
        // Show the bill
        setShowBill(true);
  
        // Delay PDF generation to ensure bill is rendered
        setTimeout(() => {
          const element = document.querySelector(".bill-template-container");
          if (element) {
            const options = {
              margin: 10,
              filename: `invoice_${customerInfo.name}.pdf`,
              image: { type: "jpeg", quality: 0.98 },
              html2canvas: { scale: 2 },
              jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };
            html2pdf().from(element).set(options).save();
          }
        }, 1000);
  
        // Clear local state AFTER PDF generation
        setTimeout(() => {
          setOrderList([]);
          setCustomerInfo({
            name: "",
            address: "",
            phone: "",
            paymentMethod: "Cash",
          });
          setTotalDiscount(0); // Reset total discount
  
          // Reduce stock locally
          setProducts((prevProducts) =>
            prevProducts.map((product) => {
              const updatedSizes = product.sizes.map((size) => {
                const orderItem = orderList.find(
                  (item) => item.itemcode === product.itemcode && item.size === size.size
                );
                return orderItem
                  ? { ...size, stock: size.stock - orderItem.quantity }
                  : size;
              });
              return { ...product, sizes: updatedSizes };
            })
          );
        }, 2000); // Clear data AFTER ensuring PDF is downloaded
  
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("Error submitting order. Please try again.");
    }
  };
  

  // Remove Item from Order List
  const removeItemFromOrder = (index) => {
    setOrderList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Handle Size Change
  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  return (
    <div className="billing-system">
      {/* Search and Barcode Mode Toggle */}
      <div className="search-barcode-toggle">
        <input
          type="text"
          placeholder="Search Product"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isBarcodeMode}
        />
        <button onClick={() => setIsBarcodeMode(!isBarcodeMode)}>
          {isBarcodeMode ? 'Switch to Search Mode' : 'Switch to Barcode Mode'}
        </button>
      </div>

      {/* Mobile Camera Barcode Scanner (Visible Only on Mobile) */}
      {isBarcodeMode && isMobile && (
        <div className="barcode-scanner">
          <input
            type="text"
            placeholder="Scan Barcode"
            value={scannedBarcode}
            onChange={(e) => setScannedBarcode(e.target.value)}
          />
          <BarcodeScannerComponent
            onUpdate={(_, result) => handleBarcodeScan(result)}
            width={300}
            height={200}
          />
        </div>
      )}

      {/* External Barcode Scanner (Visible Only on Desktop) */}
      {isBarcodeMode && !isMobile && (
        <div className="barcode-scanner-desktop">
          <input
            type="text"
            placeholder="Scan Barcode"
            value={scannedBarcode}
            onChange={(e) => setScannedBarcode(e.target.value)}
          />
        </div>
      )}

      {/* Product List (Only shows after searching) */}
      {searchQuery && !isBarcodeMode && (
        <div className="product-list">
          <ul>
          {filteredProducts.map((product) => (
  <li key={product.itemcode} className="product-item">
    <span>{product.itemcode}</span>
    <span>{product.name}</span>
    <span>Description: {product.description}</span>
    <span>Polish: {product.polish}</span>
    <span>Category: {product.category}</span>
    <span>Subcategory: {product.subcategory}</span>

    {/* Size Selection */}
    <select
      value={selectedSizes[product.itemcode] || product.sizes[0]?.size}
      onChange={(e) =>
        handleSizeChange(product.itemcode, e.target.value)
      }
    >
      {product.sizes.map((size) => (
        <option key={size.size} value={size.size}>
          {size.size} - ₹{size.retailPrice} (Retail) / ₹{size.wholesalePrice} (Wholesale)
        </option>
      ))}
    </select>

    {/* Price Type Selection */}
    <select
      value={selectedSizes[product.itemcode] ? selectedSizes[product.itemcode].priceType : 'retail'}
      onChange={(e) =>
        handleSizeChange(product.itemcode, {
          ...selectedSizes[product.itemcode],
          priceType: e.target.value,
        })
      }
    >
      <option value="retail">Retail Price</option>
      <option value="wholesale">Wholesale Price</option>
    </select>

    {/* Add to Order */}
    <button
      onClick={() => {
        const selectedSize = product.sizes.find(
          (size) => size.size === selectedSizes[product.itemcode]?.size
        ) || product.sizes[0];
        const priceType = selectedSizes[product.itemcode]?.priceType || 'retail';
        addToOrder(product, selectedSize, 1, priceType);
      }}
      className="add-to-order-btn"
    >
      Add to Order
    </button>
  </li>
))}
          </ul>
        </div>
      )}

      {/* Order List */}
      <div className="order-list">
        <h3>Order List</h3>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price Type</th>
              <th>Price</th>
              <th>Discount (%)</th>
              <th>Total Price</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
          {orderList.map((item, index) => (
  <tr key={index}>
    <td>{item.name}</td>
    <td>{item.size}</td>
    <td>
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
        className="quantity-input"
      />
    </td>
    <td>
      <select
        value={item.priceType}
        onChange={(e) => {
          const updatedOrderList = [...orderList];
          updatedOrderList[index].priceType = e.target.value;
          updatedOrderList[index].price =
            e.target.value === 'retail'
              ? item.sizes.find((s) => s.size === item.size).retailPrice
              : item.sizes.find((s) => s.size === item.size).wholesalePrice;
          updatedOrderList[index].totalPrice =
            updatedOrderList[index].price * updatedOrderList[index].quantity * (1 - item.discount / 100);
          setOrderList(updatedOrderList);
        }}
      >
        <option value="retail">Retail Price</option>
        <option value="wholesale">Wholesale Price</option>
      </select>
    </td>
    <td>₹{item.price}</td>
    <td>
      <input
        type="number"
        value={item.discount}
        onChange={(e) => handleDiscountChange(index, parseFloat(e.target.value))}
        className="discount-input"
      />
    </td>
    <td>₹{item.totalPrice.toFixed(2)}</td>
    <td>
      <Trash
        size={20}
        color="red"
        weight="bold"
        onClick={() => removeItemFromOrder(index)}
        className="remove-icon"
      />
    </td>
  </tr>
))}
          </tbody>
        </table>
        <div className="total">
          Subtotal: ₹{calculateSubtotal().toFixed(2)}
        </div>
        <div className="total-discount">
          <label>Total Discount (%):</label>
          <input
            type="number"
            value={totalDiscount}
            onChange={(e) => handleTotalDiscountChange(parseFloat(e.target.value))}
            className="total-discount-input"
          />
        </div>
        <div className="final-total">
          Final Total: ₹{calculateFinalTotal().toFixed(2)}
        </div>
      </div>

      {/* Customer Information */}
      <div className="customer-info">
        <h3>Customer Information</h3>
        <input
          type="text"
          placeholder="Name"
          value={customerInfo.name}
          onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
        />
        {errors.name && <span className="error">{errors.name}</span>}
        <input
          type="text"
          placeholder="Address"
          value={customerInfo.address}
          onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
        />
        {errors.address && <span className="error">{errors.address}</span>}
        <input
          type="text"
          placeholder="Phone"
          value={customerInfo.phone}
          onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
        />
        {errors.phone && <span className="error">{errors.phone}</span>}
        <select
          value={customerInfo.paymentMethod}
          onChange={(e) => setCustomerInfo({ ...customerInfo, paymentMethod: e.target.value })}
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="UPI">UPI</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="buttons-collections" style={{display:"flex"}}>
      <button className="download-bill-btn" onClick={handleSubmit}>
        Submit
      </button>
      <button 
      className="toggle-bill-btn" 
      onClick={() => setShowBill(!showBill)}
    >
      {showBill ? <EyeSlash size={20} /> : <Eye size={20} />}
      {showBill ? " Hide Bill Preview" : " Show Bill Preview"}
    </button>
      </div>
      {showBill && (
        <BillTemplate
          orderList={orderList}
          customerInfo={customerInfo}
          totalDiscount={totalDiscount}
          finalTotal={calculateFinalTotal()}
        />
      )}
    </div>
  );
};

export default BillingSystem;