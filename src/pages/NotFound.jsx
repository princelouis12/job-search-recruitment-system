import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Typography, Container } from '@mui/material';

const NotFound = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Page not found
        </Typography>
        <Typography color="text.secondary" paragraph>
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button component={Link} to="/" variant="contained">
          Go to Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;