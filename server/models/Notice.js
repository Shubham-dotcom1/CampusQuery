import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, default: Date.now },
    summary: { type: String, required: true },
    important: { type: Boolean, default: false },
    content: { type: String }, // For detailed content
}, { timestamps: true });

export default mongoose.model('Notice', noticeSchema);
