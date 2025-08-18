import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  outstandingBalance: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });
customerSchema.index({ user: 1, phone: 1 }, { unique: true });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;