// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

const authService = {
  login: async (credentials) => {
    const response = await axios.post(API_URL + 'signin', credentials);
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  register: async (userData) => {
    const response = await axios.post(API_URL + 'signup', userData);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axios.post(API_URL + 'forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, newPassword) => {
    const response = await axios.post(API_URL + 'reset-password', {
      token,
      newPassword,
    });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  // Add token to axios headers
  setupAxiosInterceptors: (token) => {
    axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },
};

export default authService;