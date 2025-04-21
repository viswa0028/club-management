// src/components/dashboard/ProjectCard.jsx
import { useState } from 'react';

const ProjectCard = ({ project }) => {
  const [isCompleted, setIsCompleted] = useState(project.completed);
  
  // Calculate days remaining
  const deadline = new Date(project.deadline);
  const today = new Date();
  const daysRemaining = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  
  const getStatusColor = () => {
    if (isCompleted) return 'bg-green-100 text-green-800';
    if (daysRemaining < 0) return 'bg-red-100 text-red-800';
    if (daysRemaining < 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-blue-100 text-blue-800';
  };
  
  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (daysRemaining < 0) return 'Overdue';
    if (daysRemaining === 0) return 'Due Today';
    if (daysRemaining === 1) return '1 day left';
    return `${daysRemaining} days left`;
  };

  // Format date to be more readable
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className={`border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow ${isCompleted ? 'opacity-75' : ''}`}>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{project.title}</h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Deadline:</span>
            <span className="font-medium">{formatDate(project.deadline)}</span>
          </div>
        </div>
        
        <div className="mt-4 flex items-center">
          <input
            id={`completed-${project.id}`}
            type="checkbox"
            checked={isCompleted}
            onChange={() => setIsCompleted(!isCompleted)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor={`completed-${project.id}`} className="ml-2 block text-sm text-gray-700">
            Mark as completed
          </label>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;