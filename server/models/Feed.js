import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true },
    caption: { type: String, trim: true, default: '' },
    instagramUrl: { type: String, default: '' },
    altText: { type: String, default: 'A moment captured' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Feed', feedSchema);
