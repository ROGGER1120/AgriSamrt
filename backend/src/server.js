import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import priceRoutes from './routes/priceRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import { CropPrice } from './models/CropPrice.js';
import { seedDatabase } from './seed/seedData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'AgriSmart Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[API Server Error]:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start Server and Auto-Seed if database is fresh
const startServer = async () => {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const priceCount = await CropPrice.countDocuments();
    if (priceCount === 0) {
      console.log('[AgriSmart] No crop prices detected. Auto-seeding initial database...');
      await seedDatabase();
    }

    app.listen(PORT, () => {
      console.log(`[AgriSmart Server Running]: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('[Server Startup Failure]:', error.message);
  }
};

startServer();
