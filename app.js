const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/error');
const http = require('http');
const socketIo = require('socket.io');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const recyclingRoutes = require('./routes/recycling');
const transactionRoutes = require('./routes/transactions');
const chatRoutes = require('./routes/chat');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/recycling', recyclingRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/chat', chatRoutes);

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend server is running' });
});

// Error handling
app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Database connection check
const db = require('./config/db');

async function startServer() {
  try {
    console.log('Starting server...');
    console.log('Checking database connection...');
    
    // Test database connection
    await db.query('SELECT 1');
    console.log('✅ Database connection successful');
    
    // Verify required tables exist
    const requiredTables = ['users', 'user_details', 'recycling_items', 'transactions'];
    for (const table of requiredTables) {
      const [result] = await db.query('SHOW TABLES LIKE ?', [table]);
      if (result.length === 0) {
        console.error(`❌ Required table '${table}' is missing!`);
        console.log('Please run setup_database.ps1 to create all required tables.');
        process.exit(1);
      }
    }    console.log('✅ All required database tables exist');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

startServer();

module.exports = server; // Export the HTTP server instead of the Express app