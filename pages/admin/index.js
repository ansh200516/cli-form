// pages/admin/index.js

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Card from '../../components/ui/Card';
import CourseFormModal from '../../components/CourseFormModal';

const AdminDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const res = await axios.get('/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setCourses(res.data.courses);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses. Please try again.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const handleApprove = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/admin/courses/${courseId}/approve`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error('Error approving course:', error);
    }
  };

  const handleReject = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.length === 0 ? (
          <p>No pending courses.</p>
        ) : (
          courses.map((course) => (
            <Card key={course._id}>
              <h2 className="text-xl font-semibold">{course.courseName}</h2>
              <p>Course Code: {course.courseCode}</p>
              <p>Status: {course.status}</p>
              {/* Include additional course details as needed */}
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => {
                    setSelectedCourse(course);
                    setIsModalOpen(true);
                  }}
                >
                  View
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => handleApprove(course._id)}
                >
                  Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={() => handleReject(course._id)}
                >
                  Reject
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
      {/* Render the modal */}
      {isModalOpen && (
        <CourseFormModal
          course={selectedCourse}
          onClose={() => setIsModalOpen(false)}
          onSave={(updatedCourse) => {
            // Update the course in the state
            setCourses((prevCourses) =>
              prevCourses.map((course) =>
                course._id === updatedCourse._id ? updatedCourse : course
              )
            );
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;