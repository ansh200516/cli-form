// pages/api/admin/courses/index.js
import dbConnect from '../../../../lib/mongodb';
import { authenticateAdmin } from '../../../../lib/auth';
import Course from '../../../../models/Course';

export default async function handler(req, res) {
  await dbConnect();

  await authenticateAdmin(req, res);

  if (req.method === 'GET') {
    try {
      const courses = await Course.find({ status: 'pending' });
      res.status(200).json({ courses });
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
