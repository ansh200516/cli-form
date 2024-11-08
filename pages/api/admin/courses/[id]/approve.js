// pages/api/admin/courses/[id]/approve.js

import dbConnect from '../../../../../lib/mongodb';
import { authenticateAdmin } from '../../../../../lib/auth';
import Course from '../../../../../models/Course';

export default async function handler(req, res) {
  await dbConnect();
  await authenticateAdmin(req, res);

  if (req.method === 'POST') {
    try {
      const { id } = req.query;
      const course = await Course.findById(id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      course.status = 'accepted';
      await course.save();

      res.status(200).json({ message: 'Course approved' });
    } catch (error) {
      console.error('Error approving course:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}