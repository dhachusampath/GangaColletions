const express = require("express");
const Order = require("../models/Billingorder");

const router = express.Router();

// Create a new order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.json({ message: "Order placed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
});

// Fetch all orders (for Admin Panel)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();  // Fetch all orders
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

module.exports = router;
