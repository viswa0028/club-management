// src/components/profile/UserProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getUserProfile, updatePassword } from '../../api/apiService';
import Sidebar from '../layout/Sidebar';

const UserProfile = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [passwordForm, setPasswordForm] = useState({
    username: currentUser?.username || '',
    password: '',
    confirmPassword: ''
  });
  
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const data = await getUserProfile(currentUser.username);
        setUserProfile(data.post_detail);
      } catch (err) {
        setError('Failed to load user profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.username) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setSuccess('');
    
    // Validate passwords match
    if (passwordForm.password !== passwordForm.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordLoading(true);
    
    try {
      // Only send username and password to API
      const { confirmPassword, ...passwordData } = passwordForm;
      await updatePassword(currentUser.username, passwordData);
      setSuccess('Password updated successfully');
      
      // Reset form
      setPasswordForm({
        username: currentUser?.username || '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setPasswordError(err.message || 'Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!currentUser) {
    return <div>Please login to view this page.</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="py-6 px-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : userProfile ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-indigo-600 rounded-full h-16 w-16 flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold text-white">{userProfile.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{userProfile.name}</h2>
                    <p className="text-sm text-gray-500">@{userProfile.username}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Username</p>
                    <p className="mt-1 text-sm text-gray-900">{userProfile.username}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Roll Number</p>
                    <p className="mt-1 text-sm text-gray-900">{userProfile.rollno}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 bg-gray-50">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                
                {passwordError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{passwordError}</span>
                  </div>
                )}
                
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{success}</span>
                  </div>
                )}
                
                <form onSubmit={handlePasswordSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        id="password"
                        required
                        value={passwordForm.password}
                        onChange={handlePasswordChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        required
                        value={passwordForm.confirmPassword}
                        onChange={handlePasswordChange}
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={passwordLoading}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      {passwordLoading ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;