import express from 'express';
import Feed from '../models/Feed.js';
import Work from '../models/Work.js';
import Message from '../models/Message.js';
import Song from '../models/Song.js';
import Instagram from '../models/Instagram.js';
import mongoose from 'mongoose';
import axios from 'axios';

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

// --- INSTAGRAM (SCENES) ---

router.get('/instagram', asyncHandler(async (req, res) => {
    let posts = await Instagram.find().sort({ createdAt: -1 });

    // Fallback with the actual Instagram posts we want to show
    if (posts.length === 0) {
        posts = [
            { url: "https://www.instagram.com/p/DXk-g6sk62h/", label: "Editorial Vision" },
            { url: "https://www.instagram.com/p/DXsshDvE8u9/", label: "Symmetrical Echoes" },
            { url: "https://www.instagram.com/p/DX3HzD1jC_C/", label: "Written Fragments" },
            { url: "https://www.instagram.com/p/DX-sfYmistG/", label: "The Silent Archive" }
        ];
    }

    res.json(posts);
}));

// Helper to scrape og:image from Instagram
const scrapeInstaThumbnail = async (url) => {
    try {
        const sanitizedUrl = url.split('?')[0].replace(/\/+$/, '') + '/';
        const response = await axios.get(sanitizedUrl, {
            headers: {
                'User-Agent': 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
                'Accept': 'text/html',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            timeout: 10000
        });

        const html = response.data;
        // Search for og:image in multiple patterns
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
            || html.match(/"display_url":"([^"]+)"/); // Fallback for some JSON-in-HTML structures

        if (ogImageMatch && ogImageMatch[1]) {
            // Unescape unicode if found in display_url match
            return ogImageMatch[1].replace(/\\u0026/g, '&');
        }
        return null;
    } catch (err) {
        console.warn('Scrape failed for:', url, err.message);
        return null;
    }
};

// Thumbnail proxy: scrapes og:image from Instagram post page server-side
router.get('/instagram/thumbnail', asyncHandler(async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    const thumbnail = await scrapeInstaThumbnail(url);
    if (thumbnail) {
        res.json({ thumbnail });
    } else {
        res.status(404).json({ error: 'No thumbnail found' });
    }
}));

router.post('/instagram', isCreator, asyncHandler(async (req, res) => {
    let { url, label, image } = req.body;
    
    // Auto-fetch thumbnail if not provided
    if (!image && url) {
        image = await scrapeInstaThumbnail(url);
    }

    const newPost = new Instagram({ url, label, image });
    const saved = await newPost.save();
    res.status(201).json(saved);
}));

router.post('/instagram/sync', isCreator, asyncHandler(async (req, res) => {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    if (!accessToken) {
        return res.status(400).json({ message: "No Instagram Access Token found in the sanctuary. Add it to your vault (environment variables)." });
    }

    try {
        // Fetch from Instagram Basic Display API
        const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`);
        const media = response.data.data;

        const results = [];
        for (const item of media) {
            // Only sync images or carousels
            if (item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM') {
                const existing = await Instagram.findOne({ url: item.permalink });
                if (!existing) {
                    const newPost = new Instagram({
                        url: item.permalink,
                        label: item.caption ? item.caption.split('\n')[0].substring(0, 30) : "Untold Scene",
                        image: item.media_url,
                        createdAt: item.timestamp
                    });
                    await newPost.save();
                    results.push(newPost);
                }
            }
        }
        res.json({ message: `Synced ${results.length} new scenes.`, count: results.length });
    } catch (err) {
        console.error("Instagram sync failed:", err.response?.data || err.message);
        res.status(500).json({ message: "The bridge to Instagram is unstable.", error: err.response?.data || err.message });
    }
}));

export default router;