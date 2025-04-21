// src/components/dashboard/AddProject.jsx
import { useState } from 'react';
import { addProject } from '../../api/apiService';

const AddProject = ({ username, onProjectAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
    completed: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.title || !formData.deadline) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const projectData = {
        ...formData,
        username
      };
      
      const newProject = await addProject(username, projectData);
      onProjectAdded(newProject);
      
      // Reset form
      setFormData({
        title: '',
        deadline: '',
        completed: false
      });
    } catch (err) {
      setError(err.message || 'Failed to add project');
    } finally {
      setLoading(false);
    }
  };

  // Get today's date for min value of deadline input
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Project</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Project Title *
            </label>
            <input
              type="text"
              name="title"
              id="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
              Deadline *
            </label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              required
              min={today}
              value={formData.deadline}
              onChange={handleChange}
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex items-center">
            <input
              id="completed"
              name="completed"
              type="checkbox"
              checked={formData.completed}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="completed" className="ml-2 block text-sm text-gray-700">
              Mark as completed
            </label>
          </div>
        </div>
        
        <div className="mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Adding...' : 'Add Project'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject; 