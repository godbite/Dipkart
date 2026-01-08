const { Cart, Product } = require('../models');

// @desc    Get user's cart
// @route   GET /api/v1/cart
// @access  Private (Default User)
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate({
        path: 'items.product',
        select: 'name slug thumbnail price sellingPrice discount stock isAvailable brand'
      });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Calculate totals
    const summary = await cart.calculateTotals();

    res.status(200).json({
      success: true,
      data: {
        items: cart.items,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/v1/cart/add
// @access  Private (Default User)
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;

    // Validate product exists and is available
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (!product.isAvailable || product.stock < quantity) {
      return res.status(400).json({
        success: false,
        error: 'Product is not available or insufficient stock'
      });
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({
          success: false,
          error: 'Requested quantity exceeds available stock'
        });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        addedAt: new Date()
      });
    }

    await cart.save();
    await cart.populate({
      path: 'items.product',
      select: 'name slug thumbnail price sellingPrice discount stock isAvailable brand'
    });

    const summary = await cart.calculateTotals();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: {
        items: cart.items,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update item quantity in cart
// @route   PUT /api/v1/cart/update
// @access  Private (Default User)
const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        error: 'Quantity must be at least 1'
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Check stock
    const product = await Product.findById(productId);
    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        error: 'Requested quantity exceeds available stock'
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug thumbnail price sellingPrice discount stock isAvailable brand'
    });

    const summary = await cart.calculateTotals();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: {
        items: cart.items,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/v1/cart/remove/:productId
// @access  Private (Default User)
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: 'items.product',
      select: 'name slug thumbnail price sellingPrice discount stock isAvailable brand'
    });

    const summary = await cart.calculateTotals();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: {
        items: cart.items,
        summary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear cart
// @route   DELETE /api/v1/cart/clear
// @access  Private (Default User)
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: {
        items: [],
        summary: {
          totalItems: 0,
          subtotal: 0,
          discount: 0,
          shippingCharges: 0,
          total: 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};
