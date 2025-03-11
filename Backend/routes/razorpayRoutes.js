// routes/razorpayRoutes.js
const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/razorpayController');

// Create an order
router.post('/create-order', razorpayController.createOrder);

// Verify payment
router.post('/verify-payment', razorpayController.verifyPayment);

module.exports = router;