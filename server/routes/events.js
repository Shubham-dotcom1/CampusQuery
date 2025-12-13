import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// GET all upcoming events (sorted by date)
router.get('/', async (req, res) => {
    try {
        // Filter for events strictly today or future (optional, for now just sort)
        // const today = new Date();
        // today.setHours(0,0,0,0);

        const events = await Event.find().sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

import { protect, admin } from '../middleware/auth.js';

// ... existing code ...

// POST new event (Protected: Admin Only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const event = new Event(req.body);
        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
