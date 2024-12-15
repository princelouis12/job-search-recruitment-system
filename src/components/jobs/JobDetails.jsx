// src/components/jobs/JobDetails.jsx
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Business as BusinessIcon,
  Work as WorkIcon,
  AttachMoney as SalaryIcon,
  Schedule as ScheduleIcon,
  Description as DescriptionIcon,
  Assignment as RequirementsIcon,
  Code as SkillsIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

const JobDetails = ({ job, onApply, isEmployer = false }) => {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [application, setApplication] = useState({
    coverLetter: '',
    resume: null,
  });
  const { user } = useSelector((state) => state.auth);

  const handleApplySubmit = (e) => {
    e.preventDefault();
    onApply({ ...application, jobId: job.id });
    setApplyDialogOpen(false);
  };

  const handleFileChange = (e) => {
    setApplication({
      ...application,
      resume: e.target.files[0],
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            {job.title}
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <BusinessIcon sx={{ mr: 1 }} />
              <Typography variant="body1">{job.company}</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <LocationIcon sx={{ mr: 1 }} />
              <Typography variant="body1">{job.location}</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <WorkIcon sx={{ mr: 1 }} />
              <Typography variant="body1">{job.type}</Typography>
            </Grid>
            <Grid item sx={{ display: 'flex', alignItems: 'center' }}>
              <SalaryIcon sx={{ mr: 1 }} />
              <Typography variant="body1">{job.salary}</Typography>
            </Grid>
          </Grid>
          {!isEmployer && user?.role === 'jobseeker' && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => setApplyDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Apply Now
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Description Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <DescriptionIcon sx={{ mr: 1 }} />
            Job Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {job.description}
          </Typography>
        </Box>

        {/* Requirements Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <RequirementsIcon sx={{ mr: 1 }} />
            Requirements
          </Typography>
          <List>
            {job.requirements.map((requirement, index) => (
              <ListItem key={index}>
                <ListItemIcon>•</ListItemIcon>
                <ListItemText primary={requirement} />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Skills Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <SkillsIcon sx={{ mr: 1 }} />
            Required Skills
          </Typography>
          <Box sx={{ mt: 2 }}>
            {job.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                sx={{ mr: 1, mb: 1 }}
              />
            ))}
          </Box>
        </Box>

        {/* Additional Information */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1 }} />
            Additional Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Posted Date: {format(new Date(job.postedDate), 'MMMM dd, yyyy')}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                Application Deadline: {format(new Date(job.deadline), 'MMMM dd, yyyy')}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialogOpen}
        onClose={() => setApplyDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Apply for {job.title}</DialogTitle>
        <form onSubmit={handleApplySubmit}>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Position: {job.title}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Company: {job.company}
              </Typography>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={6}
              label="Cover Letter"
              value={application.coverLetter}
              onChange={(e) => setApplication({ ...application, coverLetter: e.target.value })}
              required
              sx={{ mb: 3 }}
            />

            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Resume/CV
              </Typography>
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-file"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="resume-file">
                <Button variant="outlined" component="span">
                  Upload Resume
                </Button>
              </label>
              {application.resume && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {application.resume.name}
                </Typography>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={!application.coverLetter || !application.resume}
            >
              Submit Application
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default JobDetails;