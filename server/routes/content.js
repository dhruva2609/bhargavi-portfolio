import express from 'express';
import Feed from '../models/Feed.js';
import Work from '../models/Work.js';
import Message from '../models/Message.js';
import Song from '../models/Song.js';
import mongoose from 'mongoose';

// Simple Newsletter Schema (in-memory or ad-hoc for this demo)
const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    joinedAt: { type: Date, default: Date.now }
}));

const router = express.Router();

// Middleware to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Security check for creator actions (Hardened for Production)
const isCreator = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === `Bearer ${process.env.CREATOR_KEY}`) {
    return next();
  }
  return res.status(401).json({ message: "The sanctuary is closed. Your passphrase is unrecognized." });
};

// --- SNIPPETS (FEED) ---

router.get('/snippets', asyncHandler(async (req, res) => {
  const snippets = await Feed.find().sort({ createdAt: -1 });
  res.json(snippets);
}));

router.post('/snippet', isCreator, asyncHandler(async (req, res) => {
  const { body, content } = req.body;
  const snippet = new Feed({
    content: body || content
  });
  const saved = await snippet.save();
  res.status(201).json(saved);
}));

// --- STORIES (WORK) ---

router.get('/stories', asyncHandler(async (req, res) => {
  const works = await Work.find().sort({ publishedAt: -1 });
  res.json(works);
}));

router.get('/stories/:slug', asyncHandler(async (req, res) => {
  const work = await Work.findOne({ slug: req.params.slug });
  if (!work) return res.status(404).json({ message: 'The narrative was not found.' });
  res.json(work);
}));

router.post('/stories', isCreator, asyncHandler(async (req, res) => {
  const { title, body, coverImage } = req.body;
  const slug = (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const work = new Work({
    title: title || 'Untitled',
    body: body || '',
    coverImage: coverImage || '',
    slug,
    synopsis: String(body || '').substring(0, 150) + '...',
    readTime: Math.ceil(String(body || '').split(' ').length / 225) || 1
  });
  
  const saved = await work.save();
  res.status(201).json(saved);
}));

router.put('/stories/:id', isCreator, asyncHandler(async (req, res) => {
  const { title, body, coverImage } = req.body;
  
  const updateData = {
    ...(title && { title }),
    ...(body && { 
        body,
        synopsis: String(body).substring(0, 150) + '...',
        readTime: Math.ceil(String(body).split(' ').length / 225) || 1
    }),
    ...(coverImage && { coverImage })
  };

  const updated = await Work.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!updated) return res.status(404).json({ message: 'The narrative was not found.' });
  res.json(updated);
}));

// --- MESSAGES (COLLABORATION) ---

router.post('/collaborate', asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const newMessage = new Message({ name, email, message });
  await newMessage.save();
  res.status(201).json({ message: "Your message has been etched into the archive." });
}));

// --- NEWSLETTER (MIDNIGHT BULLETIN) ---

router.post('/subscribe', asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "An email address is required." });
    
    try {
        const subscriber = new Subscriber({ email });
        await subscriber.save();
        res.status(201).json({ message: "You have been added to the Midnight Bulletin." });
    } catch (err) {
        if (err.code === 11000) return res.status(400).json({ message: "You are already part of the bulletin." });
        throw err;
    }
}));

// --- MELODIES (SONGS) ---

router.get('/songs', asyncHandler(async (req, res) => {
    const songs = await Song.find().sort({ publishedAt: -1 });
    res.json(songs);
}));

router.post('/songs', isCreator, asyncHandler(async (req, res) => {
    const { title, lyrics, mood } = req.body;
    const song = new Song({ title, lyrics, mood });
    const saved = await song.save();
    res.status(201).json(saved);
}));

router.put('/songs/:id', isCreator, asyncHandler(async (req, res) => {
    const { title, lyrics, mood } = req.body;
    const updated = await Song.findByIdAndUpdate(req.params.id, { title, lyrics, mood }, { new: true });
    if (!updated) return res.status(404).json({ message: 'The melody was not found.' });
    res.json(updated);
}));

export default router;