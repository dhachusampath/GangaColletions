// routes/reviews.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Review = require('../models/Review');
const Product = require('../models/Product');
const router = express.Router();

// Set up file upload using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // You can change the path as needed
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId });
    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Post a new review
router.post('/:productId', upload.array('media'), async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    const media = req.files.map((file) => file.filename); // Get the file paths from the uploaded files
    const productId = req.params.productId;

    // Create a new review
    const newReview = new Review({
      name,
      rating,
      comment,
      media,
      product: productId, // Associate review with the product
    });

    // Save review in the database
    const savedReview = await newReview.save();

    // Find product and add review to it (assuming Product model has a reviews array)
    const product = await Product.findById(productId);
    product.reviews.push(savedReview._id);
    await product.save();

    res.status(201).json({ message: 'Review submitted successfully', review: savedReview });
  } catch (error) {
    console.error('Error submitting review:', error);
    res.status(500).json({ message: 'Failed to submit review', error: error.message });
  }
});

module.exports = router;
