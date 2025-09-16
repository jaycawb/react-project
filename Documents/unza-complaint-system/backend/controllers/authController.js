//backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import { findUserByComputerNumber } from '../models/User.js';

export const login = async (req, res) => {
  const { computer_number, password } = req.body;
  const user = await findUserByComputerNumber(computer_number);
  if (!user || user.password !== password) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = jwt.sign({ computer_number: user.computer_number }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ success: true, token, user });
};
