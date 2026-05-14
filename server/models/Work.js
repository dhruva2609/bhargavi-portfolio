import mongoose from 'mongoose';

const workSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    body: { type: String, required: true },
    coverImage: { type: String, default: '' },
    synopsis: { type: String, trim: true },
    readTime: { type: Number, default: 3 },
    likes: { type: Number, default: 0, min: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Work', workSchema);
