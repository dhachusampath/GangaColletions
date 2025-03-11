const Order = require('../models/Order');
const Product = require('../models/Product');

// Save Order and Reduce Stock
const saveOrder = async (req, res) => {
  const { orderList } = req.body;

  try {
    for (const item of orderList) {
      const product = await Product.findOne({ itemcode: item.itemcode });
      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);

      if (sizeIndex > -1) {
        product.sizes[sizeIndex].stock -= item.quantity;

        if (product.sizes[sizeIndex].stock < 0) {
          return res.status(400).json({
            message: `Insufficient stock for ${item.name} (${item.size})`,
          });
        }
      }

      await product.save();
    }

    const order = new Order(req.body);
    await order.save();

    res.status(201).json({ message: 'Order saved successfully!' });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({ message: 'Error saving order', error });
  }
};

module.exports = { saveOrder };
