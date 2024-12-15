import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { resetPassword } from '../features/auth/authSlice';

const validationSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { isLoading } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setStatus }) => {
      if (!token) {
        setStatus({ error: 'Reset token is missing' });
        return;
      }

      try {
        await dispatch(resetPassword({ token, newPassword: values.password })).unwrap();
        setStatus({ success: 'Password has been reset successfully!' });
        setTimeout(() => navigate('/login'), 2000);
      } catch (error) {
        setStatus({ error: error.toString() });
      }
    },
  });

  if (!token) {
    return (
      <Container component="main" maxWidth="xs">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography color="error">
            Invalid password reset link. Please request a new one.
          </Typography>
        </Box>
      </Container>
    );
  }

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
          Reset Password
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm New Password"
            type="password"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
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
              'Reset Password'
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ResetPassword;