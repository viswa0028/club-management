import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import Dashboard from '../components/dashboard/Dashboard';
import Footer from '../components/layout/Footer';

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Fetch projects - replace with actual API call
    const fetchProjects = async () => {
      try {
        setLoading(true);
        // Mock API call - replace with actual implementation
        // const response = await apiService.getProjects(currentUser.id);
        
        // Simulated data
        const mockProjects = [
          {
            id: '1',
            title: 'Website Redesign',
            description: 'Modernize the company website with new design and features',
            status: 'In Progress',
            deadline: '2025-05-30',
            completionPercentage: 65
          },
          {
            id: '2',
            title: 'Mobile App Development',
            description: 'Create a companion mobile app for our web platform',
            status: 'Planning',
            deadline: '2025-07-15',
            completionPercentage: 20
          },
          {
            id: '3',
            title: 'Database Migration',
            description: 'Migrate legacy database to new cloud-based solution',
            status: 'Completed',
            deadline: '2025-04-10',
            completionPercentage: 100
          }
        ];
        
        setProjects(mockProjects);
      } catch (err) {
        setError('Failed to load projects. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser, navigate]);

  const addProject = (project) => {
    // Mock implementation - replace with actual API call
    const newProject = {
      ...project,
      id: Date.now().toString(),
      completionPercentage: 0
    };
    setProjects([...projects, newProject]);
  };

  return (
    <div className="dashboard-page">
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <main className="dashboard-content">
          {error && <div className="error-message">{error}</div>}
          <Dashboard 
            projects={projects} 
            loading={loading} 
            onAddProject={addProject}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;