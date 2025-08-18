import express from 'express';
import Customer from '../models/Customer.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({
      user: req.user.id, 
      outstandingBalance: { $gt: 0 },
    }).sort({ name: 1 });
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.post('/:id/pay', async (req, res) => {
  try {
    const { amount } = req.body;
    const customer = await Customer.findOne({
      _id: req.params.id,
      user: req.user.id, 
    });

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found or you do not have permission.' });
    }

    customer.outstandingBalance -= amount;
    await customer.save();

    res.status(200).json({ message: 'Payment recorded successfully', customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;