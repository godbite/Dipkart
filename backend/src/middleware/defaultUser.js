const { User } = require('../models');

// Middleware to attach default user to all requests
// Since no authentication is required, we use a default user
const defaultUser = async (req, res, next) => {
  try {
    // Find or create the default user
    let user = await User.findOne({ email: 'default@flipkart.com' });
    
    if (!user) {
      user = await User.create({
        name: 'Default User',
        email: 'default@flipkart.com',
        phone: '9876543210',
        addresses: []
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Error in defaultUser middleware:', error);
    next(error);
  }
};

module.exports = defaultUser;
