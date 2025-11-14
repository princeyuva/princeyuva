/**
 * Save A Life Backend API Server
 * Main server configuration and startup
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

// Import routes and middleware
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const emergencyRoutes = require('./routes/emergency');
const medicalRoutes = require('./routes/medical');
const locationRoutes = require('./routes/location');
const notificationsRoutes = require('./routes/notifications');
const helpersRoutes = require('./routes/helpers');

// Import middleware
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const rateLimiter = require('./middleware/rateLimiter');

// Import database configuration
const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');

// Import Firebase admin
const { initializeFirebase } = require('./config/firebase');

// Import emergency services
const { initializeEmergencyServices } = require('./services/emergencyDispatch');

// Create Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io for real-time communication
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Basic middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting for security
app.use('/api/', rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Save A Life Backend API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/emergency', authMiddleware, emergencyRoutes);
app.use('/api/medical', authMiddleware, medicalRoutes);
app.use('/api/location', authMiddleware, locationRoutes);
app.use('/api/notifications', authMiddleware, notificationsRoutes);
app.use('/api/helpers', authMiddleware, helpersRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Global error handler
app.use(errorHandler);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join user-specific room for personalized notifications
  socket.on('join-user-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Handle emergency location updates
  socket.on('location-update', (data) => {
    // Broadcast to emergency contacts and nearby helpers
    socket.to(`emergency-${data.alertId}`).emit('location-update', data);
  });

  // Handle SOS activation
  socket.on('sos-activated', (data) => {
    // Join emergency-specific room
    socket.join(`emergency-${data.alertId}`);

    // Broadcast to nearby helpers
    socket.to('helpers-active').emit('emergency-alert', data);

    console.log(`SOS activated: ${data.alertId}`);
  });

  // Handle helper response
  socket.on('helper-response', (data) => {
    socket.to(`emergency-${data.alertId}`).emit('helper-response', data);
  });

  // Handle location sharing
  socket.on('start-location-sharing', (data) => {
    socket.join(`location-share-${data.sessionId}`);
  });

  socket.on('location-sharing-update', (data) => {
    socket.to(`location-share-${data.sessionId}`).emit('location-update', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Global store for socket.io instance (accessible by other modules)
app.set('io', io);

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Starting graceful shutdown...`);

  server.close(() => {
    console.log('HTTP server closed.');

    // Close database connections
    if (global.dbConnection) {
      global.dbConnection.close(() => {
        console.log('Database connection closed.');
      });
    }

    // Close Redis connection
    if (global.redisClient) {
      global.redisClient.quit(() => {
        console.log('Redis connection closed.');
      });
    }

    process.exit(0);
  });

  // Force close after 30 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 30000);
};

// Process signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const startServer = async () => {
  try {
    // Initialize Firebase
    await initializeFirebase();
    console.log('✅ Firebase initialized');

    // Connect to database
    await connectDB();
    console.log('✅ Database connected');

    // Connect to Redis
    await connectRedis();
    console.log('✅ Redis connected');

    // Initialize emergency services
    await initializeEmergencyServices();
    console.log('✅ Emergency services initialized');

    // Start HTTP server
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 Save A Life Backend API running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Emergency endpoints ready`);
      console.log(`🔗 Real-time communication enabled`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, but log it for monitoring
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Exit the process as it's in an unstable state
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

module.exports = { app, server, io };