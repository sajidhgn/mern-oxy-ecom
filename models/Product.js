const mongoose = require('mongoose');
const { Schema } = mongoose;

const sizeSchema = new Schema({
    size: {
        type: String,
        enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        required: true
    },
    stock: {
        type: Number,
        min: 0,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

const variationSchema = new Schema({
    color: {
        type: String,
        required: true
    },
    sizes: {
        type: [sizeSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one size is required.'
        }
    }
});

const productSchema = new Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true },
    variations: {
        type: [variationSchema],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one variation is required.'
        }
    },
    thumbnail: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    images: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return value.length > 0;
            },
            message: 'At least one image is required.'
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
