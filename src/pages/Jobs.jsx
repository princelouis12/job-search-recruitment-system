import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Stack,
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

const EmployerJobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationsDialogOpen, setApplicationsDialogOpen] = useState(false);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/jobs/employer');
      setJobs(response.data);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch jobs');
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
      setError(err.response?.data || 'Failed to fetch applications');
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
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {job.company}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {job.location}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 0.5 }} fontSize="small" />
                        {job.type}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Salary: {job.salary}
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Posted: {format(new Date(job.postedDate), 'PPP')}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Required Skills:
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {job.skills.map((skill) => (
                          <Chip key={skill} label={skill} size="small" />
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button 
                  startIcon={<PersonIcon />}
                  onClick={() => handleViewApplications(job)}
                >
                  View Applications ({job.totalApplications || 0})
                </Button>
              </CardActions>
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
          {applications.map((application) => (
            <Card key={application.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1">
                  {application.applicant.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Status: {application.status}
                </Typography>
                <Typography variant="body2">
                  Applied: {format(new Date(application.appliedDate), 'PPP')}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => window.open(application.resumeUrl)}>
                  View Resume
                </Button>
                <Button size="small" onClick={() => navigate(`/applications/${application.id}`)}>
                  View Details
                </Button>
              </CardActions>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApplicationsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployerJobs;