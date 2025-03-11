const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the schema for the CartItem (which represents the cart for a user)
const CartItemSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Assuming you have a User model
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product', // Assuming you have a Product model
          required: true,
        },
        size: {
          type: String, // or String[] if multiple sizes are possible
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
          required:true,
        } ,
        name: {
          type: String,
          required:true,
        },  
      },
    ],
  },
  { timestamps: true }
);

// Create and export the CartItem model
const CartItem = mongoose.model('CartItem', CartItemSchema);

module.exports = CartItem;
