const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Identifier for the counter (e.g., "productId")
  seq: { type: Number, required: true, default: 0 },   // The current sequence number
});

const Counter = mongoose.model('Counter', counterSchema);
module.exports = Counter;
