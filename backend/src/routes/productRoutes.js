const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProduct,
  getProductBySlug,
  getProductsByCategory
} = require('../controllers/productController');

router.get('/', getProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProduct);

module.exports = router;
