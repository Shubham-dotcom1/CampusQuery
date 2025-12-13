import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: 'General' }, // e.g. Workshop, Cultural, Sports
    organizer: { type: String },
    image: { type: String }, // URL to image
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
