const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  brand_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Brand',
    unique: true,
    required: true,
  }
},{
    timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);