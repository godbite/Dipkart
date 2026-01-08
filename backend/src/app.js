const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const defaultUser = require('./middleware/defaultUser');

// Route imports
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply default user middleware to routes that need it
app.use('/api/v1/cart', defaultUser);
app.use('/api/v1/orders', defaultUser);
app.use('/api/v1/user', defaultUser);

// Routes
// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Flipkart Clone API',
    version: 'v1',
    documentation: '/api/v1',
    status: 'Running'
  });
});

app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Flipkart Clone API v1',
    endpoints: {
      categories: '/api/v1/categories',
      products: '/api/v1/products',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      user: '/api/v1/user'
    }
  });
});

app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/user', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
