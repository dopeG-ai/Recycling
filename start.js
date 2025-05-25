require('dotenv').config();
const path = require('path');
const app = require('./app');
const db = require('./config/db');

// Set the working directory
process.chdir(path.join(__dirname));

console.log('\n=== Starting Backend Server ===');
console.log('Working Directory:', process.cwd());

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test database connection    await db.query('SELECT 1');
    console.log('✅ Database connection successful');

    app.listen(port, () => {
      console.log(`🚀 Server running on port ${port}`);
      console.log('📝 Test the server by visiting:');
      console.log(`   - http://localhost:${port}/register.html (Registration page)`);
      console.log(`   - http://localhost:${port}/login.html (Login page)`);
      console.log(`   - http://localhost:${port}/api/test (API test endpoint)`);
    });
  } catch (error) {
    console.error('❌ Error starting server:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  console.error(err.stack);
  process.exit(1);
});

startServer();
