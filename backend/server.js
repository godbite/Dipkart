require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');

const PORT = process.env.PORT || 5010;

// Connect to database immediately (for both local and serverless)
connectDB().catch(err => {
  console.error('Initial MongoDB connection failed:', err);
});

// Start server locally
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api/v1`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

// Export for Vercel serverless
module.exports = app;
