const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategory,
  getCategoryBySlug
} = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategory);

module.exports = router;
