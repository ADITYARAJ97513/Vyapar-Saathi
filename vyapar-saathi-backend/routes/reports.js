import express from 'express';
import Sale from '../models/Sale.js';
import Expense from '../models/Expense.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);
router.get('/daily', async (req, res) => {
  try {
    const { date } = req.query;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    const sales = await Sale.find({
      user: req.user.id,
      createdAt: { $gte: startDate, $lte: endDate },
    });
    const expenses = await Expense.find({
      user: req.user.id,
      date: { $gte: startDate, $lte: endDate },
    });

    const totalSales = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const salesByMethod = { Cash: 0, UPI: 0, Card: 0, Udhaar: 0 };
    sales.forEach(sale => {
      if (salesByMethod.hasOwnProperty(sale.paymentMethod)) {
        salesByMethod[sale.paymentMethod] += sale.totalAmount;
      }
    });

    const report = {
      totalSales,
      totalExpenses,
      netProfit: totalSales - totalExpenses,
      salesCount: sales.length,
      salesByMethod,
    };

    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ message: 'Server error while generating report.' });
  }
});

export default router;