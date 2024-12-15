import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  IconButton,
  Stack,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Edit as EditIcon,
  PhotoCamera,
  Business,
  Email,
  Phone,
  LocationOn,
  Domain,
  Groups,
  Language,
  Description,
  WorkHistory,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    experience: '',
    companySize: '',
    industry: '',
    website: '',
    avatarUrl: '',
    companyLogoUrl: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/profile/employer');
      setProfileData(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await axios.put('/api/profile/employer', profileData);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      setLoading(true);
      const response = await axios.post('/api/profile/employer/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setProfileData(prev => ({
        ...prev,
        [type === 'avatar' ? 'avatarUrl' : 'companyLogoUrl']: response.data[type === 'avatar' ? 'avatarUrl' : 'companyLogoUrl']
      }));
      setError(null);
    } catch (err) {
      setError(err.response?.data || 'Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.email) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Decorative Header */}
        <Box 
          sx={{ 
            height: '200px', 
            background: 'linear-gradient(135deg, #1976d2 0%, #64b5f6 50%, #42a5f5 100%)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              background: 'radial-gradient(circle at 50% 150%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
            }
          }} />
          {/* Quote Section */}
          <Box sx={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '90%',
              color: 'rgba(255, 255, 255, 0.9)',
            }}>
              <Typography
                variant="h6"
                sx={{
                  fontStyle: 'italic',
                  marginBottom: '8px',
                  textShadow: '0 1px 2px rgba(0,0,0,0.2)',
                  fontWeight: 500,
                }}
              >
                "Success is not final, failure is not fatal: it is the courage to continue that counts."
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontStyle: 'italic',
                }}
              >
                - Winston Churchill
              </Typography>
            </Box>

            {/* Decorative Elements */}
            <Box sx={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center',
              width: '90%',
              display: 'flex',
              justifyContent: 'space-around',
              color: 'rgba(255, 255, 255, 0.8)',
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Connect
                </Typography>
                <Typography variant="caption">
                  Build Your Network
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Grow
                </Typography>
                <Typography variant="caption">
                  Develop Skills
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Achieve
                </Typography>
                <Typography variant="caption">
                  Reach Goals
                </Typography>
              </Box>
            </Box>
      
        
        <Box sx={{ p: 4, mt: -12, position: 'relative' }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                boxShadow: 1,
                '& .MuiAlert-icon': {
                  fontSize: '1.5rem'
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            mb: 4,
            position: 'relative',
          }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{ 
                  width: 120, 
                  height: 120, 
                  border: '4px solid white',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: isEditing ? 'scale(1.05)' : 'none'
                  }
                }}
                alt={profileData.name}
                src={profileData.avatarUrl ? `http://localhost:8080${profileData.avatarUrl}` : '/static/images/avatar/default.jpg'}
              />
              {isEditing && (
                <Tooltip title="Upload photo">
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'white',
                      boxShadow: 2,
                      '&:hover': { 
                        bgcolor: 'grey.100',
                        transform: 'scale(1.1)',
                      },
                      transition: 'transform 0.2s ease'
                    }}
                    aria-label="upload picture"
                    component="label"
                  >
                    <input 
                      hidden 
                      accept="image/*" 
                      type="file"
                      onChange={(e) => handleImageUpload(e, 'avatar')} 
                    />
                    <PhotoCamera color="primary" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>

            <Box sx={{ ml: 3, mb: 1 }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              >
                {profileData.name}
              </Typography>
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  fontSize: '1.1rem'
                }}
              >
                {user?.role}
              </Typography>
            </Box>

            <Button
              variant={isEditing ? "contained" : "outlined"}
              startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
              sx={{ 
                ml: 'auto',
                color: isEditing ? 'white' : 'primary.main',
                borderColor: isEditing ? 'transparent' : 'rgba(255,255,255,0.5)',
                bgcolor: isEditing ? 'error.main' : 'white',
                '&:hover': {
                  bgcolor: isEditing ? 'error.dark' : 'rgba(255,255,255,0.9)',
                  borderColor: isEditing ? 'transparent' : 'white',
                },
                transition: 'all 0.2s ease',
                textTransform: 'none',
                px: 3,
              }}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </Button>
          </Box>

          <Divider sx={{ 
            my: 4,
            opacity: 0.7,
            '&::before, &::after': {
              borderColor: 'primary.light',
            }
          }} />

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Business sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  disabled={true}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={profileData.location}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Industry"
                  name="industry"
                  value={profileData.industry}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Domain sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Company Size"
                  name="companySize"
                  value={profileData.companySize}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Groups sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website"
                  name="website"
                  value={profileData.website}
                  onChange={handleChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <Language sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="My Biography"
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: <Description sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Personal Experience"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleChange}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                  InputProps={{
                    startAdornment: <WorkHistory sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ '& .MuiOutlinedInput-root': customInputStyle }}
                />
              </Grid>
              {isEditing && (
                <Grid item xs={12}>
                  <Stack 
                    direction="row" 
                    spacing={2} 
                    justifyContent="flex-end"
                    sx={{ mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={loading}
                      startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                      sx={{
                        bgcolor: 'primary.main',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                        boxShadow: 2,
                        px: 4,
                        py: 1.5,
                        textTransform: 'none',
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </Stack>
                </Grid>
              )}
            </Grid>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

// Custom styles for input fields
const customInputStyle = {
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: 'primary.main',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderRadius: '8px',
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderWidth: '2px',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
  },
  transition: 'all 0.2s ease',
};

// Exports
export default Profile;