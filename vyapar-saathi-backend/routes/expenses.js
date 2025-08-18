import express from 'express';
import Expense from '../models/Expense.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);
router.post('/', async (req, res) => {
  try {
    const { description, amount } = req.body;
    const newExpense = new Expense({
      description,
      amount,
      user: req.user.id, 
    });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/', async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const expenses = await Expense.find({
      user: req.user.id, 
      date: { $gte: startDate, $lt: endDate },
    });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;