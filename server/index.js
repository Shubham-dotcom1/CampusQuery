import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import noticeRoutes from './routes/notices.js';
import eventRoutes from './routes/events.js';
import authRoutes from './routes/auth.js';
import marketplaceRoutes from './routes/marketplace.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/notices', noticeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/marketplace', marketplaceRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'CampusQuery Backend Running' });
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.warn("⚠️ MONGODB_URI is not defined in .env");
}

mongoose.connect(MONGODB_URI || 'mongodb://localhost:27017/campusquery')
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
