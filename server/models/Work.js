import mongoose from 'mongoose';

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    genre: { type: String, enum: ['Poetry', 'Fiction', 'Essays', 'Short Stories', 'Musings'], default: 'Poetry' },
    coverImage: { type: String, default: '' },       // URL or path
    accentColor: { type: String, default: '#E7C1B1' }, // gold-leaf tint
    synopsis: { type: String, trim: true },
    body: { type: String, required: true },           // full article / poem body (Markdown)
    readTime: { type: Number, default: 3 },           // minutes
    tags: [{ type: String, trim: true }],
    featured: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Work', workSchema);
