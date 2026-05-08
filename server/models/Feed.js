import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    type: { type: String, default: 'Snippet' },
    date: { type: String },
    imageUrl: { type: String },
    caption: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model('Feed', feedSchema);
