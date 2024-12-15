// src/features/notifications/notificationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/notifications');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    items: [],
    unreadCount: 0,
    isLoading: false,
    error: null,
    categories: {
      jobMatches: 0,
      applications: 0,
      messages: 0,
      system: 0
    }
  },
  reducers: {
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0;
    },
    updateUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      state.unreadCount += 1;
      state.categories[action.payload.category] += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
        state.unreadCount = action.payload.filter(n => !n.read).length;
        // Update category counts
        state.categories = {
          jobMatches: 0,
          applications: 0,
          messages: 0,
          system: 0
        };
        action.payload.forEach(notification => {
          if (!notification.read) {
            state.categories[notification.category]++;
          }
        });
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find(n => n.id === action.payload.id);
        if (notification && !notification.read) {
          notification.read = true;
          state.unreadCount -= 1;
          state.categories[notification.category] -= 1;
        }
      });
  }
});

export const { clearNotifications, updateUnreadCount, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;