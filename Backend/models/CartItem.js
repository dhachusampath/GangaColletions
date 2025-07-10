const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the CartItem schema
const CartItemSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        size: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        itemcode: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// Export the model
module.exports = mongoose.model("CartItem", CartItemSchema);
