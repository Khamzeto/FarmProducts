const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, subcategory } = req.query;
    const filter = {};
    if (category) filter.category = new RegExp(`^${category}$`, 'i');
    if (subcategory) filter.subcategory = new RegExp(`^${subcategory}$`, 'i');

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get products by userId
exports.getProductsByUserId = async (req, res) => {
  try {
    const { userId } = req.params; // Retrieve userId from route parameters
    const products = await Product.find({ userId });
    if (!products) {
      return res.status(404).json({ message: 'No products found for this user' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by userId', error });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
};

// Create a new product with userId
exports.createProduct = async (req, res) => {
  try {
    const { userId, ...productData } = req.body; // Extract userId from request body
    const newProduct = new Product({ ...productData, userId });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
};

// Update an existing product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
};

// Top discounted products
exports.getTopDiscountedProducts = async (req, res) => {
  try {
    const products = await Product.find({ oldPrice: { $gt: 0 }, price: { $gt: 0 } });
    const discountedProducts = products
      .map(product => {
        const discountPercentage =
          ((product.oldPrice - product.price) / product.oldPrice) * 100;
        return { ...product._doc, discountPercentage: discountPercentage.toFixed(2) };
      })
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, 20);

    res.status(200).json(discountedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching top discounted products', error });
  }
};

// Latest products
exports.getLatestProducts = async (req, res) => {
  try {
    const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(20);
    res.status(200).json(latestProducts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest products', error });
  }
};
