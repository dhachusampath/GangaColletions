const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');

// Get all coupons
router.get('/', couponController.getCoupons);

// Create a new coupon
router.post('/', couponController.createCoupon);

// Update an existing coupon
router.put('/:couponCode', couponController.updateCoupon);

// Delete a coupon
router.delete('/:couponCode', couponController.deleteCoupon);

module.exports = router;
