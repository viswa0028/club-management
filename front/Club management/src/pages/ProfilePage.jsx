import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import UserProfile from '../components/profile/UserProfile';
import Footer from '../components/layout/Footer';

const ProfilePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleUpdateProfile = async (userData) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateProfile(userData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-container">
        <Sidebar />
        <main className="profile-content">
          <h1>My Profile</h1>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <UserProfile 
            user={currentUser} 
            onUpdateProfile={handleUpdateProfile}
            loading={loading}
          />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;