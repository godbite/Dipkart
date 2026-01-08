const mongoose = require('mongoose');

let isConnected = false; // Track connection status

const connectDB = async () => {
  // If already connected, reuse the connection
  if (isConnected) {
    console.log('Using existing MongoDB connection');
    return;
  }

  try {
    // Configure mongoose for serverless
    mongoose.set('strictQuery', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,
    });
    
    isConnected = conn.connections[0].readyState === 1;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    isConnected = false;
    throw error; // Re-throw to handle in calling function
  }
};

module.exports = connectDB;
