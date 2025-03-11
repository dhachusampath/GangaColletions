const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], required: true },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  amount: { type: Number, required: true },  // Amount threshold to apply coupon
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;
