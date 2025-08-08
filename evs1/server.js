const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/treasurecycle', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'));

// Listing Schema
const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  status: { type: String, default: 'pending' } // pending, approved
});

const Listing = mongoose.model('Listing', listingSchema);

// API Routes
// Get all listings
app.get('/api/listings', async (req, res) => {
  const listings = await Listing.find();
  res.json(listings);
});

// Post new listing
app.post('/api/listings', async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.status(201).json(newListing);
});

// Manage listing (approve/delete)
app.put('/api/listings/:id', async (req, res) => {
  const { id } = req.params;
  const { action } = req.body;

  if (action === 'approve') {
    await Listing.findByIdAndUpdate(id, { status: 'approved' });
  } else if (action === 'delete') {
    await Listing.findByIdAndDelete(id);
  }

  res.status(200).send();
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});