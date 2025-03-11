const Coupon = require('../models/Coupon');

// Get all coupons
exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving coupons' });
  }
};

// Create a new coupon
exports.createCoupon = async (req, res) => {
  const { couponCode, discountType, discountValue, expiryDate, amount } = req.body;

  try {
    const newCoupon = new Coupon({
      couponCode,
      discountType,
      discountValue,
      expiryDate,
      amount,
    });

    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created', coupon: newCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Error creating coupon' });
  }
};

// Update an existing coupon
exports.updateCoupon = async (req, res) => {
  const { couponCode } = req.params;
  const { discountType, discountValue, expiryDate, amount } = req.body;

  try {
    const updatedCoupon = await Coupon.findOneAndUpdate(
      { couponCode },
      { discountType, discountValue, expiryDate, amount },
      { new: true }
    );

    if (!updatedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon updated', coupon: updatedCoupon });
  } catch (error) {
    res.status(500).json({ message: 'Error updating coupon' });
  }
};

// Delete a coupon
exports.deleteCoupon = async (req, res) => {
  const { couponCode } = req.params;

  try {
    const deletedCoupon = await Coupon.findOneAndDelete({ couponCode });

    if (!deletedCoupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    res.json({ message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting coupon' });
  }
};
