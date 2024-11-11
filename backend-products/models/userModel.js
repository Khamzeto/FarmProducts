const mongoose = require('mongoose');

// Define the schema for User
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ['admin', 'seller', 'user'], // Available roles
    default: 'admin', // Default role
  },
  photo: {
    type: String, // URL or path to the photo
    trim: true,
  },
  product: {
    type: String, // Name of the product associated with the user
    trim: true,
  },
  description: {
    type: String, // Description related to the user or product
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
