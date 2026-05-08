import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// DB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bhargavi_portfolio';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✨ Poetic connection to MongoDB established.'))
  .catch(err => console.error('🥀 Connection to the inkwell failed:', err));

// Basic Routes (Placeholders - will be expanded)
app.get('/', (req, res) => {
  res.send('The Writer\'s Sanctuary is online.');
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌸 Sanctuary breathing at http://localhost:${PORT}`);
});
