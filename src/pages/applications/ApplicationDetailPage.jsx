import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  Grid, 
  CircularProgress,
  Stack,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import {
  Description as DescriptionIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  CalendarToday as CalendarIcon,
  AssignmentReturn as StatusIcon,
  Send as SendIcon
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const { user } = useSelector((state) => state.auth);
  const isEmployer = user?.role?.toLowerCase() === 'employer';

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`/api/applications/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setApplication(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch application details');
      toast.error('Failed to fetch application details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendAcknowledgement = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user?.token) {
        throw new Error('Authentication required');
      }

      await axios.post(`/api/applications/${id}/acknowledge`, null, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });

      toast.success('Acknowledgement sent successfully');
      
      // Update application status to REVIEWING if currently PENDING
      if (application?.status === 'PENDING') {
        await handleUpdateStatus('REVIEWING', 'Application acknowledged and under review.');
      }

      // Refresh application details
      await fetchApplicationDetails();
    } catch (error) {
      console.error('Acknowledgement error:', error);
      toast.error(error.response?.data?.message || 'Failed to send acknowledgement');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!user?.token) {
        throw new Error('Authentication required');
      }
  
      console.log('Sending update with:', { newStatus, feedback }); // Debug log
  
      await axios.put(`/api/applications/${id}/status`, 
        {
          status: newStatus,
          feedback: feedback
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      toast.success('Status updated successfully');
      
      // Clear form fields
      setFeedback('');
      setNewStatus('');
  
      // Refresh application details
      await fetchApplicationDetails();
    } catch (error) {
      console.error('Status update error:', error.response || error);
      toast.error(error.response?.data || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResume = async () => {
    try {
      if (!application?.resumeUrl) {
        toast.error('No resume file available');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`/api/applications/files/${application.resumeUrl}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
        responseType: 'blob'
      });

      const file = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/pdf' 
      });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error('Resume download error:', error);
      toast.error('Failed to load resume');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error">{error}</Typography>
        <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Stack spacing={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Application Details</Typography>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back to Applications
          </Button>
        </Box>

        {/* Applicant Information */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <PersonIcon sx={{ mr: 1 }} /> Applicant Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography>{application?.applicant?.name}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography>{application?.applicant?.email}</Typography>
                  </Box>
                </Stack>
              </Grid>
              <Grid item xs={12} md={6}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Application Date
                    </Typography>
                    <Typography>
                      {format(new Date(application?.appliedDate), 'PPP')}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Status
                    </Typography>
                    <Chip 
                      label={application?.status} 
                      color={
                        application?.status === 'ACCEPTED' ? 'success' :
                        application?.status === 'REJECTED' ? 'error' :
                        'primary'
                      }
                    />
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Cover Letter */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom display="flex" alignItems="center">
              <DescriptionIcon sx={{ mr: 1 }} /> Cover Letter
            </Typography>
            <Typography sx={{ whiteSpace: 'pre-line' }}>
              {application?.coverLetter}
            </Typography>
          </CardContent>
        </Card>

        {/* Resume */}
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" display="flex" alignItems="center">
                <DescriptionIcon sx={{ mr: 1 }} /> Resume
              </Typography>
              <Button
                variant="contained"
                onClick={handleViewResume}
                disabled={!application?.resumeUrl}
              >
                View Resume
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Job Details */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Job Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Position
                </Typography>
                <Typography gutterBottom>{application?.job?.title}</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" color="text.secondary">
                  Company
                </Typography>
                <Typography gutterBottom>{application?.job?.company}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Application Management - Only visible to employers */}
        {isEmployer && (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>Manage Application</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Update Status</InputLabel>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              label="Update Status"
            >
              <MenuItem value="REVIEWING">Under Review</MenuItem>
              <MenuItem value="SHORTLISTED">Shortlisted</MenuItem>
              <MenuItem value="INTERVIEWED">Interviewed</MenuItem>
              <MenuItem value="OFFERED">Offered</MenuItem>
              <MenuItem value="ACCEPTED">Accepted</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" gap={2}>
            {/* Always show Send Acknowledgment button when changing any status */}
            <Button
              variant="outlined"
              startIcon={<SendIcon />}
              onClick={handleSendAcknowledgement}
              disabled={loading}
            >
              Send Acknowledgement
            </Button>
            <Button
              variant="contained"
              disabled={!newStatus || loading}
              onClick={() => handleUpdateStatus()}
            >
              Update Status
            </Button>
          </Box>
        </Grid>
      </Grid>
    </CardContent>
  </Card>
)}
      </Stack>
    </Box>
  );
};

export default ApplicationDetailPage;