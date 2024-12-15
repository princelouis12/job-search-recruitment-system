import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Container,
  Grid,
} from '@mui/material';
import { ApplicationList, ApplicationDetails } from '../../components/applications';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/applications/my-applications', {
        headers: {
          Authorization: `Bearer ${user?.token}`
        }
      });
      setApplications(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Applications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : applications.length === 0 ? (
          <Alert severity="info">
            You haven't submitted any applications yet.
          </Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <ApplicationList
                  applications={applications}
                  onViewApplication={handleViewApplication}
                  isJobSeeker={true}
                />
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Application Details Dialog */}
        {selectedApplication && (
          <ApplicationDetails
            application={selectedApplication}
            open={Boolean(selectedApplication)}
            onClose={() => setSelectedApplication(null)}
            isJobSeeker={true}
          />
        )}
      </Box>
    </Container>
  );
};

export default MyApplications;