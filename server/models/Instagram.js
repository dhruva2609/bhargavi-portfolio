import mongoose from 'mongoose';

const instagramSchema = new mongoose.Schema({
    url: { type: String },
    label: { type: String, required: true },
    image: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Instagram', instagramSchema);
