// src/features/auth/authAPI.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// Add axios interceptor to handle token
axios.interceptors.request.use(
  (config) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user?.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in axios interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Validate user data before storing
const validateUserData = (data) => {
  if (!data) return false;
  const requiredFields = ['id', 'name', 'email', 'role', 'token'];
  return requiredFields.every(field => data.hasOwnProperty(field));
};

// Format error message
const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error.response?.data) {
    return typeof error.response.data === 'string' 
      ? error.response.data 
      : error.response.data.message || 'An error occurred';
  }
  return error.message || 'An error occurred';
};

const authService = {
  // Register user
  register: async (userData) => {
    try {
      console.log('Sending registration request:', {
        ...userData,
        password: '[HIDDEN]' // Don't log password
      });

      const response = await axios.post(`${API_URL}/register`, userData);
      console.log('Registration response:', response.data);

      if (!validateUserData(response.data)) {
        throw new Error('Invalid response data format');
      }

      const userToStore = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        token: response.data.token
      };

      localStorage.setItem('user', JSON.stringify(userToStore));
      return userToStore;
    } catch (error) {
      console.error('Registration error:', error);
      throw formatErrorMessage(error);
    }
  },

  // Login user
  login: async (userData) => {
    try {
      console.log('Sending login request:', {
        email: userData.email,
        password: '[HIDDEN]'
      });

      const response = await axios.post(`${API_URL}/login`, userData);
      console.log('Login response:', response.data);

      if (!validateUserData(response.data)) {
        console.error('Invalid response data:', response.data);
        throw new Error('Invalid response data format');
      }

      const userToStore = {
        id: response.data.id,
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        token: response.data.token
      };

      localStorage.setItem('user', JSON.stringify(userToStore));
      return userToStore;
    } catch (error) {
      console.error('Login error:', error);
      throw formatErrorMessage(error);
    }
  },

  // Forgot password request
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw formatErrorMessage(error);
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(`${API_URL}/reset-password`, {
        token,
        newPassword
      });
      return response.data;
    } catch (error) {
      console.error('Reset password error:', error);
      throw formatErrorMessage(error);
    }
  },

  // Get current user profile
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/profile`);
      
      if (!validateUserData(response.data)) {
        throw new Error('Invalid user profile data');
      }
      
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw formatErrorMessage(error);
    }
  },

  // Logout user
  logout: () => {
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  // Validate stored user data
  validateStoredUser: () => {
    try {
      const userData = localStorage.getItem('user');
      if (!userData) return null;

      const user = JSON.parse(userData);
      if (!validateUserData(user)) {
        localStorage.removeItem('user');
        return null;
      }

      return user;
    } catch (error) {
      console.error('Validate stored user error:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
};

export default authService;