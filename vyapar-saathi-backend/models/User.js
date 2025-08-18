import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    securityQuestion: {
      type: String,
      required: true,
    },
    securityAnswer: {
      type: String,
      required: true,
    },
    businessInfo: {
      name: { type: String, required: true },
      tagline: { type: String },
      address: { type: String },
      phone: { type: String },
      gstin: { type: String },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.pre('save', async function (next) {
  if (!this.isModified('securityAnswer')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt);
  next();
});

const User = mongoose.model('User', userSchema);

export default User;