// src/components/jobs/JobList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as SalaryIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';

const JobList = ({
  jobs,
  onDelete,
  isEmployer = false,
  onSearch,
  onFilter,
  isLoading,
}) => {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    type: 'all',
  });

  const handleSearchChange = (event) => {
    const newFilters = {
      ...filters,
      search: event.target.value,
    };
    setFilters(newFilters);
    onSearch?.(newFilters);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    const newFilters = {
      ...filters,
      [name]: value,
    };
    setFilters(newFilters);
    onFilter?.(newFilters);
  };

  const handleDeleteClick = (job) => {
    setJobToDelete(job);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (jobToDelete) {
      onDelete(jobToDelete.id);
      setDeleteDialogOpen(false);
      setJobToDelete(null);
    }
  };

  const handleViewDetails = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/jobs/edit/${jobId}`);
  };

  return (
    <Box>
      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Jobs"
            name="search"
            value={filters.search}
            onChange={handleSearchChange}
            placeholder="Search by title or company"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Location"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Filter by location"
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            select
            label="Job Type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="FULL_TIME">Full Time</MenuItem>
            <MenuItem value="PART_TIME">Part Time</MenuItem>
            <MenuItem value="CONTRACT">Contract</MenuItem>
            <MenuItem value="INTERNSHIP">Internship</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Job Listings */}
      <Grid container spacing={2}>
        {jobs.map((job) => (
          <Grid item xs={12} key={job.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      {job.title}
                    </Typography>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <BusinessIcon sx={{ mr: 1 }} fontSize="small" />
                        <Typography variant="body2">{job.company}</Typography>
                      </Grid>
                      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationIcon sx={{ mr: 1 }} fontSize="small" />
                        <Typography variant="body2">{job.location}</Typography>
                      </Grid>
                      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <WorkIcon sx={{ mr: 1 }} fontSize="small" />
                        <Typography variant="body2">{job.type}</Typography>
                      </Grid>
                      <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
                        <SalaryIcon sx={{ mr: 1 }} fontSize="small" />
                        <Typography variant="body2">{job.salary}</Typography>
                      </Grid>
                    </Grid>
                    <Box sx={{ mb: 2 }}>
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
                  {isEmployer && (
                    <Box>
                      <IconButton onClick={() => handleEditJob(job.id)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteClick(job)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Posted {formatDistanceToNow(new Date(job.postedDate))} ago
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleViewDetails(job.id)}>
                  View Details
                </Button>
                {!isEmployer && (
                  <Button size="small" variant="contained" color="primary">
                    Apply Now
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Job Posting</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{jobToDelete?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobList;