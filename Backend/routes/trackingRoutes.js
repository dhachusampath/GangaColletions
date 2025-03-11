const express = require('express');
const multer = require('multer');
const Order = require('../models/Order');

const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save images in "uploads" folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/update-tracking', upload.single('trackingImage'), async (req, res) => {
  try {
    const { orderId, trackingNumber, trackingLink, status } = req.body;
    const trackingImage = req.file ? `/uploads/${req.file.filename}` : null;

    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.trackingNumber = trackingNumber;
    order.trackingLink = trackingLink;
    order.deliveryStatus = status;
    if (trackingImage) {
      order.trackingImage = trackingImage;
    }

    await order.save();
    res.json({ message: 'Tracking updated successfully', order });
  } catch (error) {
    console.error('Error updating tracking:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch tracking details by orderId
router.get("/track/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({
      userId: order.userId,
      deliveryStatus: order.deliveryStatus,
      trackingLink: order.trackingLink || "",
      trackingNumber: order.trackingNumber || "",
      status: order.status,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error("Error fetching tracking info:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;


module.exports = router;
