import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Chat as ChatIcon,
  Schedule as ScheduleIcon,
  Work as WorkIcon,
} from '@mui/icons-material';

const statusSteps = [
  { label: 'Pending', description: 'Application submitted and awaiting review' },
  { label: 'Under Review', description: 'Application is being evaluated' },
  { label: 'Interview', description: 'Selected for interview process' },
  { label: 'Hired', description: 'Job offer extended and accepted' }
];

// Mapping status to step index
const getStatusIndex = (status) => {
  const statusMap = {
    'PENDING': 0,
    'UNDER_REVIEW': 1,
    'INTERVIEW': 2,
    'HIRED': 3,
    'REJECTED': -1
  };
  return statusMap[status] || 0;
};

// Status chip colors
const getStatusColor = (status) => {
  const colorMap = {
    'PENDING': 'default',
    'UNDER_REVIEW': 'primary',
    'INTERVIEW': 'warning',
    'HIRED': 'success',
    'REJECTED': 'error'
  };
  return colorMap[status] || 'default';
};

const ApplicationStatusManagement = ({ 
  application, 
  onUpdateStatus, 
  onAddFeedback 
}) => {
  const { user } = useSelector(state => state.auth);
  const [feedbackDialog, setFeedbackDialog] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const isEmployer = user?.role === 'EMPLOYER';

  const handleStatusUpdate = async (newStatus) => {
    try {
      setLoading(true);
      await onUpdateStatus(application.id, newStatus);
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true);
      await onAddFeedback(application.id, feedback);
      setFeedbackDialog(false);
      setFeedback('');
    } catch (error) {
      console.error('Failed to add feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const JobSeekerView = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Application Status
        </Typography>
        
        <Stepper activeStep={getStatusIndex(application.status)} alternativeLabel>
          {statusSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Current Status
              </Typography>
              <Chip
                label={application.status.replace('_', ' ')}
                color={getStatusColor(application.status)}
                sx={{ mt: 1 }}
              />
            </Box>

            {application.feedback && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Employer Feedback
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {application.feedback}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  const EmployerView = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Manage Application Status
        </Typography>

        <Stepper activeStep={getStatusIndex(application.status)} alternativeLabel>
          {statusSteps.map((step, index) => (
            <Step key={index}>
              <StepLabel>{step.label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 3 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Current Status
              </Typography>
              <Chip
                label={application.status.replace('_', ' ')}
                color={getStatusColor(application.status)}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              {application.status === 'PENDING' && (
                <Button
                  variant="contained"
                  onClick={() => handleStatusUpdate('UNDER_REVIEW')}
                  startIcon={<CheckIcon />}
                  disabled={loading}
                >
                  Start Review
                </Button>
              )}

              {application.status === 'UNDER_REVIEW' && (
                <>
                  <Button
                    variant="contained"
                    onClick={() => handleStatusUpdate('INTERVIEW')}
                    startIcon={<ScheduleIcon />}
                    disabled={loading}
                  >
                    Schedule Interview
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusUpdate('REJECTED')}
                    startIcon={<CloseIcon />}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </>
              )}

              {application.status === 'INTERVIEW' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusUpdate('HIRED')}
                    startIcon={<WorkIcon />}
                    disabled={loading}
                  >
                    Hire Candidate
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => handleStatusUpdate('REJECTED')}
                    startIcon={<CloseIcon />}
                    disabled={loading}
                  >
                    Reject
                  </Button>
                </>
              )}

              <Button
                variant="outlined"
                onClick={() => setFeedbackDialog(true)}
                startIcon={<ChatIcon />}
                disabled={loading}
              >
                Add Feedback
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialog} onClose={() => setFeedbackDialog(false)}>
        <DialogTitle>Add Feedback</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            label="Feedback for candidate"
            placeholder="Enter your feedback here..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFeedbackDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleFeedbackSubmit} 
            variant="contained"
            disabled={!feedback.trim() || loading}
          >
            Submit Feedback
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );

  return (
    <Box>
      {isEmployer ? <EmployerView /> : <JobSeekerView />}
    </Box>
  );
};

export default ApplicationStatusManagement;