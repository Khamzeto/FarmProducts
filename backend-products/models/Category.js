// models/Category.js

const mongoose = require('mongoose');

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String, // Stores the Base64 string
  },
  subcategories: [subcategorySchema],
});

module.exports = mongoose.model('Category', categorySchema);
