const mongoose = require('mongoose');
const { Schema } = mongoose;

const sizeSchema = new Schema({
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        default: 'M'
    },
    stock: {
        type: Number,
        min: 0
    },
    sku: {
        type: String,
        unique: true
    },
    price: {
        type: Number
    }
});

const variationSchema = new Schema({
    color: {
        type: String,
        default: "white"
    },
    sizes: [sizeSchema]
});

const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    variations: [variationSchema],
    thumbnail: { type: String },
    discountPercentage: { type: Number },
    category: { type: String },
    brand: { type: String },
    images: [{ type: String }],
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);