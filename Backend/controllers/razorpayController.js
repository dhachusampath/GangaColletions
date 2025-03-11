// controllers/razorpayController.js
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: 'YOUR_KEY_ID', // Replace with your Razorpay Key ID
  key_secret: 'YOUR_KEY_SECRET', // Replace with your Razorpay Key Secret
});

// Create an order
exports.createOrder = async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // Amount in paise (e.g., 50000 = ₹500)
    currency: 'INR',
    receipt: 'order_receipt_1',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  const { order_id, payment_id, signature } = req.body;

  const hmac = crypto.createHmac('sha256', razorpay.key_secret);
  hmac.update(order_id + '|' + payment_id);
  const generatedSignature = hmac.digest('hex');

  if (generatedSignature === signature) {
    res.json({ success: true, message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Payment verification failed' });
  }
};