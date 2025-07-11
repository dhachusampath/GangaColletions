const express = require("express");
const Order = require("../models/Billingorder");

const router = express.Router();

// ✅ Create a new order
router.post("/", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!" });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ message: "Error placing order", error });
  }
});

// ✅ Fetch all orders (Admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Error fetching orders", error });
  }
});

module.exports = router;
