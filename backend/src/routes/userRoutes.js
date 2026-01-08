const express = require('express');
const router = express.Router();
const {
  getUser,
  updateAddress,
  deleteAddress
} = require('../controllers/userController');

router.get('/', getUser);
router.put('/address', updateAddress);
router.delete('/address/:addressId', deleteAddress);

module.exports = router;
