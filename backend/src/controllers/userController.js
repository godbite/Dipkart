const { User } = require('../models');

// @desc    Get current user
// @route   GET /api/v1/user
// @access  Private (Default User)
const getUser = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add or update address
// @route   PUT /api/v1/user/address
// @access  Private (Default User)
const updateAddress = async (req, res, next) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;

    // Validate required fields
    if (!fullName || !phone || !addressLine1 || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required address fields'
      });
    }

    const address = {
      fullName,
      phone,
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      pincode,
      isDefault: isDefault || false
    };

    // If this is set as default, unset other defaults
    if (isDefault) {
      req.user.addresses.forEach(addr => {
        addr.isDefault = false;
      });
    }

    // Add address
    req.user.addresses.push(address);
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Address added successfully',
      data: req.user.addresses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/user/address/:addressId
// @access  Private (Default User)
const deleteAddress = async (req, res, next) => {
  try {
    req.user.addresses = req.user.addresses.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
      data: req.user.addresses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUser,
  updateAddress,
  deleteAddress
};
