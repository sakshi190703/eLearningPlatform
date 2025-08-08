const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  sellerId: {
     type: mongoose.Schema.Types.ObjectId, 
     ref: 'User' 
    },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String // Store the file path or URL
  },
  category: String,
  visibility: { type: String, default: 'Public' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);