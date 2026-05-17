import express from 'express';
import Feed from '../models/Feed.js';
import Work from '../models/Work.js';
import Message from '../models/Message.js';
import Song from '../models/Song.js';
import Instagram from '../models/Instagram.js';
import mongoose from 'mongoose';
import axios from 'axios';
import { welcomeTemplate, inquiryTemplate, broadcastTemplate } from '../utils/emailTemplates.js';

// Helper to send email using Brevo REST API (bypasses Render SMTP blocking)
const sendBrevoEmail = async (toEmail, subject, htmlContent) => {
    if (!process.env.BREVO_API_KEY) {
        console.warn("⚠️ Email skipped: BREVO_API_KEY missing.");
        return;
    }

    const fromEmail = process.env.BREVO_FROM_EMAIL || 'test@example.com';
    const url = 'https://api.brevo.com/v3/smtp/email';
    const data = {
        sender: { name: "Bhargavi's Editorial", email: fromEmail },
        to: [{ email: toEmail }],
        subject: subject,
        htmlContent: htmlContent
    };

    try {
        await axios.post(url, data, {
            headers: {
                'api-key': process.env.BREVO_API_KEY,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
    } catch (err) {
        console.error("❌ Brevo API Error:", err.response ? JSON.stringify(err.response.data) : err.message);
        throw err;
    }
};

// Helper to broadcast to all subscribers
const broadcastUpdate = async (type, title, summary, link) => {
    try {
        const subscribers = await Subscriber.find({});
        if (subscribers.length === 0) return;

        if (!process.env.BREVO_API_KEY) {
            console.warn("⚠️ Broadcast skipped: Brevo API Key missing.");
            return;
        }

        console.log(`📣 Broadcasting ${type} to ${subscribers.length} subscribers...`);

        const emailPromises = subscribers.map(sub => {
            return sendBrevoEmail(
                sub.email,
                `New Echo: ${title}`,
                broadcastTemplate(type, title, summary, link)
            ).catch(e => console.warn(`Failed for ${sub.email}: ${e.message}`));
        });

        await Promise.allSettled(emailPromises);
        console.log(`🚀 Broadcast complete for "${title}"`);
    } catch (err) {
        console.error("❌ Broadcast failed:", err.message);
    }
};

const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    joinedAt: { type: Date, default: Date.now }
}));

// Real Traffic Tracking Schema
const Traffic = mongoose.models.Traffic || mongoose.model('Traffic', new mongoose.Schema({
    path: { type: String, default: '/' },
    timestamp: { type: Date, default: Date.now },
    userAgent: String
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

// Verify passphrase
router.get('/verify', isCreator, (req, res) => {
  res.json({ message: "Welcome, Creator." });
});

// Real Traffic Tracking Endpoint
router.post('/track', asyncHandler(async (req, res) => {
    const { path } = req.body;
    await Traffic.create({ 
        path: path || '/', 
        userAgent: req.headers['user-agent'] 
    });
    res.sendStatus(200);
}));

// Dashboard Stats
router.get('/stats', isCreator, asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find().sort({ joinedAt: -1 });
    const messages = await Message.find().sort({ createdAt: -1 });
    
    // Aggregate likes and counts
    const works = await Work.find();
    const songs = await Song.find();
    const snippets = await Feed.find();
    
    const workLikes = works.reduce((sum, w) => sum + (w.likes || 0), 0);
    const songLikes = songs.reduce((sum, s) => sum + (s.likes || 0), 0);
    const snippetLikes = snippets.reduce((sum, s) => sum + (s.likes || 0), 0);
    
    // Real Traffic Stats
    const allTraffic = await Traffic.find();
    const totalViews = allTraffic.length;

    // Aggregate Traffic History for Graph
    const getHistoryData = (days) => {
        const historyMap = {};
        const now = new Date();
        
        // Initialize empty days
        for (let i = 0; i < days; i++) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            historyMap[dateStr] = 0;
        }

        // Fill with real data
        allTraffic.forEach(t => {
            const dateStr = new Date(t.timestamp).toISOString().split('T')[0];
            if (historyMap[dateStr] !== undefined) {
                historyMap[dateStr]++;
            }
        });

        return Object.keys(historyMap)
            .sort()
            .map(date => ({ date, views: historyMap[date] }));
    };

    const views = {
        total: totalViews,
        today: allTraffic.filter(t => new Date(t.timestamp).toDateString() === new Date().toDateString()).length,
        history: {
            week: getHistoryData(7),
            month: getHistoryData(30),
            halfYear: getHistoryData(180),
            year: getHistoryData(365)
        }
    };
    const mapToNotification = (item, type) => ({
        id: item._id,
        type,
        title: item.title || (item.content ? item.content.substring(0, 30) + '...' : 'Untitled'),
        likes: item.likes || 0,
        date: item.publishedAt || item.date || item.createdAt || new Date()
    });

    const notifications = [
        ...works.map(w => mapToNotification(w, 'Book')),
        ...songs.map(s => mapToNotification(s, 'Melody')),
        ...snippets.map(s => mapToNotification(s, 'Snippet'))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Top 3 Leaderboard
    const leaderboard = notifications
        .slice()
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 3);

    res.json({
        subscribers: subscribers.length,
        subscribersList: subscribers,
        messages,
        counts: {
            works: works.length,
            songs: songs.length,
            snippets: snippets.length
        },
        likes: {
            works: workLikes,
            songs: songLikes,
            snippets: snippetLikes,
            total: workLikes + songLikes + snippetLikes
        },
        traffic: views,
        notifications,
        leaderboard
    });
}));

