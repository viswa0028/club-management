// src/components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../layout/Sidebar';
import ProjectList from './ProjectList';
import AddProject from './AddProject';
import { getUserProjects } from '../../api/apiService';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await getUserProjects(currentUser.username);
        setProjects(response.projects || []);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.username) {
      fetchProjects();
    }
  }, [currentUser]);

  const handleAddProject = (newProject) => {
    setProjects([...projects, newProject]);
    setShowAddProject(false);
  };

  if (!currentUser) {
    return <div>Please login to view this page.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="py-6 px-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {currentUser.username}
            </h1>
            <button
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              {showAddProject ? 'Cancel' : 'Add Project'}
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {showAddProject && (
            <div className="mb-8">
              <AddProject 
                username={currentUser.username} 
                onProjectAdded={handleAddProject}
              />
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <ProjectList projects={projects} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;