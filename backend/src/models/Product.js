const mongoose = require('mongoose');

const specificationSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  brand: {
    type: String,
    required: true,
    trim: true
  },
  // Pricing
  price: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  // Images
  images: [{
    type: String
  }],
  thumbnail: {
    type: String,
    required: true
  },
  // Stock & Availability
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // Specifications
  specifications: [specificationSchema],
  // Highlights
  highlights: [{
    type: String
  }],
  // Rating
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  // Tags for search
  tags: [{
    type: String,
    lowercase: true
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
productSchema.index({ category: 1 });
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ sellingPrice: 1 });
productSchema.index({ 'rating.average': -1 });

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0 && this.isAvailable;
});

// Calculate discount before saving
productSchema.pre('save', function(next) {
  if (this.price > this.sellingPrice) {
    this.discount = Math.round(((this.price - this.sellingPrice) / this.price) * 100);
  } else {
    this.discount = 0;
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
