// lib/auth.js

import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export const signToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = user;
    if (next) {
      next(); // Proceed to the next middleware or route handler
    }
  } catch (e) {
    console.error('Authentication Error:', e); // Logging the error
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    req.user = user;
    if (next) {
      next();
    }
  } catch (e) {
    console.error('Admin Authentication Error:', e); // Logging the error
    return res.status(401).json({ message: 'Invalid token' });
  }
};