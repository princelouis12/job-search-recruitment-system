import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Check as CheckIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    applicationsToday: 0
  });
  const [userActivity, setUserActivity] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, activityResponse, recentResponse] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/user-activity'),
          axios.get('/api/admin/recent-activities')
        ]);
        
        setStats(statsResponse.data);
        setUserActivity(activityResponse.data);
        setRecentActivities(recentResponse.data);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (activityId) => {
    try {
      await axios.post(`/api/admin/activities/${activityId}/approve`);
      toast.success('Activity approved successfully');
      const response = await axios.get('/api/admin/recent-activities');
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Error approving activity:', error);
      toast.error('Failed to approve activity');
    }
  };

  const handleReject = async (activityId) => {
    try {
      await axios.post(`/api/admin/activities/${activityId}/reject`);
      toast.success('Activity rejected successfully');
      const response = await axios.get('/api/admin/recent-activities');
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Error rejecting activity:', error);
      toast.error('Failed to reject activity');
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Admin Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{stats.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Active Jobs</Typography>
            <Typography variant="h4">{stats.activeJobs}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Applications Today</Typography>
            <Typography variant="h4">{stats.applicationsToday}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>User Activity</Typography>
            <Box sx={{ height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={userActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Activities</Typography>
            <List>
              {recentActivities.map((activity) => (
                <ListItem key={activity.id}>
                  <ListItemText 
                    primary={activity.action} 
                    secondary={`${activity.user} - ${activity.timestamp}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleApprove(activity.id)}
                    >
                      <CheckIcon color="success" />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleReject(activity.id)}
                    >
                      <CloseIcon color="error" />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalApplications: 0,
    interviews: 0,
    profileViews: 0
  });
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, applicationsResponse, jobsResponse] = await Promise.all([
          axios.get('/api/jobseeker/stats'),
          axios.get('/api/applications/my'),
          axios.get('/api/jobs/recommended')
        ]);
        
        setStats(statsResponse.data);
        setApplications(applicationsResponse.data);
        setRecommendedJobs(jobsResponse.data);
      } catch (error) {
        console.error('Error fetching jobseeker data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleViewApplication = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  const handleViewJob = (jobId) => {
    navigate(`/jobs/${jobId}`);
  };

  const handleApply = (jobId) => {
    navigate(`/jobs/${jobId}/apply`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Job Seeker Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Total Applications</Typography>
            <Typography variant="h4">{stats.totalApplications}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Interviews Scheduled</Typography>
            <Typography variant="h4">{stats.interviews}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Profile Views</Typography>
            <Typography variant="h4">{stats.profileViews}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>My Applications</Typography>
            <List>
              {applications.map((application) => (
                <ListItem key={application.id}>
                  <ListItemText
                    primary={application.job.title}
                    secondary={`${application.job.company} - ${application.status}`}
                  />
                  <Chip 
                    label={application.status} 
                    color={application.status === 'PENDING' ? 'default' : 'primary'} 
                  />
                  <IconButton edge="end" onClick={() => handleViewApplication(application.id)}>
                    <ViewIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recommended Jobs</Typography>
            <Grid container spacing={2}>
              {recommendedJobs.map((job) => (
                <Grid item xs={12} md={4} key={job.id}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">{job.title}</Typography>
                      <Typography color="textSecondary">{job.company}</Typography>
                      <Typography variant="body2">
                        {job.salary} • {job.location}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => handleViewJob(job.id)}>
                        View Details
                      </Button>
                      <Button 
                        size="small" 
                        variant="contained"
                        onClick={() => handleApply(job.id)}
                      >
                        Apply Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    hiredCandidates: 0
  });
  const [jobs, setJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsResponse, jobsResponse, applicationsResponse] = await Promise.all([
          axios.get('/api/employer/stats'),
          axios.get('/api/jobs/employer'),
          axios.get('/api/applications/recent')
        ]);
        
        setStats(statsResponse.data);
        setJobs(jobsResponse.data);
        setRecentApplications(applicationsResponse.data);
      } catch (error) {
        console.error('Error fetching employer data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handlePostJob = () => {
    navigate('/jobs/post');
  };

  const handleViewApplication = (applicationId) => {
    navigate(`/applications/${applicationId}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Employer Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Active Job Posts</Typography>
            <Typography variant="h4">{stats.activeJobs}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Total Applications</Typography>
            <Typography variant="h4">{stats.totalApplications}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6">Hired Candidates</Typography>
            <Typography variant="h4">{stats.hiredCandidates}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">My Job Postings</Typography>
              <Button variant="contained" onClick={handlePostJob}>
                Post New Job
              </Button>
            </Box>
            <List>
              {jobs.map((job) => (
                <ListItem key={job.id}>
                  <ListItemText
                    primary={job.title}
                    secondary={`${job.totalApplications} applications • ${job.status}`}
                  />
                  <Button 
                    size="small"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    View Details
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Applications</Typography>
            <List>
              {recentApplications.map((application) => (
                <ListItem key={application.id}>
                  <ListItemText
                    primary={application.applicant.name}
                    secondary={application.job.title}
                  />
                  <Chip 
                    label={application.status} 
                    color={application.status === 'NEW' ? 'primary' : 'default'}
                  />
                  <IconButton 
                    edge="end" 
                    onClick={() => handleViewApplication(application.id)}
                  >
                    <ViewIcon />
                  </IconButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  const renderDashboard = () => {
    const userRole = user?.role?.toLowerCase();
    switch (userRole) {
      case 'admin':
        return <AdminDashboard />;
      case 'jobseeker':
        return <JobSeekerDashboard />;
      case 'employer':
        return <EmployerDashboard />;
      default:
        return (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" color="error">
              Invalid user role: {userRole}
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {renderDashboard()}
      <ToastContainer />
    </Box>
  );
};

export default Dashboard;