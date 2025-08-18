import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  billNumber: {
    type: Number,
    required: true,
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
  }],
  totalAmount: {
    type: Number,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['Cash', 'UPI', 'Card', 'Udhaar'],
  },
  customerName: { type: String },
  customerPhone: { type: String },
  discount: { type: Number, default: 0 },
  taxRate: { type: Number, default: 0 },
}, { timestamps: true });

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;