// pages/api/auth/login.js

import dbConnect from '../../../lib/mongodb';
import User from '../../../models/User';
import { signToken } from '../../../lib/auth';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { kerberosId, password } = req.body;

  if (!kerberosId || !password) {
    return res.status(400).json({ message: 'Kerberos ID and password are required' });
  }

  try {
    const user = await User.findOne({ kerberosId });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      isAdmin: user.isAdmin, // Include isAdmin flag
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}