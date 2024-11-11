const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  autor: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  discount: { type: String },
  discountValidUntil: { type: Date },
  rating: { type: Number },
  weightRange: { type: String },
  isWeighted: { type: Boolean },
  description: { type: String },
  nutrition: {
    proteins: { type: String },
    fats: { type: String },
    carbohydrates: { type: String },
  },
  energyValue: {
    kcal: { type: String },
    kJ: { type: String },
  },
  expiration: { type: String },
  storageConditions: { type: String },
  category: { type: String },
  subcategory: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Associate with User model
});

module.exports = mongoose.model('Product', productSchema);
