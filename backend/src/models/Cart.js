const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

// Note: user field already has unique: true which creates an index

// Method to calculate cart totals
cartSchema.methods.calculateTotals = async function() {
  await this.populate('items.product');
  
  let subtotal = 0;
  let totalDiscount = 0;
  let totalItems = 0;
  
  this.items.forEach(item => {
    if (item.product) {
      subtotal += item.product.price * item.quantity;
      totalDiscount += (item.product.price - item.product.sellingPrice) * item.quantity;
      totalItems += item.quantity;
    }
  });
  
  const shippingCharges = subtotal >= 500 ? 0 : 40; // Free shipping above ₹500
  const total = subtotal - totalDiscount + shippingCharges;
  
  return {
    totalItems,
    subtotal,
    discount: totalDiscount,
    shippingCharges,
    total
  };
};

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
