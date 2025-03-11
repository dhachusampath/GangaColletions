const express = require('express');
const {
  addToCart,
  removeFromCart,
  updateQuantity,
  syncCart,
  getCart,
  clearCart,
} = require('../controllers/cartController');

const router = express.Router();

router.post('/add', addToCart);
router.post('/remove', removeFromCart);
router.post('/update', updateQuantity);
router.post('/sync', syncCart);
router.get('/:userId', getCart);
router.delete("/clear-cart", clearCart);


module.exports = router;
