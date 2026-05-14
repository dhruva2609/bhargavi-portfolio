import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    lyrics: { type: String, required: true },
    mood: { type: String, default: 'Melancholic' },
    likes: { type: Number, default: 0, min: 0 },
    publishedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model('Song', songSchema);
