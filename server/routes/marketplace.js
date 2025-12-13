import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all products
// @route   GET /api/marketplace
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ status: 'Available' })
            .populate('seller', 'name email')
            .sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new product
// @route   POST /api/marketplace
router.post('/', protect, async (req, res) => {
    try {
        const { title, price, description, category, condition, image, contact } = req.body;

        const product = new Product({
            title,
            price,
            description,
            category,
            condition,
            image,
            contact,
            seller: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get product by ID
// @route   GET /api/marketplace/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('seller', 'name email');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
