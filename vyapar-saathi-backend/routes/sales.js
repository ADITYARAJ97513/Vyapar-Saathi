import express from 'express';
import Sale from '../models/Sale.js';
import Customer from '../models/Customer.js';
import Product from '../models/Product.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  const { items, totalAmount, paymentMethod, customerName, customerPhone, discount, taxRate } = req.body;
  const userId = req.user.id;

  try {
    const lastSale = await Sale.findOne({ user: userId }).sort({ createdAt: -1 });
    
    let nextBillNumber;
    if (lastSale && typeof lastSale.billNumber === 'number') {
      nextBillNumber = lastSale.billNumber + 1;
    } else {
      nextBillNumber = 101;
    }

    const newSale = new Sale({
      items,
      totalAmount,
      paymentMethod,
      customerName,
      customerPhone,
      discount,
      taxRate,
      billNumber: nextBillNumber, 
      user: userId,
    });
    await newSale.save();

    for (const item of items) {
      await Product.findOneAndUpdate(
        { _id: item.productId, user: userId },
        { $inc: { stock: -item.quantity } }
      );
    }

    if (paymentMethod === 'Udhaar') {
      let customer = await Customer.findOne({ phone: customerPhone, user: userId });

      if (customer) {
        customer.outstandingBalance += totalAmount;
      } else {
        customer = new Customer({
          name: customerName,
          phone: customerPhone,
          outstandingBalance: totalAmount,
          user: userId,
        });
      }
      await customer.save();
    }

    console.log("Backend sending this sale object to frontend:", newSale);
    res.status(201).json({ message: 'Sale recorded successfully', sale: newSale });
  } catch (error) {
    console.error('Error creating sale:', error);
    res.status(500).json({ message: 'Server error while creating sale.' });
  }
});

export default router;