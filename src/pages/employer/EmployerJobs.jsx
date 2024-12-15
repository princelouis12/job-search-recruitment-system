import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import ApplicationDetailsModal from './ApplicationDetailsModal';

const EmployerJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [applicationDetailsOpen, setApplicationDetailsOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobs/employer');
      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplications = async (job) => {
    try {
      const response = await axios.get(`/api/applications/job/${job.id}`);
      setApplications(response.data);
      setSelectedJob(job);
      setApplicationsDialogOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    }
  };

  const handleViewApplicationDetails = async (application) => {
    try {
      const response = await axios.get(`/api/applications/${application.id}`);
      setSelectedApplication(response.data);
      setApplicationDetailsOpen(true);
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError(err.response?.data?.message || 'Failed to fetch application details');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        My Job Listings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {job.company}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {job.location}
                      </Typography>
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {job.type}
                      </Typography>
                    </Stack>
                    <Box sx={{ mb: 2 }}>
                      {job.skills?.map((skill) => (
                        <Chip
                          key={skill}
                          label={skill}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <Button
                      startIcon={<PersonIcon />}
                      onClick={() => handleViewApplications(job)}
                    >
                      View Applications ({job.totalApplications || 0})
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Applications Dialog */}
      <Dialog
        open={applicationsDialogOpen}
        onClose={() => setApplicationsDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Applications for {selectedJob?.title}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            {applications.map((application) => (
              <Card key={application.id} sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1">
                    {application.applicant?.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Status: {application.status}
                  </Typography>
                  <Typography variant="body2">
                    Applied: {format(new Date(application.appliedDate), 'PPP')}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleViewApplicationDetails(application)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          open={applicationDetailsOpen}
          applicationId={selectedApplication.id}
          onClose={() => {
            setApplicationDetailsOpen(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </Box>
  );
};

export default EmployerJobs;