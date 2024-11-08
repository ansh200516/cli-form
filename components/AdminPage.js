// components/AdminPage.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import Card from './ui/Card';
import Button from './ui/Button';
import Modal from './ui/Modal';

const AdminPage = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [previewCourse, setPreviewCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(res.data.courses);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses. Please try again.');
      }
    };

    fetchCourses();
  }, []);

  const handleAccept = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `/api/admin/courses/${courseId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error('Error accepting course:', err);
      setError('Failed to accept the course. Please try again.');
    }
  };

  const handleReject = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/admin/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(courses.filter((course) => course._id !== courseId));
    } catch (err) {
      console.error('Error rejecting course:', err);
      setError('Failed to reject the course. Please try again.');
    }
  };

  const handleView = (course) => {
    setPreviewCourse(course);
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="space-y-4">
        {courses.map((course) => (
          <Card key={course._id} className="p-4">
            <h2 className="text-xl font-semibold mb-2">{course.courseName}</h2>
            <p className="mb-2">Course Code: {course.courseCode}</p>
            <div className="flex space-x-2">
              <Button variant="default" onClick={() => handleView(course)}>
                View
              </Button>
              <Button variant="success" onClick={() => handleAccept(course._id)}>
                Accept
              </Button>
              <Modal
                trigger={
                  <Button variant="destructive">Reject</Button>
                }
                title="Confirm Rejection"
                description="Are you sure you want to reject this course? This action cannot be undone."
                onConfirm={() => handleReject(course._id)}
                onClose={() => {}}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Preview Modal */}
      {previewCourse && (
        <Modal
          isOpen={true}
          onClose={() => setPreviewCourse(null)}
          title="Course Preview"
          description=""
        >
          <div>
            {/* Display course details */}
            <h2 className="text-xl font-semibold mb-2">{previewCourse.courseName}</h2>
            <p className="mb-2">Course Code: {previewCourse.courseCode}</p>
            {/* Include other course details as needed */}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPage;