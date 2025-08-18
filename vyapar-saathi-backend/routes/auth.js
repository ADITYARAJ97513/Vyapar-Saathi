import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();
router.post('/register', async (req, res) => {
  const { email, password, securityQuestion, securityAnswer, businessInfo } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    user = new User({
      email,
      password,
      securityQuestion,
      securityAnswer, 
      businessInfo,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          businessInfo: user.businessInfo,
        });
      }
    );
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});
router.post('/get-question', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ securityQuestion: user.securityQuestion });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/verify-answer', async (req, res) => {
    const { email, securityAnswer } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const isMatch = await bcrypt.compare(securityAnswer, user.securityAnswer);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect answer.' });
        }
        const payload = { user: { id: user.id } };
        const resetToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' }); 

        res.json({ resetToken });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
    if (!resetToken) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ message: 'Password has been reset successfully.' });
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid or has expired.' });
    }
});

export default router;