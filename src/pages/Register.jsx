import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Lock, Briefcase } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLoginButton, GithubLoginButton, LinkedInLoginButton } from "react-social-login-buttons";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Link as MuiLink,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  InputAdornment,
  Divider,
  FormHelperText,
} from '@mui/material';
import { register, reset } from '../features/auth/authSlice';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: Yup.string().required('Role is required'),
  agreeToTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);


  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      agreeToTerms: false
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const { confirmPassword, agreeToTerms, ...userData } = values;
        await dispatch(register(userData)).unwrap();
      } catch (error) {
        console.error('Registration error:', error);
        if (error.includes('Email already exists')) {
          setFieldError('email', 'Email already exists');
        } else {
          toast.error(error || 'Registration failed');
        }
      } finally {
        setSubmitting(false);
      }
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

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
    toast.info(`${provider} login will be implemented soon`);
  };

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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" align="center" fontWeight="bold" color="primary" gutterBottom>
          Make the most of your professional life
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
        <Box component="form" onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                autoComplete="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <User size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formik.values.role}
                  label="Role"
                  onChange={formik.handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Briefcase size={20} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="admin">Administrator</MenuItem>
                  <MenuItem value="jobseeker">Job Seeker</MenuItem>
                  <MenuItem value="employer">Employer</MenuItem>
                </Select>
                {formik.touched.role && formik.errors.role && (
                  <FormHelperText>{formik.errors.role}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  pl: 0.5,
                  pr: 2,
                  '& > span': {
                    display: 'block',
                    textAlign: 'center',
                    mt: 0.5
                  }
                }}
              >
                By clicking Accept & Join or Continue, you agree to the JobConnect's{' '}
                <span>
                  <MuiLink href="#" color="primary">
                    Terms of Service
                  </MuiLink>
                  ,{' '}
                  <MuiLink href="#" color="primary">
                    Privacy Policy
                  </MuiLink>
                  , and{' '}
                  <MuiLink href="#" color="primary">
                    Cookie Policy
                  </MuiLink>
                </span>
          
              </Typography>
              {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                <FormHelperText error sx={{ pl: 0.5 }}>{formik.errors.agreeToTerms}</FormHelperText>
              )}
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold',
              textTransform: 'none'
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Accept & Join'
            )}
          </Button>

          <Divider sx={{ my: 3 }}>
            <Typography color="text.secondary">or</Typography>
          </Divider>

          <Box sx={{ mb: 3 }}>
            <GoogleLoginButton
              onClick={() => handleSocialLogin('Google')}
              style={{ 
                marginBottom: '8px',
                textAlign: 'center'
              }}
              align="center"
            >
              <span style={{ width: '100%', textAlign: 'center' }}>Continue with Google</span>
            </GoogleLoginButton>
            
            <LinkedInLoginButton
              onClick={() => handleSocialLogin('LinkedIn')}
              style={{ 
                textAlign: 'center'
              }}
              align="center"
            >
              <span style={{ width: '100%', textAlign: 'center' }}>Continue with LinkedIn</span>
            </LinkedInLoginButton>
          </Box>

          <Grid container justifyContent="center">
            <Grid item>
              <Typography variant="body2" align="center" color="text.secondary">
                Already on our JobConnect?{' '}
                <MuiLink
                  component={Link}
                  to="/login"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Sign in
                </MuiLink>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      <Typography variant="body2" align="center" sx={{ mt: 3, mb: 4 }} color="text.secondary">
        Looking to create a business page?{' '}
        <MuiLink
          href="#"
          sx={{
            fontWeight: 'bold',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          Get help
        </MuiLink>
      </Typography>

      <ToastContainer />
    </Container>
  );
};

export default Register;