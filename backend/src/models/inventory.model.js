import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    reservedQuantity: {
        type: Number,
        default: 0,
        min: 0
    },
    availableQuantity: {
        type: Number,
        default: 0
    },
    minStockLevel: {
        type: Number,
        default: 10,
        min: 0
    },
    maxStockLevel: {
        type: Number,
        default: 1000,
        min: 0
    },
    lastRestocked: {
        type: Date
    },
    lastSold: {
        type: Date
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Calculate availableQuantity before saving
inventorySchema.pre('save', function(next) {
    this.availableQuantity = Math.max(0, this.quantity - this.reservedQuantity);
    next();
});

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
    const available = this.availableQuantity || Math.max(0, this.quantity - this.reservedQuantity);
    if (available <= 0) return 'out_of_stock';
    if (available <= this.minStockLevel) return 'low_stock';
    if (available >= this.maxStockLevel) return 'overstocked';
    return 'in_stock';
});

// Index
inventorySchema.index({ product: 1 });
inventorySchema.index({ availableQuantity: 1 });

export const Inventory = mongoose.model('Inventory', inventorySchema);

