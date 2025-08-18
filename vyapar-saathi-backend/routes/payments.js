import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  console.log('--- New Payment Order Request ---');
  console.log(`Received payload:`, req.body);
  console.log(`Attempting to create order for amount: ${amount}`);

  if (typeof amount !== 'number' || isNaN(amount) || amount < 1) {
    console.error('Validation Failed: Invalid amount received.');
    return res.status(400).json({ message: `Invalid amount. Amount must be at least ₹1. Received: ${amount}` });
  }

  const options = {
    amount: Math.round(amount * 100),
    currency: 'INR',
    receipt: `receipt_order_${new Date().getTime()}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    console.log('Razorpay order created successfully:', order.id);
    res.status(200).json(order);
  } catch (error) {
    console.error('Razorpay API Error:', error);
    res.status(500).json({ message: 'Server error while creating payment order.' });
  }
});

router.post('/verify', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ status: 'success' });
  } else {
    res.status(400).json({ status: 'failure' });
  }
});

export default router;