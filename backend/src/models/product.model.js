import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    costPrice: {
        type: Number,
        required: true,
        min: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['kg', 'piece', 'dozen', 'pack', 'gram'],
        default: 'kg'
    },
    image: {
        type: String,
        default: ''
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    minStockLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    barcode: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: 'text', description: 'text' });

export const Product = mongoose.model('Product', productSchema);

