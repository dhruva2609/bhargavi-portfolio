import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import contentRouter from './routes/content.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- SECURITY IMPLEMENTATION ---

// 1. Helmet for secure HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images
}));

// 2. Strict CORS
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// 3. Rate Limiting to prevent brute force/abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: "Too many requests from this inkwell, please try again later."
});
app.use('/api/', limiter);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhargavi_portfolio';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✨ Poetic connection to MongoDB established.'))
  .catch(err => console.error('🥀 Connection to the inkwell failed:', err));

// Routes
app.use('/api/content', contentRouter);

app.get('/', (req, res) => {
  res.send('The Writer\'s Sanctuary Backend is secure and online.');
});

// --- CENTRALIZED ERROR HANDLING ---

app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err.stack);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'An unexpected tear in the narrative occurred.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌸 Sanctuary breathing at http://localhost:${PORT}`);
});
