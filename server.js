import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
// Connect to MongoDB using async pattern to ensure connection before server starts
const startServer = async () => {
  try {
    await connectDB();
    
    // Start server only after DB connection
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`
╔══════════════════════════════════════╗
║   🚀 Server is running!             ║
║   📡 Port: ${PORT}                     ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}      ║
║   📝 API URL: http://localhost:${PORT}  ║
╚══════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('Failed to connect to the database. Server not started.', error);
    process.exit(1);
  }
};

startServer();

// Middleware
// function to normalize urls by removing trailing slash
const normalizeUrl = (url) => url ? url.replace(/\/$/, '') : '';

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      normalizeUrl(process.env.CLIENT_URL),
      'http://localhost:5173',
      'http://127.0.0.1:5173', 
      'https://ummadda-ai.vercel.app',
      'https://university-chatbot-chi.vercel.app'
    ].filter(Boolean);

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/feedback', feedbackRoutes);
app.use('/api/chat', chatRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Feedback API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      feedback: '/api/feedback'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server


export default app;

