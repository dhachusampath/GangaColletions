const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  media: [String], // Array of file paths (for images/videos)
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }, // Associated product
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
