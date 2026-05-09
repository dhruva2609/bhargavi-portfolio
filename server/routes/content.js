import express from 'express';
import Feed from '../models/Feed.js';
import Work from '../models/Work.js';
import Message from '../models/Message.js';

const router = express.Router();

// Middleware to catch async errors
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Security check for creator actions
const isCreator = (req, res, next) => {
  const passphrase = req.headers['x-passphrase'] || req.body.passphrase;
  if (passphrase === 'bhargavi') {
    return next();
  }
  res.status(403).json({ message: "Only the author's ink is permitted here." });
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

router.get('/work', asyncHandler(async (req, res) => {
  const works = await Work.find().sort({ publishedAt: -1 });
  res.json(works);
}));

router.get('/work/:slug', asyncHandler(async (req, res) => {
  const work = await Work.findOne({ slug: req.params.slug });
  if (!work) return res.status(404).json({ message: 'The narrative was not found.' });
  res.json(work);
}));

router.post('/work', isCreator, asyncHandler(async (req, res) => {
  const { title, body, coverImage } = req.body;
  const slug = (title || 'untitled').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  
  const work = new Work({
    title: title || 'Untitled',
    body: body || '',
    coverImage: coverImage || '',
    slug,
    synopsis: (body || '').substring(0, 150) + '...',
    readTime: Math.ceil((body || '').split(' ').length / 200) || 1
  });
  
  const saved = await work.save();
  res.status(201).json(saved);
}));

// --- MESSAGES (COLLABORATION) ---

router.post('/collaborate', asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;
  const newMessage = new Message({ name, email, message });
  await newMessage.save();
  res.status(201).json({ message: "Your message has been etched into the archive." });
}));

export default router;