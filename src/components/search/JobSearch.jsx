import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Container,
  Fade,
  useTheme,
  alpha,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as SalaryIcon,
  FiberManualRecord as BulletIcon,
  Description as DescriptionIcon,
  Assignment as RequirementsIcon,
  Code as SkillsIcon,
  FileUpload as UploadIcon,
  AccessTime as TimeIcon,
  Close as CloseIcon,
  BookmarkBorder as BookmarkIcon,
  Bookmark as BookmarkFilledIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { usePagination } from '../../hooks/usePagination';
import Pagination from '../../components/common/Pagination';

const JobSearch = () => {
  const theme = useTheme();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'all',
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
  });
  const [applicationError, setApplicationError] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [savedJobs, setSavedJobs] = useState({});

  const { user } = useSelector((state) => state.auth);
  const isJobSeeker = user?.role === 'jobseeker';

  // Pagination configuration
  const ITEMS_PER_PAGE = 5;
  const {
    currentPage,
    paginatedItems: paginatedJobs,
    handlePageChange,
    totalItems
  } = usePagination(jobs, ITEMS_PER_PAGE);

  const applicationSteps = ['Job Details', 'Cover Letter', 'Resume Upload', 'Review'];

  useEffect(() => {
    const loadSavedJobs = () => {
      const saved = localStorage.getItem('savedJobs');
      if (saved) {
        setSavedJobs(JSON.parse(saved));
      }
    };
    loadSavedJobs();
  }, []);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/jobs', {
        params: {
          search: filters.search || undefined,
          location: filters.location || undefined,
          type: filters.type === 'all' ? undefined : filters.type,
        },
      });
      setJobs(response.data);
    } catch (err) {
      setError('Failed to fetch jobs. Please try again later.');
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [filters.search, filters.location, filters.type]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    fetchJobs();
  };

  const handleSaveJob = async (job) => {
    if (!user) {
      toast.warning('Please login to save jobs');
      return;
    }

    try {
      const savedJobsData = JSON.parse(localStorage.getItem('savedJobs') || '{}');
      const isJobSaved = savedJobsData[job.id];
      
      if (isJobSaved) {
        delete savedJobsData[job.id];
        try {
          await axios.delete(`/api/saved-jobs/${job.id}`);
        } catch (apiError) {
          console.error('API Error:', apiError);
        }
        toast.success('Job removed from saved jobs');
      } else {
        savedJobsData[job.id] = {
          ...job,
          savedAt: new Date().toISOString(),
        };
        try {
          await axios.post('/api/saved-jobs', { 
            jobId: job.id,
            jobData: job
          });
        } catch (apiError) {
          console.error('API Error:', apiError);
        }
        toast.success('Job saved successfully');
      }

      setSavedJobs(savedJobsData);
      localStorage.setItem('savedJobs', JSON.stringify(savedJobsData));
    } catch (err) {
      console.error('Save job error:', err);
      toast.error('Failed to save job. Please try again.');
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const handleEasyApply = (job) => {
    if (!user) {
      toast.warning('Please login to apply for jobs');
      return;
    }
    if (!isJobSeeker) {
      toast.warning('Only job seekers can apply for jobs');
      return;
    }
    setSelectedJob(job);
    setApplicationOpen(true);
    setActiveStep(0);
    setApplicationData({
      coverLetter: '',
      resume: null,
    });
    setApplicationError(null);
    setApplicationSuccess(false);
  };

  const handleNext = () => {
    if (activeStep === 1 && !applicationData.coverLetter) {
      setApplicationError('Please provide a cover letter');
      return;
    }
    if (activeStep === 2 && !applicationData.resume) {
      setApplicationError('Please upload your resume');
      return;
    }
    setApplicationError(null);
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setApplicationError(null);
  };

  const handleApplicationSubmit = async () => {
    try {
      setApplying(true);
      setApplicationError(null);

      const formData = new FormData();
      formData.append('jobId', selectedJob.id);
      formData.append('coverLetter', applicationData.coverLetter);
      formData.append('resume', applicationData.resume);

      await axios.post('/api/applications', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setApplicationSuccess(true);
      toast.success('Application submitted successfully!');
      setTimeout(() => {
        setApplicationOpen(false);
        setSelectedJob(null);
        setActiveStep(0);
      }, 2000);
    } catch (err) {
      const errorMessage = err.response?.data || 'Failed to submit application';
      setApplicationError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setApplying(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setApplicationError('File size should not exceed 5MB');
        return;
      }
      setApplicationData(prev => ({
        ...prev,
        resume: file
      }));
      setApplicationError(null);
    }
  };

  const renderApplicationStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Job Details Confirmation
            </Typography>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
                    Position: {selectedJob?.title}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {selectedJob?.company}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {selectedJob?.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    {selectedJob?.type}
                  </Typography>
                </Grid>
                {selectedJob?.salary && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                      <SalaryIcon sx={{ mr: 1, color: 'success.main' }} />
                      {selectedJob.salary}
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Paper>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Cover Letter
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Write your cover letter"
              value={applicationData.coverLetter}
              onChange={(e) => setApplicationData(prev => ({
                ...prev,
                coverLetter: e.target.value
              }))}
              placeholder="Explain why you're a great fit for this role..."
              required
              error={applicationError && !applicationData.coverLetter}
              helperText={applicationError && !applicationData.coverLetter ? 'Cover letter is required' : ''}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600, mb: 3 }}>
              Resume Upload
            </Typography>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2,
                borderStyle: 'dashed',
                bgcolor: alpha(theme.palette.primary.main, 0.02),
              }}
            >
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-file">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<UploadIcon />}
                  sx={{
                    borderRadius: 2,
                    px: 4,
                    py: 1.5,
                  }}
                >
                  Upload Resume
                </Button>
              </label>
              {applicationData.resume && (
                <Box sx={{ mt: 2 }}>
                  <Chip
                    label={applicationData.resume.name}
                    onDelete={() => setApplicationData(prev => ({ ...prev, resume: null }))}
                    color="primary"
                    variant="outlined"
                  />
                </Box>
              )}
              {applicationError && !applicationData.resume && (
                <Typography color="error" variant="body2" sx={{ mt: 2 }}>
                  Please upload your resume
                </Typography>
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Supported formats: PDF, DOC, DOCX (Max size: 5MB)
              </Typography>
            </Paper>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom color="primary" sx={{ fontWeight: 600 }}>
              Application Review
            </Typography>
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'primary.main' }}>
                Job Details
              </Typography>
              <Typography variant="body1" paragraph>
                {selectedJob?.title} at {selectedJob?.company}
              </Typography>
              <Typography variant="body1" paragraph>
                Location: {selectedJob?.location}
              </Typography>
            </Paper>
            
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'primary.main' }}>
                Cover Letter
              </Typography>
              <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                {applicationData.coverLetter}
              </Typography>
            </Paper>
            
            <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, color: 'primary.main' }}>
                Resume
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                <DescriptionIcon sx={{ mr: 1 }} />
                {applicationData.resume?.name}
              </Typography>
            </Paper>
          </Box>
        );
      default:
        return null;
    }
  };

  const JobListingCard = ({ job }) => (
    <Fade in timeout={500}>
      <Card 
        sx={{
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: theme.shadows[8],
          },
          position: 'relative',
          overflow: 'visible',
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  {job.title}
                </Typography>
                <Tooltip title={savedJobs[job.id] ? "Remove from saved jobs" : "Save for later"}>
                  <IconButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSaveJob(job);
                    }}
                    sx={{
                      color: savedJobs[job.id] ? 'primary.main' : 'action.disabled',
                      '&:hover': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    {savedJobs[job.id] ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                  </IconButton>
                </Tooltip>
              </Box>
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 2 }}
              >
                <Typography 
                  variant="body1" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <BusinessIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  {job.company}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: theme.palette.text.secondary,
                  }}
                >
                  <LocationIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  {job.location}
                </Typography>
                <Chip
                  icon={<WorkIcon />}
                  label={job.type}
                  size="small"
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                  }}
                />
                {job.salary && (
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: theme.palette.success.main,
                      fontWeight: 500,
                    }}
                  >
                    <SalaryIcon sx={{ mr: 1 }} />
                    {job.salary}
                  </Typography>
                )}
              </Stack>
              <Box sx={{ mb: 2 }}>
                {job.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{
                      mr: 1,
                      mb: 1,
                      bgcolor: alpha(theme.palette.secondary.main, 0.1),
                      color: theme.palette.secondary.main,
                      '&:hover': {
                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
                      },
                    }}
                  />
                ))}
              </Box>
            </Grid>
            <Grid 
              item 
              xs={12} 
              md={4} 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'row', md: 'column' },
                justifyContent: 'flex-end', 
                alignItems: { xs: 'center', md: 'flex-end' }, 
                gap: 2 
              }}
            >
              <Button
                variant="outlined"
                onClick={() => handleViewDetails(job)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
                startIcon={<DescriptionIcon />}
              >
                View Details
              </Button>
              <Button
                variant="contained"
                onClick={() => handleEasyApply(job)}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  bgcolor: isJobSeeker ? 'primary.main' : 'grey.400',
                  '&:hover': {
                    bgcolor: isJobSeeker ? 'primary.dark' : 'grey.500',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'transform 0.2s',
                }}
                startIcon={<WorkIcon />}
              >
                Easy Apply
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Fade>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 4 }}>
        {/* Search Filters */}
        <Paper 
          elevation={4} 
          sx={{ 
            mb: 4, 
            p: 3,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              mb: 3,
              fontWeight: 600,
              color: theme.palette.primary.main,
            }}
          >
            Find Your Dream Job
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                name="search"
                label="Search Jobs"
                value={filters.search}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                name="location"
                label="Location"
                value={filters.location}
                onChange={handleFilterChange}
                InputProps={{
                  startAdornment: <LocationIcon sx={{ mr: 1, color: theme.palette.primary.main }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                name="type"
                label="Job Type"
                value={filters.type}
                onChange={handleFilterChange}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              >
                <MenuItem value="all">All Types</MenuItem>
                <MenuItem value="FULL_TIME">Full Time</MenuItem>
                <MenuItem value="PART_TIME">Part Time</MenuItem>
                <MenuItem value="CONTRACT">Contract</MenuItem>
                <MenuItem value="INTERNSHIP">Internship</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={handleSearch}
                sx={{
                  height: '56px',
                  borderRadius: 2,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'transform 0.2s',
                }}
                startIcon={<SearchIcon />}
              >
                Search Jobs
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress size={40} />
          </Box>
        ) : (
          <Stack spacing={3}>
            {paginatedJobs.map((job) => (
              <JobListingCard key={job.id} job={job} />
            ))}

            {/* Pagination */}
            {jobs.length > 0 && (
              <Pagination
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                currentPage={currentPage}
                onPageChange={handlePageChange}
              />
            )}

            {jobs.length === 0 && !loading && (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.primary.main, 0.02),
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No jobs found matching your criteria
                </Typography>
              </Paper>
            )}
          </Stack>
        )}

        {/* Job Details Dialog */}
        <Dialog
          open={jobDetailsOpen}
          onClose={() => setJobDetailsOpen(false)}
          maxWidth="md"
          fullWidth
          scroll="paper"
          PaperProps={{ sx: { borderRadius: 2 } }}
        >
          {selectedJob && (
            <>
              <DialogTitle 
                sx={{ 
                  pb: 1,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h5" component="div" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    {selectedJob.title}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary">
                    {selectedJob.company}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title={savedJobs[selectedJob.id] ? "Remove from saved jobs" : "Save for later"}>
                    <IconButton
                      onClick={() => handleSaveJob(selectedJob)}
                      sx={{
                        color: savedJobs[selectedJob.id] ? 'primary.main' : 'action.disabled',
                        '&:hover': {
                          color: 'primary.main',
                          bgcolor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      {savedJobs[selectedJob.id] ? <BookmarkFilledIcon /> : <BookmarkIcon />}
                    </IconButton>
                  </Tooltip>
                  <IconButton 
                    onClick={() => setJobDetailsOpen(false)}
                    sx={{ 
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Box>
              </DialogTitle>
              <DialogContent dividers sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack 
                      direction={{ xs: 'column', sm: 'row' }} 
                      spacing={3} 
                      sx={{ mb: 2 }}
                    >
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {selectedJob.location}
                      </Typography>
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                        {selectedJob.type}
                      </Typography>
                      {selectedJob.salary && (
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                          <SalaryIcon sx={{ mr: 1 }} />
                          {selectedJob.salary}
                        </Typography>
                      )}
                      <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Posted {format(new Date(selectedJob.postedDate), 'MMM dd, yyyy')}
                      </Typography>
                    </Stack>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <DescriptionIcon sx={{ mr: 1 }} />
                        Job Description
                      </Typography>
                      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                        {selectedJob.description}
                      </Typography>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <RequirementsIcon sx={{ mr: 1 }} />
                        Requirements
                      </Typography>
                      <List sx={{ pl: 2 }}>
                        {selectedJob.requirements.map((requirement, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 28 }}>
                              <BulletIcon sx={{ fontSize: 8, color: 'primary.main' }} />
                            </ListItemIcon>
                            <ListItemText primary={requirement} />
                          </ListItem>
                        ))}
                      </List>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                        <SkillsIcon sx={{ mr: 1 }} />
                        Required Skills
                      </Typography>
                      <Box>
                        {selectedJob.skills.map((skill) => (
                          <Chip
                            key={skill}
                            label={skill}
                            sx={{
                              mr: 1,
                              mb: 1,
                              bgcolor: alpha(theme.palette.secondary.main, 0.1),
                              color: theme.palette.secondary.main,
                            }}
                          />
                        ))}
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          justifyContent: 'flex-end'
                        }}
                      >
                        <TimeIcon sx={{ mr: 1, fontSize: 18 }} />
                        Application Deadline: {format(new Date(selectedJob.deadline), 'MMMM dd, yyyy')}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 2.5 }}>
                <Button 
                  onClick={() => setJobDetailsOpen(false)}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                  }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={() => {
                    setJobDetailsOpen(false);
                    handleEasyApply(selectedJob);
                  }}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    bgcolor: isJobSeeker ? 'primary.main' : 'grey.400',
                    '&:hover': {
                      bgcolor: isJobSeeker ? 'primary.dark' : 'grey.500',
                    },
                  }}
                  startIcon={<WorkIcon />}
                >
                  Easy Apply
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Application Dialog */}
        <Dialog
          open={applicationOpen}
          onClose={() => !applying && setApplicationOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle 
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Apply for {selectedJob?.title}
            </Typography>
            {!applying && (
              <IconButton 
                onClick={() => setApplicationOpen(false)}
                sx={{ 
                  mt: -1, 
                  mr: -1,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              <Stepper 
                activeStep={activeStep} 
                sx={{ 
                  mb: 4,
                  '& .MuiStepLabel-root .Mui-completed': {
                    color: 'primary.main',
                  },
                  '& .MuiStepLabel-root .Mui-active': {
                    color: 'primary.main',
                  },
                }}
              >
                {applicationSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {applicationSuccess ? (
                <Alert 
                  severity="success"
                  sx={{ 
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    py: 3,
                  }}
                >
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" sx={{ color: 'success.main', mb: 1 }}>
                      Application submitted successfully!
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      You will receive a confirmation email shortly.
                    </Typography>
                  </Box>
                </Alert>
              ) : (
                <>
                  {applicationError && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 2,
                        borderRadius: 2,
                      }}
                    >
                      {applicationError}
                    </Alert>
                  )}
                  {renderApplicationStep()}
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, gap: 1 }}>
            <Button
              onClick={() => setApplicationOpen(false)}
              disabled={applying}
              sx={{ 
                borderRadius: 2,
                px: 3,
              }}
            >
              Cancel
            </Button>
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                disabled={applying}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                }}
              >
                Back
              </Button>
            )}
            {activeStep === applicationSteps.length - 1 ? (
              <Button
              variant="contained"
              onClick={handleApplicationSubmit}
              disabled={applying || !applicationData.coverLetter || !applicationData.resume}
              sx={{
                borderRadius: 2,
                px: 4,
                position: 'relative',
              }}
            >
              {applying ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    marginTop: '-12px',
                    marginLeft: '-12px',
                  }}
                />
              ) : (
                'Submit Application'
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={applying}
              sx={{
                borderRadius: 2,
                px: 4,
              }}
            >
              Next
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  </Container>
);
};

export default JobSearch;