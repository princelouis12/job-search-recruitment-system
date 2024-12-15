import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from '@mui/material';

const ApplicationTabs = {
  ALL: 0,
  PENDING: 1,
  REVIEWING: 2,
  SHORTLISTED: 3,
  INTERVIEWED: 4,
  OFFERED: 5,
  ACCEPTED: 6,
  REJECTED: 7,
};

const Applications = () => {
  const [activeTab, setActiveTab] = useState(ApplicationTabs.ALL);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the token from localStorage
      const token = user?.token;
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Make the API request with the token
      const response = await axios.get('/api/applications/employer', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Applications response:', response.data); // Debug log
      setApplications(response.data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError(
        err.response?.data?.message || 
        err.message || 
        'Failed to fetch applications. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterApplications = () => {
    if (activeTab === ApplicationTabs.ALL) {
      return applications;
    }
    
    const statusMap = {
      [ApplicationTabs.PENDING]: 'PENDING',
      [ApplicationTabs.REVIEWING]: 'REVIEWING',
      [ApplicationTabs.SHORTLISTED]: 'SHORTLISTED',
      [ApplicationTabs.INTERVIEWED]: 'INTERVIEWED',
      [ApplicationTabs.OFFERED]: 'OFFERED',
      [ApplicationTabs.ACCEPTED]: 'ACCEPTED',
      [ApplicationTabs.REJECTED]: 'REJECTED',
    };

    return applications.filter(app => app.status === statusMap[activeTab]);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Manage Applications
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Applications" />
          <Tab label="Pending" />
          <Tab label="Reviewing" />
          <Tab label="Shortlisted" />
          <Tab label="Interviewed" />
          <Tab label="Offered" />
          <Tab label="Accepted" />
          <Tab label="Rejected" />
        </Tabs>
      </Paper>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress />
        </Box>
      ) : applications.length === 0 ? (
        <Alert severity="info">
          No applications found.
        </Alert>
      ) : (
        <Box>
          {filterApplications().map((application) => (
            <Paper key={application.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">
                {application.job?.title}
              </Typography>
              <Typography variant="body1">
                Applicant: {application.applicant?.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Status: {application.status}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Applied: {new Date(application.appliedDate).toLocaleDateString()}
              </Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Applications;