// pages/api/admin/courses/[id]/index.js

import dbConnect from '../../../../../lib/mongodb';
import { authenticateAdmin } from '../../../../../lib/auth';
import Course from '../../../../../models/Course';

export default async function handler(req, res) {
  await dbConnect();
  await authenticateAdmin(req, res);

  const { id } = req.query;

  if (req.method === 'DELETE') {
    try {
      const course = await Course.findByIdAndDelete(id);

      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else if (req.method === 'PUT') {
    try {
      const updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.status(200).json({ message: 'Course updated successfully', course: updatedCourse });
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}