// src/api/apiService.js
const API_URL = 'http://localhost:8000'; // Change to your API URL

// User related API calls
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/newuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (username) => {
  try {
    const response = await fetch(`${API_URL}/newuser/${username}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch user profile');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updatePassword = async (username, passwordData) => {
  try {
    const response = await fetch(`${API_URL}/newuser/${username}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update password');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// Project related API calls
export const getUserProjects = async (username) => {
  try {
    const response = await fetch(`${API_URL}/login/${username}/projects`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to fetch projects');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const addProject = async (username, projectData) => {
  try {
    const response = await fetch(`${API_URL}/login/${username}/addproject`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projectData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to add project');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};