import express from 'express';
import Notice from '../models/Notice.js';

const router = express.Router();

// GET all notices
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { summary: { $regex: search, $options: 'i' } }
            ];
        }

        const notices = await Notice.find(query).sort({ date: -1 });
        res.json(notices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

import { protect, admin } from '../middleware/auth.js';

// ... existing code ...

// POST a new notice (Protected: Admin Only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const notice = new Notice(req.body);
        const savedNotice = await notice.save();
        res.status(201).json(savedNotice);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
