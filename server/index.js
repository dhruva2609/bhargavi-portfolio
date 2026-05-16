import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import contentRouter from './routes/content.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- PRODUCTION HARDENING ---

// Trust first proxy (Render/Vercel)
app.set('trust proxy', 1);

// 1. Helmet for secure HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://*", "blob:"],
      connectSrc: ["'self'", "https://*", "http://localhost:*"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
}));

// 2. Strict Production CORS
const allowedOrigins = [
  process.env.CLIENT_URL,
  'https://bhargavi-portfolio-nine.vercel.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173'
].filter(Boolean).map(url => url.replace(/\/$/, "")); // Remove trailing slashes

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or allowed origins
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked for origin: ${origin}`);
      callback(new Error('CORS access denied. The sanctuary is closed to this origin.'));
    }
  },
  credentials: true
}));

// 3. Narrative Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests from this inkwell. Please wait for the ink to dry." }
});
app.use('/api/', limiter);

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('⚠️ CRITICAL: MONGO_URI is not defined in environment variables!');
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('✨ Poetic connection to MongoDB established.'))
  .catch(err => console.error('🥀 Connection to the inkwell failed:', err));

// Routes
app.use('/api/content', contentRouter);

// Serve Static Frontend in Production (Optional fallback)
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../client/dist');
  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));
    app.get('*', (req, res) => {
      const indexPath = path.join(clientDistPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Frontend build index not found.');
      }
    });
  } else {
    console.log('ℹ️  Note: client/dist not found. Server acting as API only.');
    app.get('/', (req, res) => {
      res.send('The Writer\'s Sanctuary API is live and secure.');
    });
  }
} else {
  app.get('/', (req, res) => {
    res.send('The Writer\'s Sanctuary Backend is secure and online.');
  });
}

// --- CENTRALIZED ERROR HANDLING ---

app.use((err, req, res, next) => {
  console.error('SERVER_ERROR:', err.message);
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || 'An unexpected tear in the narrative occurred.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  const isProd = process.env.NODE_ENV === 'production';
  console.log(`🌸 Sanctuary ${isProd ? 'Production' : 'Development'} is breathing ${isProd ? '' : `at http://localhost:${PORT}`}`);
  if (isProd) console.log(`🚀 API Base: ${process.env.PRODUCTION_URL || 'Ready'}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`⚠️  Port ${PORT} in use. Attempting to free it...`);
    // On Windows with nodemon, just exit — nodemon will restart and the OS will clean up
    process.exit(1);
  } else {
    throw err;
  }
});
