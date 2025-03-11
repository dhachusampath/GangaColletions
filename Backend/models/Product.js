const mongoose = require('mongoose');

// Define the sizes schema with itemcode and separate barcode
const sizeSchema = new mongoose.Schema({
  size: { type: String, required: true },
  barcode: { type: String, required: true }, // Separate barcode for each size
  retailPrice: { type: Number, required: true },
  wholesalePrice: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  thresholdStock: { type: Number, required: false }, // Optional field
});

// Define the product schema
const productSchema = new mongoose.Schema({
  itemcode: { type: String, required: true }, 
  name: { type: String, required: true },
  description: { type: String, required: false },
  polish: { type: String, required: false },
  category: { type: String, required: true },
  subcategory: { type: String, required: false },
  costPrice: { type: Number, required: false },
  images: { type: [String], required: false }, // Store image file paths as strings
  sizes: { type: [sizeSchema], required: false },
  isPopular: { type: Boolean, default: false }, // New field for popular products
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Array to store review IDs
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
