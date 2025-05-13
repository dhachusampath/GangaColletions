const express = require('express');
const upload = require('../middlewares/upload');  // Import the image upload configuration
const Product = require('../models/Product');
const router = express.Router();
const path = require("path");
const fs = require('fs');

// Add a new product
router.post('/add', upload.array('newImages', 3), async (req, res) => {
  try {
    const {itemcode, name, description,polish, category, subcategory, costPrice, sizes } = req.body;

    // Save only the file name instead of the full path
    const images = req.files ? req.files.map(file => file.filename) : [];

    const newProduct = new Product({
      itemcode,
      name,
      description,
      category,
      subcategory,
      polish,
      costPrice,
      images,
      sizes: JSON.parse(sizes),
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


router.put('/update/:id', upload.array('newImages', 3), async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      polish,
      subcategory,
      costPrice,
      sizes,
      existingImages,
      deletedImages,
    } = req.body;

    // Parse the existing images and deleted images from the request body
    const existingImagesList = existingImages ? JSON.parse(existingImages) : [];
    const deletedImagesList = deletedImages ? JSON.parse(deletedImages) : [];

    // Get the new images uploaded in the request
    const newImages = req.files ? req.files.map((file) => file.filename) : [];

    // Remove deleted images from the existing images list
    const updatedImages = existingImagesList.filter(
      (image) => !deletedImagesList.includes(image)
    );

    // Add new images to the updated images list
    updatedImages.push(...newImages);

    // Delete the unnecessary images from the upload folder
    deletedImagesList.forEach((image) => {
      const imagePath = path.join(__dirname, '../uploads', image); // Replace with your upload folder path
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) {
            console.error(`Error deleting image: ${image}`, err);
          } else {
            console.log(`Deleted image: ${image}`);
          }
        });
      }
    });

    // Update the product with the new details
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        category,
        subcategory,
        costPrice,
        polish,
        images: updatedImages, // Save the merged list of images
        sizes: sizes ? JSON.parse(sizes) : [], // Parse sizes if provided
      },
      { new: true } // Return the updated product
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
});

router.get('/product/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching product details' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an existing product
router.put("/update-stock/:itemcode", async (req, res) => {
  const { itemcode } = req.params;
  const { sizeIndex, newStock } = req.body;

  try {
    // Find product by itemcode
    const product = await Product.findOne({ itemcode });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if sizeIndex is valid
    if (sizeIndex < 0 || sizeIndex >= product.sizes.length) {
      return res.status(400).json({ message: "Invalid size index" });
    }

    // Update the stock for the specific size
    product.sizes[sizeIndex].stock = newStock;

    // Save the updated product
    await product.save();

    res.json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating stock:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/update-thresholds", async (req, res) => {
  const { products } = req.body; // Expects updated products array from the frontend

  try {
    // Validate the products array
    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: "Invalid products array provided." });
    }

    // Generate bulk write operations for all products and their sizes
    const updateOperations = [];
    products.forEach((product) => {
      product.sizes.forEach((size) => {
        updateOperations.push({
          updateOne: {
            filter: { id: product.id, "sizes.size": size.size }, // Match by product ID and size
            update: { $set: { "sizes.$.thresholdStock": size.thresholdStock } }, // Update thresholdStock
          },
        });
      });
    });

    // Perform the bulkWrite operation
    if (updateOperations.length > 0) {
      await Product.bulkWrite(updateOperations);
    }

    res.status(200).json({ message: "Thresholds updated successfully!" });
  } catch (error) {
    console.error("Error updating thresholds:", error);
    res.status(500).json({ message: "Error updating thresholds", error });
  }
});

router.post('/popular/:itemcode', async (req, res) => {
  try {
    const { itemcode } = req.params;
    const product = await Product.findOne({ itemcode }); // Replace with your schema and query

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update or add to a "popular" field/collection
    product.isPopular = true; // Example logic
    await product.save();

    res.status(200).json({ message: "Product added to popular list" });
  } catch (error) {
    console.error("Error adding to popular products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete('/popular/:itemcode', async (req, res) => {
  try {
    const { itemcode } = req.params;
    const product = await Product.findOne({ itemcode });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.isPopular = false;
    await product.save();

    res.status(200).json({ message: "Product removed from popular list" });
  } catch (err) {
    res.status(500).json({ message: "Error removing product from popular list", error: err });
  }
});

router.get('/popular', async (req, res) => {
  try {
    const popularProducts = await Product.find({ isPopular: true });
    res.status(200).json(popularProducts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching popular products", error: err });
  }
});

// Delete a product
router.delete('/delete/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;