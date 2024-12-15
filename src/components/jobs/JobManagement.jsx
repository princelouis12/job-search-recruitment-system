import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Alert,
  Grid,
  Chip,
  IconButton,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';

const JobManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    type: '',
    salary: '',
    requirements: '',
    skills: '',
    deadline: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log('Fetching jobs...');
      const response = await axios.get('/api/jobs/employer');
      console.log('Jobs response:', response.data);
      setJobs(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError(err.response?.data || 'Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (job = null) => {
    if (job) {
      setJobForm({
        ...job,
        requirements: job.requirements.join('\n'),
        skills: job.skills.join(',')
      });
      setSelectedJob(job);
    } else {
      setJobForm({
        title: '',
        description: '',
        company: '',
        location: '',
        type: '',
        salary: '',
        requirements: '',
        skills: '',
        deadline: ''
      });
      setSelectedJob(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setJobForm({});
    setSelectedJob(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        ...jobForm,
        requirements: jobForm.requirements.split('\n').filter(req => req.trim()),
        skills: jobForm.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      };

      if (selectedJob) {
        await axios.put(`/api/jobs/${selectedJob.id}`, formData);
      } else {
        await axios.post('/api/jobs', formData);
      }

      handleCloseDialog();
      fetchJobs();
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to save job');
    }
  };

  const handleDelete = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      try {
        await axios.delete(`/api/jobs/${jobId}`);
        fetchJobs();
        setError(null);
      } catch (err) {
        setError(err.response?.data || 'Failed to delete job');
      }
    }
  };

  if (!user || user.role !== 'employer') {
    return (
      <Box>
        <Alert severity="error">
          You do not have permission to access this page.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Manage Job Postings</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Create Job Posting
        </Button>
      </Box>

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>{job.title}</Typography>
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      {job.company} • {job.location} • {job.type}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Salary: {job.salary}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {job.skills.map((skill, index) => (
                        <Chip
                          key={index}
                          label={skill}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleOpenDialog(job)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(job.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleOpenDialog(job)}>
                  Edit Details
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(job.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedJob ? 'Edit Job Posting' : 'Create Job Posting'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Job Title"
                  name="title"
                  value={jobForm.title || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company"
                  name="company"
                  value={jobForm.company || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={jobForm.location || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Job Type"
                  name="type"
                  value={jobForm.type || ''}
                  onChange={handleInputChange}
                  required
                  select
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="CONTRACT">Contract</option>
                  <option value="INTERNSHIP">Internship</option>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  name="salary"
                  value={jobForm.salary || ''}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={jobForm.description || ''}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requirements (one per line)"
                  name="requirements"
                  value={jobForm.requirements || ''}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={4}
                  helperText="Enter each requirement on a new line"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Skills"
                  name="skills"
                  value={jobForm.skills || ''}
                  onChange={handleInputChange}
                  required
                  helperText="Enter skills separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Application Deadline"
                  name="deadline"
                  type="datetime-local"
                  value={jobForm.deadline || ''}
                  onChange={handleInputChange}
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedJob ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default JobManagement;