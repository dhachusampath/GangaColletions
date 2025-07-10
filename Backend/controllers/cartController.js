const CartItem = require("../models/CartItem");

// Add to Cart
exports.addToCart = async (req, res) => {
  const { userId, productId, size, price, name, image, itemcode } = req.body;

  try {
    
    let cart = await CartItem.findOne({ userId });

    if (!cart) {
      // Create a new cart for the user if it doesn't exist
      cart = new CartItem({ userId, items: [] });
    }

    // Check if the item with the same productId and size exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1; // Increment the quantity of the existing item
      existingItem.price = price; // Optionally update the price
      existingItem.name = name; // Update name if necessary
      existingItem.image = image; // Update image if necessary
      await cart.save();
      return res.status(200).json({
        message: "Item quantity updated",
        item: existingItem,
      });
    }

    // If item doesn't exist, add a new item to the cart
    const newItem = {
      productId,
      size,
      quantity: 1,
      price,
      name, // Include name
      image, // Include image
      itemcode,
    };
    cart.items.push(newItem);
    await cart.save();

    res.status(201).json({ message: "Item added to cart", item: newItem });
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ message: "Error adding item to cart", error });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  const { userId, productId, size } = req.body;

  try {
    const cart = await CartItem.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for user" });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => !(item.productId.toString() === productId && item.size === size)
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ message: "Error removing item from cart", error });
  }
};

// Update Quantity
exports.updateQuantity = async (req, res) => {
  const { userId, productId, size, quantity } = req.body;

  try {
    const cart = await CartItem.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found for user" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId && item.size === size
    );

    if (item) {
      if (quantity <= 0) {
        // Remove the item if quantity is 0 or less
        cart.items = cart.items.filter(
          (item) =>
            !(item.productId.toString() === productId && item.size === size)
        );
      } else {
        item.quantity = quantity; // Update the quantity
      }
      await cart.save();
      res.status(200).json({ message: "Item quantity updated", item });
    } else {
      res.status(404).json({ message: "Item not found in cart" });
    }
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Error updating quantity", error });
  }
};

exports.getCart = async (req, res) => {
  const { userId } = req.params; // Get userId from the request parameters

  try {
    // Find the user's cart
    const cart = await CartItem.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    // Delete all cart items for the user
    await CartItem.deleteMany({ userId });

    res.json({ success: true, message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.syncCart = async (req, res) => {
  const { userId, cartItems } = req.body; // cartItems comes from the frontend

  try {
    // Find the cart for the user
    let cart = await CartItem.findOne({ userId });

    if (!cart) {
      // If no cart exists, create a new cart
      cart = new CartItem({ userId, items: [] });
    }

    // Iterate over each item in the local cart and sync with the backend
    cartItems.forEach((localItem) => {
      const { productId, size, quantity, price, name, image } = localItem;

      // Check if item already exists in the cart (same productId and size)
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId && item.size === size
      );

      if (existingItem) {
        // If item exists, update the quantity, price, name, and image
        existingItem.quantity += quantity; // Add the quantity from local cart
        existingItem.price = price; // Update the price
        existingItem.name = name; // Update the name
        existingItem.image = image; // Update the image
      } else {
        // If item doesn't exist, add the new item
        const newItem = { productId, size, quantity, price, name, image };
        cart.items.push(newItem);
      }
    });

    // Save the cart to the database
    await cart.save();

    res.status(200).json({ message: "Cart synced successfully", cart });
  } catch (error) {
    console.error("Error syncing cart:", error);
    res.status(500).json({ message: "Error syncing cart", error });
  }
};
