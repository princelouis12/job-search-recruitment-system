import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import { login, reset } from '../features/auth/authSlice';
import GoogleIcon from '@mui/icons-material/Google';
import AppleIcon from '@mui/icons-material/Apple';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard');
    }

    return () => {
      dispatch(reset());
    };
  }, [isAuthenticated, user, navigate, dispatch]);

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 4, mb: 6, ml: -35 }}>
        <Box sx={{ mr: 2 }}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="34" height="34" rx="8" fill="#0A66C2"/>
            <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="24" fontWeight="bold">
              J
            </text>
          </svg>
        </Box>
        <Typography variant="h6" fontWeight="bold" color="primary">
          JobConnect
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 3,
        }}
      >

        <Paper
          elevation={2}
          sx={{
            padding: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          
          <Box component="form" onSubmit={formik.handleSubmit}>
            <Typography
              component="h1"
              variant="h4"
              sx={{
                fontWeight: 600,
                color: '#000000',
                marginBottom: 3,
              }}
            >
              Sign in
            </Typography>
            <Typography
            variant="subtitle1"
            sx={{
              marginBottom: 3,
              color: '#666666',
            }}
          >
            Stay updated on your professional world
          </Typography>
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: '#ffffff',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 1,
                  backgroundColor: '#ffffff',
                },
              }}
            />
            <MuiLink
              component={Link}
              to="/forgot-password"
              variant="body2"
              sx={{
                color: '#0a66c2',
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              Forgot password?
            </MuiLink>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                backgroundColor: '#0a66c2',
                borderRadius: 6,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: '#004182',
                },
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Sign in'
              )}
            </Button>

            <Divider sx={{ my: 3 }}>or</Divider>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon />}
              sx={{
                mb: 2,
                py: 1.5,
                color: 'rgba(0, 0, 0, 0.87)',
                borderColor: 'rgba(0, 0, 0, 0.87)',
                textTransform: 'none',
                borderRadius: 6,
                fontSize: '1rem',
              }}
            >
              Sign in with Google
            </Button>

            <Button
              fullWidth
              variant="outlined"
              startIcon={<AppleIcon />}
              sx={{
                py: 1.5,
                color: 'rgba(0, 0, 0, 0.87)',
                borderColor: 'rgba(0, 0, 0, 0.87)',
                textTransform: 'none',
                borderRadius: 6,
                fontSize: '1rem',
              }}
            >
              Sign in with Apple
            </Button>

            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: 'rgba(0, 0, 0, 0.6)',
                textAlign: 'center',
                px: 2
              }}
            >
              By clicking Continue, you agree to JobConnect's{' '}
              <MuiLink
                href="#"
                sx={{
                  color: '#0a66c2',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                User Agreement
              </MuiLink>
              ,{' '}
              <MuiLink
                href="#"
                sx={{
                  color: '#0a66c2',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Privacy Policy
              </MuiLink>
              , and{' '}
              <MuiLink
                href="#"
                sx={{
                  color: '#0a66c2',
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                Cookie Policy
              </MuiLink>
              .
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ display: 'inline' }}>
            New to JobConnect?{' '}
          </Typography>
          <MuiLink
            component={Link}
            to="/register"
            variant="body1"
            sx={{
              color: '#0a66c2',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Join now
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;