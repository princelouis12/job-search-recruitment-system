// src/components/applications/ApplicationList.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Paper,
  Button,
  Chip
} from '@mui/material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import ApplicationDetails from './ApplicationDetails';

const getStatusColor = (status) => {
  switch (status) {
    case 'PENDING': return 'default';
    case 'REVIEWING': return 'primary';
    case 'SHORTLISTED': return 'info';
    case 'INTERVIEWED': return 'warning';
    case 'ACCEPTED': return 'success';
    case 'REJECTED': return 'error';
    default: return 'default';
  }
};

const ApplicationList = ({ applications, onUpdateStatus }) => {
  const navigate = useNavigate();
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Move handleViewDetails inside the component
  const handleViewDetails = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  return (
    <>
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
                    onClick={() => setSelectedApplication(application)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {selectedApplication && (
        <ApplicationDetails
          application={selectedApplication}
          open={!!selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onUpdateStatus={onUpdateStatus}
          onError={(msg) => toast.error(msg)}
        />
      )}
    </>
  );
};

export default ApplicationList;