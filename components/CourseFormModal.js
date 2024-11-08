// components/CourseFormModal.js

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import axios from 'axios';

const CourseFormModal = ({ course, onClose, onSave }) => {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: course,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use useEffect to reset form values when the course prop changes
  useEffect(() => {
    reset(course);
  }, [course, reset]);

  // For dynamic fields like CLOs, Assessments, etc.
  const { fields: cloFields, append: appendCLO, remove: removeCLO } = useFieldArray({
    control,
    name: 'clOs',
  });

  // Similarly, setup field arrays for other dynamic sections
  const { fields: assessmentFields, append: appendAssessment, remove: removeAssessment } = useFieldArray({
    control,
    name: 'assessments',
  });

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/api/admin/courses/${course._id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onSave(res.data.course);
    } catch (err) {
      console.error('Error updating course:', err);
      setError('Failed to update course.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-4xl max-h-screen overflow-y-scroll">
        <h2 className="text-xl font-semibold mb-4">Edit Course</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Course Specification */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Course Specification</h3>
            <div className="mb-4">
              <label className="block mb-1">Course Code</label>
              <input
                {...register('courseCode', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {/* Add other fields similarly */}
            {/* Course Name */}
            <div className="mb-4">
              <label className="block mb-1">Course Name</label>
              <input
                {...register('courseName', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {/* Course Type */}
            <div className="mb-4">
              <label className="block mb-1">Course Type</label>
              <select
                {...register('courseType', { required: true })}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Course Type</option>
                <option value="Core">Core</option>
                <option value="Elective">Elective</option>
                {/* Add other options as needed */}
              </select>
            </div>
            {/* Department */}
            <div className="mb-4">
              <label className="block mb-1">Department</label>
              <input
                {...register('department', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {/* Total Credit Hours */}
            <div className="mb-4">
              <label className="block mb-1">Total Credit Hours</label>
              <input
                type="number"
                {...register('hoursTotal', { required: true })}
                className="w-full border px-3 py-2 rounded"
              />
            </div>
            {/* Credit Structure */}
            <div className="mb-4">
              <label className="block mb-1">Credit Structure</label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block mb-1">Lecture</label>
                  <input
                    type="number"
                    {...register('creditStructure.lecture', { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Tutorial</label>
                  <input
                    type="number"
                    {...register('creditStructure.tutorial', { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-1">Lab</label>
                  <input
                    type="number"
                    {...register('creditStructure.lab', { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
              </div>
            </div>
            {/* Pre-requisites */}
            <div className="mb-4">
              <label className="block mb-1">Pre-requisites</label>
              <input
                {...register('preRequisites')}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter course codes separated by commas"
              />
            </div>
          </div>

          {/* Course Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Course Description</h3>
            {/* Course Contents */}
            <div className="mb-4">
              <label className="block mb-1">Course Contents</label>
              <textarea
                {...register('courseDescription.courseContents', { required: true })}
                className="w-full border px-3 py-2 rounded"
              ></textarea>
            </div>
            {/* Target Audience */}
            <div className="mb-4">
              <label className="block mb-1">Target Audience</label>
              <textarea
                {...register('courseDescription.targetAudience', { required: true })}
                className="w-full border px-3 py-2 rounded"
              ></textarea>
            </div>
            {/* Industry Relevance */}
            <div className="mb-4">
              <label className="block mb-1">Industry Relevance</label>
              <textarea
                {...register('courseDescription.industryRelevance', { required: true })}
                className="w-full border px-3 py-2 rounded"
              ></textarea>
            </div>
          </div>

          {/* Course Resources */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Course Resources</h3>
            <div className="mb-4">
              <label className="block mb-1">Resources</label>
              <textarea
                {...register('courseResources')}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter resources separated by commas"
              ></textarea>
            </div>
          </div>

          {/* Course Learning Outcomes (CLOs) */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Course Learning Outcomes (CLOs)</h3>
            {cloFields.map((field, index) => (
              <div key={field.id} className="mb-4 border p-4 rounded">
                <label className="block mb-1">CLO Description</label>
                <textarea
                  {...register(`clOs.${index}.description`, { required: true })}
                  className="w-full border px-3 py-2 rounded"
                ></textarea>
                <button
                  type="button"
                  className="mt-2 text-red-500 underline"
                  onClick={() => removeCLO(index)}
                >
                  Remove CLO
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => appendCLO({ description: '' })}
            >
              Add CLO
            </button>
          </div>

          {/* Assessments */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Assessments</h3>
            {assessmentFields.map((field, index) => (
              <div key={field.id} className="mb-4 border p-4 rounded">
                {/* CLO */}
                <div className="mb-2">
                  <label className="block mb-1">CLO</label>
                  <input
                    {...register(`assessments.${index}.clo`, { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                {/* Assessment Type */}
                <div className="mb-2">
                  <label className="block mb-1">Assessment Type</label>
                  <input
                    {...register(`assessments.${index}.assessmentType`, { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                {/* Method */}
                <div className="mb-2">
                  <label className="block mb-1">Assessment Method</label>
                  <input
                    {...register(`assessments.${index}.assessmentMethod`, { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                {/* Description */}
                <div className="mb-2">
                  <label className="block mb-1">Description</label>
                  <textarea
                    {...register(`assessments.${index}.assessmentDescription`, { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  ></textarea>
                </div>
                {/* Weight */}
                <div className="mb-2">
                  <label className="block mb-1">Weight (%)</label>
                  <input
                    type="number"
                    {...register(`assessments.${index}.weight`, { required: true })}
                    className="w-full border px-3 py-2 rounded"
                  />
                </div>
                <button
                  type="button"
                  className="mt-2 text-red-500 underline"
                  onClick={() => removeAssessment(index)}
                >
                  Remove Assessment
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white px-4 py-2 rounded"
              onClick={() => appendAssessment({})}
            >
              Add Assessment
            </button>
          </div>

          {/* Add other sections like CLO to PLO mappings, Teaching Methods, etc., in a similar way */}

          {error && <p className="text-red-500">{error}</p>}

          {/* Form Buttons */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseFormModal;