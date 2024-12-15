import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../features/auth/authSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
});

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: async (values, { setStatus }) => {
      try {
        await dispatch(forgotPassword(values.email)).unwrap();
        setStatus({ success: 'Password reset email has been sent!' });
      } catch (error) {
        setStatus({ error: error.toString() });
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          {formik.status?.success && (
            <Typography color="success" variant="body2" sx={{ mt: 1 }}>
              {formik.status.success}
            </Typography>
          )}
          {formik.status?.error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {formik.status.error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Send Reset Link'
            )}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink component={Link} to="/login" variant="body2">
              Back to Login
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPassword;