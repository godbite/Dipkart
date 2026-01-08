const { Order, Cart, Product } = require('../models');

// @desc    Place a new order
// @route   POST /api/v1/orders
// @access  Private (Default User)
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress, paymentMethod = 'COD' } = req.body;

    // Validate shipping address
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone ||
        !shippingAddress.addressLine1 || !shippingAddress.city || 
        !shippingAddress.state || !shippingAddress.pincode) {
      return res.status(400).json({
        success: false,
        error: 'Please provide complete shipping address'
      });
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // Validate stock availability for all items
    for (const item of cart.items) {
      if (!item.product.isAvailable || item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `${item.product.name} is not available or has insufficient stock`
        });
      }
    }

    // Calculate totals
    const summary = await cart.calculateTotals();

    // Create order items
    const orderItems = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      thumbnail: item.product.thumbnail,
      price: item.product.sellingPrice,
      quantity: item.quantity
    }));

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal: summary.subtotal,
      shippingCharges: summary.shippingCharges,
      discount: summary.discount,
      totalAmount: summary.total,
      status: 'confirmed'
    });

    // Update product stock
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product._id, {
        $inc: { stock: -item.quantity }
      });
    }

    // Clear cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order.orderId,
        totalAmount: order.totalAmount,
        estimatedDelivery: order.deliveryDate,
        status: order.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for user (Order History)
// @route   GET /api/v1/orders
// @access  Private (Default User)
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user._id })
      .sort({ orderedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments({ user: req.user._id });

    res.status(200).json({
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order by ID
// @route   GET /api/v1/orders/:orderId
// @access  Private (Default User)
const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findOne({ 
      orderId: req.params.orderId,
      user: req.user._id 
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrder
};
