const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  customerInfo: {
    name: String,
    address: String,
    phone: String,
    paymentMethod: String,
  },
  orderList: [
    {
      itemcode: String,
      name: String,
      size: String,
      quantity: Number,
      price: Number,
    },
  ],
  totalDiscount: Number,
  finalTotal: Number,
  date: String,
});

module.exports = mongoose.model("BillingOrder", OrderSchema);
