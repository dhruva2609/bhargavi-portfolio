const express = require('express');
const router = express.Router();
const Work = require('../models/Work');
const Feed = require('../models/Feed');

// Get all books/stories
router.get('/stories', async (req, res) => {
    try {
        const stories = await Work.find();
        res.json(stories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Post a new snippet (Insta-style)
router.post('/snippet', async (req, res) => {
    const snippet = new Feed({
        content: req.body.content,
        type: 'Poetry'
    });
    try {
        const newSnippet = await snippet.save();
        res.status(201).json(newSnippet);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;