// Broadcast to all subscribers
router.post('/broadcast', isCreator, asyncHandler(async (req, res) => {
    const { title, summary, body, link } = req.body;
    const subscribers = await Subscriber.find({});
    
    if (subscribers.length === 0) {
        return res.status(400).json({ message: "No subscribers found in the archive." });
    }

    if (!process.env.BREVO_API_KEY) {
        return res.status(500).json({ message: "Brevo API Key is not set." });
    }

    const emailPromises = subscribers.map(sub => {
        return sendBrevoEmail(
            sub.email,
            title,
            `
                <div style="font-family: serif; color: #2c2c2c; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                    <h1 style="border-bottom: 1px solid #eee; padding-bottom: 10px; font-weight: normal;">${title}</h1>
                    <p style="font-style: italic; color: #666;">${summary}</p>
                    <div style="margin: 30px 0;">${body}</div>
                    ${link ? `<a href="${link}" style="display: inline-block; padding: 12px 24px; background: #2c2c2c; color: #fff; text-decoration: none; font-size: 12px; letter-spacing: 2px; text-transform: uppercase;">View Post</a>` : ''}
                    <hr style="border: 0; border-top: 1px solid #eee; margin-top: 40px;" />
                    <p style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">You are receiving this as a member of The Midnight Bulletin.</p>
                </div>
            `
        ).catch(e => console.warn(`Broadcast failed for ${sub.email}: ${e.message}`));
    });

    await Promise.allSettled(emailPromises);
    res.json({ message: `Broadcast sent to ${subscribers.length} souls.` });
}));

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
  
  // Notify subscribers
  broadcastUpdate('Recent Echo', 'A new fragment has been etched', saved.content.substring(0, 100) + '...', `${process.env.CLIENT_URL || 'https://bhargavi-portfolio.vercel.app'}/feed`);
  
  res.status(201).json(saved);
}));

