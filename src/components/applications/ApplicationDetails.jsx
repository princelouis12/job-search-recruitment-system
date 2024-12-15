import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material';
import { Button, Typography, Box, Stepper, Step, StepLabel, Card } from '@mui/material';
import { StatusManagementDialog } from '../applications';
import { toast } from 'react-toastify';
import { TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { Alert, Divider, Grid, IconButton, Stack } from '@mui/material';
import { Description, AttachFile, Close, Send } from '@mui/icons-material';
import axios from 'axios';

const ApplicationDetails = ({ 
  application, 
  open, 
  onClose,
  onUpdateStatus,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const { user } = useSelector((state) => state.auth);
  const isEmployer = user?.role?.toLowerCase() === 'employer';

  // Application flow steps
  const steps = [
    'Application Received',
    'Under Review',
    'Shortlisted',
    'Interview Scheduled'
  ];

  // Map status to step index
  const getStepIndex = (status) => {
    switch (status) {
      case 'PENDING': return 0;
      case 'REVIEWING': return 1;
      case 'SHORTLISTED': return 2;
      case 'INTERVIEWED': return 3;
      default: return 0;
    }
  };

  const handleViewResume = async () => {
    try {
      if (!application?.resumeUrl) {
        toast.error('No resume file found');
        return;
      }
  
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user?.token) {
        toast.error('Authentication required');
        return;
      }
  
      const response = await axios.get(`/api/applications/files/${application.resumeUrl}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        responseType: 'blob'
      });
  
      const blob = new Blob([response.data], {
        type: response.headers['content-type']
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      console.error('Resume download error:', error);
      toast.error(error.response?.data?.message || 'Failed to load resume');
    }
  };

  const handleSendAcknowledgement = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      await axios.post(`/api/applications/${application.id}/acknowledge`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      toast.success('Acknowledgement sent successfully');
      
      // Update application status to REVIEWING if currently PENDING
      if (application.status === 'PENDING') {
        setNewStatus('REVIEWING');
        await handleUpdateStatus('REVIEWING', 'Application acknowledged and under review.');
      }

      // If there's a callback for updates, call it
      if (onUpdateStatus) {
        onUpdateStatus();
      }
    } catch (error) {
      console.error('Acknowledgement error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to send acknowledgement';
      toast.error(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (status, feedbackText) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      await axios.put(`/api/applications/${application.id}/status`, {
        status: status || newStatus,
        feedback: feedbackText || feedback
      }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      toast.success('Status updated successfully');
      
      // Clear form fields
      setFeedback('');
      setNewStatus('');

      // If there's a callback for updates, call it
      if (onUpdateStatus) {
        onUpdateStatus();
      }
    } catch (error) {
      console.error('Status update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update status';
      toast.error(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
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
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Application Details</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        {/* Application Progress - Visible to both */}
        <Box sx={{ mb: 4 }}>
          <Stepper activeStep={getStepIndex(application?.status)}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={3}>
          {/* Applicant Details - Visible to both */}
          <Grid item xs={12}>
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Applicant Information</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Name</Typography>
                  <Typography>{application?.applicant?.name}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Email</Typography>
                  <Typography>{application?.applicant?.email}</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          {/* Cover Letter - Visible to both */}
          <Grid item xs={12}>
            <Card sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Cover Letter</Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                {application?.coverLetter}
              </Typography>
            </Card>
          </Grid>

          {/* Resume Section - Visible to both but with different permissions */}
          <Grid item xs={12}>
            <Card sx={{ p: 2, mb: 2 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Resume</Typography>
                <Button
                  variant="outlined"
                  startIcon={<Description />}
                  onClick={handleViewResume}
                  disabled={!application?.resumeUrl}
                >
                  View Resume
                </Button>
              </Box>
            </Card>
          </Grid>

          {/* Status Update Section - Only visible to employers */}
          {isEmployer && (
            <Grid item xs={12}>
              <Card sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Update Application Status</Typography>
                <Stack spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel>New Status</InputLabel>
                    <Select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      label="New Status"
                    >
                      <MenuItem value="PENDING">Pending Review</MenuItem>
                      <MenuItem value="REVIEWING">Under Review</MenuItem>
                      <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
                      <MenuItem value="INTERVIEWED">Interview Scheduled</MenuItem>
                      <MenuItem value="REJECTED">Rejected</MenuItem>
                    </Select>
                  </FormControl>

                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Feedback/Notes"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />

                  <Box display="flex" gap={2}>
                    <Button
                      variant="contained"
                      disabled={!newStatus || loading}
                      onClick={() => handleUpdateStatus(newStatus, feedback)}
                    >
                      Update Status
                    </Button>
                    {application?.status === 'PENDING' && (
                      <Button
                        variant="outlined"
                        startIcon={<Send />}
                        onClick={handleSendAcknowledgement}
                        disabled={loading}
                      >
                        Send Acknowledgement
                      </Button>
                    )}
                  </Box>
                </Stack>
              </Card>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDetails;