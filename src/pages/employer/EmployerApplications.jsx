// src/components/employer/EmployerApplications.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button
} from '@mui/material';
import { format } from 'date-fns';

const EmployerApplications = ({ jobId }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get('/api/applications/employer', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewApplication = (application) => {
    // Add view application logic here
    console.log('View application:', application);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Job Applications
      </Typography>
      
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Applicant Name</TableCell>
              <TableCell>Position</TableCell>
              <TableCell>Applied Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell>{application.applicant.name}</TableCell>
                <TableCell>{application.job.title}</TableCell>
                <TableCell>
                  {format(new Date(application.appliedDate), 'MMM dd, yyyy')}
                </TableCell>
                <TableCell>
                  <Chip
                    label={application.status}
                    color={getStatusColor(application.status)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleViewApplication(application)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING':
      return 'default';
    case 'REVIEWING':
      return 'primary';
    case 'SHORTLISTED':
      return 'info';
    case 'ACCEPTED':
      return 'success';
    case 'REJECTED':
      return 'error';
    default:
      return 'default';
  }
};

export default EmployerApplications;