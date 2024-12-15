import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'; // Add this import
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stepper,
  Step,
  StepLabel,
  Divider,
  TextField,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import {
  Description as DescriptionIcon,
  AssignmentInd as AssignmentIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const statusSteps = [
  'Application Received',
  'Under Review',
  'Shortlisted',
  'Interview Scheduled',
  'Offer Extended',
  'Hired',
];

const getStatusIndex = (status) => {
  const statusMap = {
    'PENDING': 0,
    'REVIEWING': 1,
    'SHORTLISTED': 2,
    'INTERVIEWED': 3,
    'OFFERED': 4,
    'ACCEPTED': 5,
    'REJECTED': -1,
  };
  return statusMap[status] || 0;
};

const ApplicationDetailsModal = ({ open, applicationId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [application, setApplication] = useState(null);
  const [feedback, setFeedback] = useState('');
  const { user } = useSelector((state) => state.auth); // Add this line

  const fetchApplicationDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add authorization header
      const config = {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      };
      
      const response = await axios.get(`/api/applications/employer/${applicationId}`, config);
      console.log('Application response:', response.data);
      setApplication(response.data);
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.data?.message || 'Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  }, [applicationId, user?.token]);

  useEffect(() => {
    if (open && applicationId) {
      fetchApplicationDetails();
    }
  }, [open, applicationId, fetchApplicationDetails]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      const response = await axios.put(`/api/applications/${applicationId}/status`, {
        status: newStatus,
        feedback,
      }, {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      setApplication(response.data);
      setFeedback('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async () => {
    if (!application?.resumeUrl) return;
    
    try {
      const response = await axios.get(`/api/applications/files/${application.resumeUrl}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (err) {
      setError('Failed to load resume');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">Application Details</Typography>
        {application?.job && (
          <Typography variant="subtitle1" color="text.secondary">
            {application.job.title}
          </Typography>
        )}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
        ) : application && (
          <Stack spacing={3}>
            <Box sx={{ mt: 2 }}>
              <Stepper activeStep={getStatusIndex(application.status)} alternativeLabel>
                {statusSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

            <Divider />

            <Box>
              <Typography variant="h6" gutterBottom>
                Applicant Information
              </Typography>
              <Stack spacing={1}>
                <Typography>
                  <strong>Name:</strong> {application.applicant?.name}
                </Typography>
                <Typography>
                  <strong>Email:</strong> {application.applicant?.email}
                </Typography>
                <Typography>
                  <strong>Applied Date:</strong>{' '}
                  {format(new Date(application.appliedDate), 'PPP')}
                </Typography>
              </Stack>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Cover Letter
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {application.coverLetter}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h6" gutterBottom>
                Status Update
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback for the candidate..."
              />
            </Box>
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleViewResume}
          startIcon={<DescriptionIcon />}
          disabled={!application?.resumeUrl}
        >
          View Resume
        </Button>
        <Button
          onClick={() => handleStatusUpdate('REVIEWING')}
          disabled={loading || application?.status !== 'PENDING'}
          startIcon={<AssignmentIcon />}
        >
          Start Review
        </Button>
        <Button
          onClick={() => handleStatusUpdate('SHORTLISTED')}
          disabled={loading || application?.status !== 'REVIEWING'}
          startIcon={<ScheduleIcon />}
          color="primary"
        >
          Shortlist
        </Button>
        <Button onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDetailsModal;