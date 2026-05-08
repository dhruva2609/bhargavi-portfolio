import express from 'express';
import Work from '../models/Work.js';
import Feed from '../models/Feed.js';

const router = express.Router();

// Get all snippets
router.get('/snippets', async (req, res) => {
    try {
        const snippets = await Feed.find().sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all stories
router.get('/stories', async (req, res) => {
    try {
        const stories = await Work.find().sort({ createdAt: -1 });
        res.json(stories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Publish a Snippet (The "Insta" feed)
router.post('/snippet', async (req, res) => {
    try {
        const snippet = new Feed({
            content: req.body.body,
            type: req.body.genre || 'Snippet',
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
        });
        await snippet.save();
        res.status(201).json(snippet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Publish a Story (The "Long-form" library)
router.post('/work', async (req, res) => {
    try {
        const work = new Work({
            title: req.body.title,
            description: req.body.body,
            status: 'Published'
        });
        await work.save();
        res.status(201).json(work);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;