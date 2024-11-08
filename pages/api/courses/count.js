// pages/api/courses/count.js
import dbConnect from '../../../lib/mongodb';
import Course from '../../../models/Course';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const { departmentCode, natureCode, levelDigit } = req.query;

      if (!departmentCode || !natureCode || !levelDigit) {
        return res.status(400).json({ message: 'Missing required query parameters' });
      }

      // Construct the regex pattern to match course codes
      const regexPattern = `^${departmentCode}${natureCode}${levelDigit}\\d{2}$`;
      const regex = new RegExp(regexPattern);

      // Count the number of courses matching the pattern
      const count = await Course.countDocuments({ courseCode: { $regex: regex } });

      res.status(200).json({ count });
    } catch (error) {
      console.error('Error counting courses:', error);
      res.status(500).json({ message: 'Failed to count courses', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}