router.post('/snippets/:id/like', asyncHandler(async (req, res) => {
    const isUnlike = req.body.unlike === true;
    const increment = isUnlike ? -1 : 1;
    const query = { _id: req.params.id };
    if (isUnlike) query.likes = { $gt: 0 };

    const updated = await Feed.findOneAndUpdate(
        query,
        { $inc: { likes: increment } },
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'The echo was not found.' });
    res.json({ likes: updated.likes });
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
    coverImage: transformDriveUrl(coverImage || ''),
    slug,
    synopsis: String(body || '').substring(0, 150) + '...',
    readTime: Math.ceil(String(body || '').split(' ').length / 225) || 1
  });
  
  const saved = await work.save();
  
  // Notify subscribers
  broadcastUpdate('Narrative', saved.title, saved.synopsis, `${process.env.CLIENT_URL || 'https://bhargavi-portfolio.vercel.app'}/reader/${saved.slug}`);
  
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
    ...(coverImage && { coverImage: transformDriveUrl(coverImage) })
  };

  const updated = await Work.findByIdAndUpdate(req.params.id, updateData, { new: true });
  if (!updated) return res.status(404).json({ message: 'The narrative was not found.' });
  res.json(updated);
}));

router.post('/stories/:id/like', asyncHandler(async (req, res) => {
  const isUnlike = req.body.unlike === true;
  const increment = isUnlike ? -1 : 1;
  const query = { _id: req.params.id };
  if (isUnlike) query.likes = { $gt: 0 };

  const updated = await Work.findOneAndUpdate(
    query,
    { $inc: { likes: increment } },
    { new: true }
  );
  if (!updated) return res.status(404).json({ message: 'The narrative was not found.' });
  res.json({ likes: updated.likes });
}));

// --- MESSAGES (COLLABORATION) ---

router.post('/collaborate', asyncHandler(async (req, res) => {
  const { name, email, message, source } = req.body;
  console.log(`\n--- New Message Received ---`);
  console.log(`From: ${name} (${email})`);
  
  const newMessage = new Message({ name, email, message });
  await newMessage.save();
  console.log(`✅ Message saved to database.`);

  const receiver = process.env.BREVO_RECEIVER || 'dhruvapandya86@gmail.com';

  if (process.env.BREVO_API_KEY) {
    console.log(`✉️ Sending notification to ${receiver}...`);

    await sendBrevoEmail(
      receiver,
      `New Collaboration Inquiry from ${name} [via ${source || 'Portfolio'}]`,
      inquiryTemplate(name, email, message, source)
    );
    
    console.log(`🚀 Success: Notification sent to author.`);
  } else {
    console.warn("⚠️ Warning: Email notification skipped. Missing BREVO_API_KEY.");
  }

  res.status(201).json({ message: "Your message has been etched into the archive." });
}));

// --- NEWSLETTER (MIDNIGHT BULLETIN) ---

router.post('/subscribe', asyncHandler(async (req, res) => {
    const { email, source } = req.body;
    console.log(`\n--- New Subscription Request ---`);
    console.log(`Target: ${email}`);
    console.log(`Source: ${source || 'Unknown'}`);
    
    if (!email) return res.status(400).json({ message: "An email address is required." });
    
    try {
        // Find or Create Subscriber
        let subscriber = await Subscriber.findOne({ email });
        if (!subscriber) {
            subscriber = new Subscriber({ email });
            await subscriber.save();
            console.log(`✅ ${email} saved as new subscriber.`);
        } else {
            console.log(`ℹ️ ${email} is already a subscriber. Sending another welcome echo for ${source || 'this section'}.`);
        }

        if (process.env.BREVO_API_KEY) {
            console.log(`✉️ Sending welcome email to ${email}...`);

            await sendBrevoEmail(
                email,
                `Welcome to ${source || 'The Archive'}`,
                welcomeTemplate(source)
            );
            
            console.log(`🚀 Success: Welcome email sent to ${email}`);
        } else {
            console.warn("⚠️ Error: BREVO_API_KEY is missing in server/.env");
        }

        res.status(201).json({ message: "You have been added to the Midnight Bulletin." });
    } catch (err) {
        console.error("❌ Subscription Error Details:", err.message);
        res.status(500).json({ message: "A tear in the narrative occurred." });
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
    
    // Notify subscribers
    broadcastUpdate('Melody', saved.title, saved.lyrics.substring(0, 100) + '...', `${process.env.CLIENT_URL || 'https://bhargavi-portfolio.vercel.app'}/songs`);
    
    res.status(201).json(saved);
}));

router.put('/songs/:id', isCreator, asyncHandler(async (req, res) => {
    const { title, lyrics, mood } = req.body;
    const updated = await Song.findByIdAndUpdate(req.params.id, { title, lyrics, mood }, { new: true });
    if (!updated) return res.status(404).json({ message: 'The melody was not found.' });
    res.json(updated);
}));

router.post('/songs/:id/like', asyncHandler(async (req, res) => {
    const isUnlike = req.body.unlike === true;
    const increment = isUnlike ? -1 : 1;
    const query = { _id: req.params.id };
    if (isUnlike) query.likes = { $gt: 0 };

    const updated = await Song.findOneAndUpdate(
        query,
        { $inc: { likes: increment } },
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'The melody was not found.' });
    res.json({ likes: updated.likes });
}));

