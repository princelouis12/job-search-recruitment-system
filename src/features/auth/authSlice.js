// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from './authAPI';
import { toast } from 'react-toastify';
import axios from 'axios';


// Set the base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:8080';

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const getUserFromStorage = () => {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      // Ensure role exists and is properly formatted
      if (parsedUser.role) {
        parsedUser.role = parsedUser.role.toLowerCase();
        return parsedUser;
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error('Error parsing user from localStorage:', error);
    localStorage.removeItem('user'); // Clear invalid data
    return null;
  }
};

const initialState = {
  user: getUserFromStorage(),
  isAuthenticated: !!getUserFromStorage(),
  isLoading: false,
  error: null,
  successMessage: null,
  passwordResetStatus: {
    emailSent: false,
    resetSuccess: false,
    resetError: null
  }
};

export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.register(userData);
      if (response?.role) {
        const userToStore = {
          ...response,
          role: response.role.toLowerCase()
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        return userToStore;
      }
      throw new Error('Invalid response format: missing role');
    } catch (error) {
      const message = error.response?.data || error.message || 'Registration failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await authService.login(userData);
      console.log('Login response:', response); // Debug log

      if (response?.role) {
        const userToStore = {
          ...response,
          role: response.role.toLowerCase()
        };
        localStorage.setItem('user', JSON.stringify(userToStore));
        return userToStore;
      }
      throw new Error('Invalid response format: missing role');
    } catch (error) {
      console.error('Login error:', error); // Debug log
      const message = error.response?.data || error.message || 'Login failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      const message = error.response?.data || error.message || 'Failed to send reset email';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }, thunkAPI) => {
    try {
      if (!token) throw new Error('Reset token is missing');
      if (!newPassword || newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      const message = error.response?.data || error.message || 'Password reset failed';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      await authService.logout();
      localStorage.removeItem('user');
      return null;
    } catch (error) {
      return thunkAPI.rejectWithValue('Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
      state.passwordResetStatus = {
        emailSent: false,
        resetSuccess: false,
        resetError: null
      };
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.successMessage = 'Registration successful!';
        toast.success('Registration successful!');
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        toast.error(typeof action.payload === 'string' ? action.payload : 'Registration failed');
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        console.log('User state after login:', action.payload); // Debug log
        state.successMessage = 'Login successful!';
        toast.success('Login successful!');
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = action.payload;
        toast.error(typeof action.payload === 'string' ? action.payload : 'Login failed');
      })
      // Forgot Password
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetStatus.emailSent = true;
        toast.success('Password reset email sent!');
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordResetStatus.resetError = action.payload;
        toast.error(typeof action.payload === 'string' ? action.payload : 'Failed to send reset email');
      })
      // Reset Password
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.passwordResetStatus.resetSuccess = true;
        toast.success('Password reset successful!');
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.passwordResetStatus.resetError = action.payload;
        toast.error(typeof action.payload === 'string' ? action.payload : 'Password reset failed');
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        toast.success('Logged out successfully');
      });
  },
});

export const { reset, clearMessages } = authSlice.actions;
export default authSlice.reducer;