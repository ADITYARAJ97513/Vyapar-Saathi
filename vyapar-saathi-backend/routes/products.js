import express from 'express';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/auth.js'; 

const router = express.Router();
router.use(authMiddleware);
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ user: req.user.id }).sort({ name: 1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error while fetching products.' });
  }
});
router.post('/', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const newProduct = new Product({
      name,
      price,
      stock,
      user: req.user.id, 
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error while creating product.' });
  }
});
router.put('/:id', async (req, res) => {
  try {
    const { name, price, stock } = req.body;
    const product = await Product.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission.' });
    }

    product.name = name;
    product.price = price;
    product.stock = stock;
    await product.save();
    
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error while updating product.' });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!product) {
      return res.status(404).json({ message: 'Product not found or you do not have permission.' });
    }
    res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting product.' });
  }
});

export default router;