// --- SCENES (VISUALS) ---

router.get('/instagram', asyncHandler(async (req, res) => {
    const posts = await Instagram.find().sort({ createdAt: -1 });
    res.json(posts);
}));

// Helper to scrape og:image from Instagram
const scrapeInstaThumbnail = async (url) => {
    try {
        const sanitizedUrl = url.split('?')[0].replace(/\/+$/, '') + '/';
        const response = await axios.get(sanitizedUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
            },
            timeout: 15000
        });

        const html = response.data;
        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i)
            || html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i)
            || html.match(/"display_url":"([^"]+)"/)
            || html.match(/"thumbnail_src":"([^"]+)"/)
            || html.match(/<img[^>]*class=["']_aagv["'][^>]*src=["']([^"']+)["']/i);

        if (ogImageMatch && ogImageMatch[1]) {
            return ogImageMatch[1].replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
        }
        return null;
    } catch (err) {
        console.warn('Scrape failed for:', url, err.message);
        return null;
    }
};

// Helper to convert Google Drive share links to direct image links
const transformDriveUrl = (url) => {
    if (!url) return url;
    if (!url.includes('drive.google.com') && !url.includes('docs.google.com')) return url;
    
    const idMatch = url.match(/[?&]id=([^&]+)/) || url.match(/\/d\/([^/]+)/);
    if (idMatch && idMatch[1]) {
        return `https://lh3.googleusercontent.com/d/${idMatch[1]}`;
    }
    return url;
};

// Thumbnail proxy: scrapes og:image from Instagram post page server-side
router.get('/instagram/thumbnail', asyncHandler(async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'No URL provided' });

    const thumbnail = await scrapeInstaThumbnail(url);
    if (thumbnail) {
        res.json({ thumbnail });
    } else {
        // Return a curated fallback instead of 404 to avoid console noise and broken images
        const fallbacks = [
            "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=800"
        ];
        const index = Math.abs(url.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)) % fallbacks.length;
        res.json({ thumbnail: fallbacks[index] });
    }
}));

router.post('/instagram', isCreator, asyncHandler(async (req, res) => {
    let { url, label, image } = req.body;
    
    // Transform Google Drive links if present
    image = transformDriveUrl(image);

    // Auto-fetch thumbnail ONLY if not provided AND url exists
    if (!image && url && url.includes('instagram.com')) {
        console.log(`🔍 No image provided for ${label}. Attempting to scrape from Instagram...`);
        image = await scrapeInstaThumbnail(url);
    }

    const newPost = new Instagram({ url, label, image });
    const saved = await newPost.save();
    console.log(`✨ Scene saved: ${label}`);
    
    // Notify subscribers
    broadcastUpdate('Visual Scene', label, 'A new visual fragment has been captured in the archive.', `${process.env.CLIENT_URL || 'https://bhargavi-portfolio.vercel.app'}/`);
    
    res.status(201).json(saved);
}));

router.put('/instagram/:id', isCreator, asyncHandler(async (req, res) => {
    let { url, label, image } = req.body;
    image = transformDriveUrl(image);
    const updated = await Instagram.findByIdAndUpdate(
        req.params.id, 
        { url, label, image }, 
        { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'The scene was not found.' });
    res.json(updated);
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