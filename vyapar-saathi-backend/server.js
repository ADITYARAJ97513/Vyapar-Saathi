import dotenv from 'dotenv';
// Load environment variables FIRST, before any other imports
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

// Import all your application's route files
import productRoutes from './routes/products.js';
import saleRoutes from './routes/sales.js';
import expenseRoutes from './routes/expenses.js';
import customerRoutes from './routes/customers.js';
import reportRoutes from './routes/reports.js';
import paymentRoutes from './routes/payments.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- API Routes ---
// This section connects your routes to the server. It was missing.
app.use('/api/products', productRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/auth', authRoutes);

// --- Health Check Endpoint ---
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Vyapar Saathi Server is running!' });
});

// --- MongoDB Connection ---
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB connected successfully.');
  app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB connection failed:', error.message);
});