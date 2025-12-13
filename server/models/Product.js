import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: {
        type: String,
        enum: ['Books', 'Electronics', 'Stationery', 'Furniture', 'Others'],
        default: 'Others'
    },
    condition: {
        type: String,
        enum: ['New', 'Like New', 'Used', 'Damaged'],
        default: 'Used'
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    image: { type: String }, // URL to image
    status: {
        type: String,
        enum: ['Available', 'Sold'],
        default: 'Available'
    },
    contact: { type: String } // Optional contact info (phone/email) if specific
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
