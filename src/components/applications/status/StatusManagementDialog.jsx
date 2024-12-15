import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

// Status configuration with transitions and requirements
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    description: 'Application submitted but not yet reviewed',
    allowedTransitions: ['REVIEWING', 'REJECTED'],
    requiresFeedback: false,
    color: 'default'
  },
  REVIEWING: {
    label: 'Under Review',
    description: 'Application is being reviewed by the employer',
    allowedTransitions: ['SHORTLISTED', 'REJECTED'],
    requiresFeedback: true,
    color: 'primary'
  },
  SHORTLISTED: {
    label: 'Shortlisted',
    description: 'Candidate shortlisted for interview',
    allowedTransitions: ['INTERVIEWED', 'REJECTED'],
    requiresFeedback: true,
    color: 'info'
  },
  INTERVIEWED: {
    label: 'Interviewed',
    description: 'Interview completed',
    allowedTransitions: ['OFFERED', 'REJECTED'],
    requiresFeedback: true,
    color: 'secondary'
  },
  OFFERED: {
    label: 'Offer Extended',
    description: 'Job offer has been made',
    allowedTransitions: ['ACCEPTED', 'REJECTED'],
    requiresFeedback: true,
    color: 'warning'
  },
  ACCEPTED: {
    label: 'Accepted',
    description: 'Offer accepted by candidate',
    allowedTransitions: [],
    requiresFeedback: false,
    color: 'success'
  },
  REJECTED: {
    label: 'Rejected',
    description: 'Application rejected',
    allowedTransitions: [],
    requiresFeedback: true,
    color: 'error'
  }
};

const StatusManagementDialog = ({
  open,
  onClose,
  currentStatus,
  onUpdateStatus,
  application
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Get available status transitions based on current status
  const getAvailableTransitions = () => {
    return STATUS_CONFIG[currentStatus]?.allowedTransitions || [];
  };

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      setError('Please select a new status');
      return;
    }

    if (STATUS_CONFIG[newStatus].requiresFeedback && !feedback.trim()) {
      setError('Feedback is required for this status change');
      return;
    }

    try {
      setLoading(true);
      await onUpdateStatus(newStatus, feedback);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  // Reset state when dialog opens
  React.useEffect(() => {
    if (open) {
      setNewStatus('');
      setFeedback('');
      setError(null);
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Update Application Status
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Current Status: {STATUS_CONFIG[currentStatus]?.label}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {STATUS_CONFIG[currentStatus]?.description}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>New Status</InputLabel>
          <Select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            label="New Status"
          >
            {getAvailableTransitions().map((status) => (
              <MenuItem key={status} value={status}>
                {STATUS_CONFIG[status].label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {newStatus && STATUS_CONFIG[newStatus].requiresFeedback && (
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            required
            helperText="Please provide feedback for this status change"
          />
        )}

        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Status Progress
          </Typography>
          <Stepper activeStep={Object.keys(STATUS_CONFIG).indexOf(currentStatus)} alternativeLabel>
            {Object.entries(STATUS_CONFIG).map(([key, value]) => (
              <Step key={key}>
                <StepLabel>{value.label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleStatusUpdate}
          disabled={loading || !newStatus}
        >
          {loading ? <CircularProgress size={24} /> : 'Update Status'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StatusManagementDialog;