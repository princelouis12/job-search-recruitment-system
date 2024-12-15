import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Container,
  IconButton,
  alpha,
  useTheme,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as SalaryIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';

const SavedJobs = () => {
  const theme = useTheme();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  // Pagination configuration
  const ITEMS_PER_PAGE = 5;
  const {
    currentPage,
    paginatedItems: paginatedJobs,
    handlePageChange,
    totalItems
  } = usePagination(savedJobs, ITEMS_PER_PAGE);

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get saved jobs from localStorage
      const savedJobsData = JSON.parse(localStorage.getItem('savedJobs') || '{}');
      
      // If no saved jobs, set empty array and return
      if (Object.keys(savedJobsData).length === 0) {
        setSavedJobs([]);
        setLoading(false);
        return;
      }

      try {
        // Get all jobs from API
        const response = await axios.get('/api/jobs');
        
        // Filter only the jobs that were actually saved
        const savedJobIds = Object.keys(savedJobsData);
        const filteredJobs = response.data.filter(job => savedJobIds.includes(job.id.toString()));
        
        // Add savedAt date to each job
        const jobsWithSavedDate = filteredJobs.map(job => ({
          ...job,
          savedAt: savedJobsData[job.id]?.savedAt
        }));

        // Sort by saved date, most recent first
        jobsWithSavedDate.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        
        setSavedJobs(jobsWithSavedDate);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // If API fails, use data from localStorage
        const jobsArray = Object.values(savedJobsData);
        setSavedJobs(jobsArray);
      }
    } catch (err) {
      console.error('Error fetching saved jobs:', err);
      setError('Failed to fetch saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveJob = async (jobId) => {
    try {
      // Get current saved jobs from localStorage
      const savedJobsData = JSON.parse(localStorage.getItem('savedJobs') || '{}');
      
      // Remove the job
      delete savedJobsData[jobId];
      
      // Update localStorage
      localStorage.setItem('savedJobs', JSON.stringify(savedJobsData));
      
      // Update state
      setSavedJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));

      // Try to update backend, but don't block on it
      try {
        await axios.delete(`/api/saved-jobs/${jobId}`);
      } catch (apiError) {
        console.error('API Error:', apiError);
        // Continue even if API call fails
      }
      
      toast.success('Job removed successfully');
    } catch (err) {
      console.error('Error removing job:', err);
      toast.error('Failed to remove job');
    }
  };

  const handleApply = (jobId) => {
    window.location.href = `/jobs/${jobId}/apply`;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  const JobCard = ({ job }) => (
    <Card
      sx={{
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
      }}
    >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
                {job.title}
              </Typography>
              <IconButton 
                onClick={() => handleRemoveJob(job.id)}
                sx={{
                  '&:hover': {
                    color: 'error.main',
                  },
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                {job.company}
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                {job.location}
              </Typography>
              <Chip
                icon={<WorkIcon />}
                label={job.type}
                size="small"
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: 'primary.main',
                }}
              />
              {job.salary && (
                <Typography sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                  <SalaryIcon sx={{ mr: 1 }} />
                  {job.salary}
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ mt: 1 }}>
              {job.skills.map((skill) => (
                <Chip
                  key={skill}
                  label={skill}
                  size="small"
                  sx={{
                    mr: 1,
                    mb: 1,
                    bgcolor: alpha(theme.palette.secondary.main, 0.1),
                    color: 'secondary.main',
                  }}
                />
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              href={`/jobs/${job.id}`}
            >
              View Details
            </Button>
            <Button
              variant="contained"
              onClick={() => handleApply(job.id)}
            >
              Apply Now
            </Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Saved Jobs
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {savedJobs.length === 0 ? (
          <Alert severity="info">
            You haven't saved any jobs yet. Browse jobs to save them for later.
          </Alert>
        ) : (
          <Stack spacing={2}>
            {/* Render paginated jobs instead of all saved jobs */}
            {paginatedJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* Pagination component */}
            {savedJobs.length > ITEMS_PER_PAGE && (
              <Pagination
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default SavedJobs;