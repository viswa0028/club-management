import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the authentication context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setError('');
      // Replace with your actual API call
      // const response = await apiService.login(email, password);
      
      // For demonstration (replace with actual API implementation)
      const mockResponse = { 
        id: '123', 
        email, 
        name: 'User Name', 
        token: 'mock-jwt-token' 
      };
      
      setCurrentUser(mockResponse);
      localStorage.setItem('user', JSON.stringify(mockResponse));
      return mockResponse;
    } catch (err) {
      setError(err.message || 'Failed to login');
      throw err;
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      setError('');
      // Replace with your actual API call
      // const response = await apiService.register(name, email, password);
      
      // For demonstration (replace with actual API implementation)
      const mockResponse = { 
        id: '123', 
        email, 
        name, 
        token: 'mock-jwt-token' 
      };
      
      setCurrentUser(mockResponse);
      localStorage.setItem('user', JSON.stringify(mockResponse));
      return mockResponse;
    } catch (err) {
      setError(err.message || 'Failed to register');
      throw err;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError('');
      // Replace with your actual API call
      // const response = await apiService.updateProfile(userData);
      
      // For demonstration (replace with actual API implementation)
      const updatedUser = { ...currentUser, ...userData };
      
      setCurrentUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;