import mongoose from 'mongoose';

const feedSchema = new mongoose.Schema(
  {
    content: { 
      type: String, 
      required: [true, 'Fragment content is required'], 
      maxlength: [5000, 'A fragment must be under 5000 characters'],
      trim: true 
    },
    type: { type: String, default: 'Snippet' },
    likes: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

feedSchema.index({ createdAt: -1 });

export default mongoose.model('Feed', feedSchema);
