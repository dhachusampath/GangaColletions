const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({

  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  razorpay_order_id: String,
  razorpay_payment_id: String,
  razorpay_signature: String,
  orderId: String,
  cartItems: Array,
  shippingAddress: Object,
  billingAddress: Object,
  paymentMethod: String,
  totalAmount: Number,
  trackingNumber: String,
  deliveryStatus: { type: String, default: "Processing" }, // Store status
  trackingLink: { type: String, default: "" }, // Store tracking URL
  status: { type: String, default: "Pending" }, // "Pending", "Success", "Failed"
  createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('Order', orderSchema);
