import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Avatar,
  IconButton,
  Badge,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  ListItemAvatar,
  LinearProgress,
  Chip,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Rating,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
  School as SchoolIcon,
  BookmarkBorder as BookmarkIcon,
  BusinessCenter as BusinessCenterIcon,
  BarChart as BarChartIcon,
  AttachMoney as MoneyIcon,
  Timeline as TimelineIcon,
  LocalOffer as OfferIcon,
  Build as BuildIcon,
  Assessment as AssessmentIcon,
  Message as MessageIcon,
  VideoCall as VideoCallIcon,
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const EnhancedJobSeekerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);

  // Extended Stats
  const [dashboardStats, setDashboardStats] = useState({
    jobMatches: 45,
    applicationsSubmitted: 12,
    pendingResponses: 5,
    savedJobs: 8,
    profileViews: 123,
    interviews: 3,
    profileStrength: 85,
    networkSize: 178,
  });

  // Interview Schedule
  const [interviews] = useState([
    {
      id: 1,
      company: "Tech Corp",
      position: "Senior React Developer",
      date: "2024-12-15T10:00:00",
      type: "Technical Interview",
      status: "Scheduled",
      link: "https://meet.google.com/xyz"
    },
    {
      id: 2,
      company: "Innovation Labs",
      position: "Frontend Lead",
      date: "2024-12-18T14:30:00",
      type: "HR Round",
      status: "Pending",
      link: null
    }
  ]);

  // Career Progress
  const [careerProgress] = useState({
    skillsGained: 12,
    certificationsCompleted: 3,
    coursesInProgress: 2,
    learningHours: 45
  });

  // Application Timeline
  const [applicationTimeline] = useState([
    {
      id: 1,
      company: "TechCorp",
      position: "Senior Developer",
      status: "Interview Scheduled",
      date: "2024-12-10",
      nextStep: "Technical Interview"
    },
    {
      id: 2,
      company: "InnovateLabs",
      position: "Lead Engineer",
      status: "Application Under Review",
      date: "2024-12-08",
      nextStep: "Waiting for Response"
    }
  ]);

  // Skill Assessment Data
  const [skillAssessments] = useState([
    {
      skill: "React",
      score: 85,
      percentile: 92,
      certificates: ["Meta React Certification", "React Advanced"]
    },
    {
      skill: "Node.js",
      score: 78,
      percentile: 85,
      certificates: ["Node.js Professional"]
    }
  ]);

  // Salary Insights
  const [salaryInsights] = useState({
    currentRole: {
      title: "Senior Developer",
      averageSalary: 120000,
      salaryRange: { min: 100000, max: 150000 },
      marketTrend: "increasing"
    },
    industryBenchmarks: [
      { role: "Junior Developer", salary: 75000 },
      { role: "Mid-level Developer", salary: 95000 },
      { role: "Senior Developer", salary: 120000 },
      { role: "Lead Developer", salary: 150000 }
    ]
  });

  // Job Search Analytics
  const [searchAnalytics] = useState({
    profileViews: [
      { date: "Mon", views: 12 },
      { date: "Tue", views: 19 },
      { date: "Wed", views: 15 },
      { date: "Thu", views: 22 },
      { date: "Fri", views: 25 }
    ],
    applicationResponses: [
      { status: "Viewed", count: 15 },
      { status: "Under Review", count: 8 },
      { status: "Interview", count: 4 },
      { status: "Offer", count: 1 }
    ]
  });

  // Learning Resources
  const [learningResources] = useState([
    {
      id: 1,
      title: "Advanced React Patterns",
      platform: "Coursera",
      progress: 75,
      deadline: "2024-12-20"
    },
    {
      id: 2,
      title: "System Design Interview Prep",
      platform: "Udemy",
      progress: 45,
      deadline: "2024-12-25"
    }
  ]);

  // Network and Connections
  const [networkStats] = useState({
    connections: 178,
    recentlyViewed: 12,
    pendingInvites: 5,
    recommendedConnections: 15
  });

  // Mentorship Opportunities
  const [mentorships] = useState([
    {
      id: 1,
      mentorName: "Sarah Chen",
      role: "Tech Lead at Google",
      expertise: ["System Design", "Career Growth"],
      availability: "2 slots available"
    },
    {
      id: 2,
      mentorName: "James Wilson",
      role: "Senior Architect at Amazon",
      expertise: ["Cloud Architecture", "Leadership"],
      availability: "1 slot available"
    }
  ]);

  // Interview Prep Resources
  const [interviewPrep] = useState({
    upcomingInterviews: 2,
    practiceSessionsCompleted: 5,
    recommendedTopics: ["System Design", "Algorithm Optimization", "React Performance"],
    mockInterviews: [
      {
        id: 1,
        topic: "Technical Architecture",
        date: "2024-12-14",
        duration: 60,
        status: "Scheduled"
      }
    ]
  });

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}>
      {/* Header Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar
              src={user?.avatarUrl}
              sx={{ width: 64, height: 64, mr: 2 }}
            />
            <Box>
              <Typography variant="h5">Welcome back, {user?.name}!</Typography>
              <Typography variant="subtitle1" color="text.secondary">
                {dashboardStats.profileViews} profile views this week
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Badge badgeContent={3} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton>
              <Badge badgeContent={2} color="primary">
                <MailIcon />
              </Badge>
            </IconButton>
            <Button
              variant="contained"
              startIcon={<WorkIcon />}
              onClick={() => navigate('/jobs/search')}
            >
              Find Jobs
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Quick Actions and Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          { icon: WorkIcon, label: 'Job Matches', value: dashboardStats.jobMatches },
          { icon: AssessmentIcon, label: 'Applications', value: dashboardStats.applicationsSubmitted },
          { icon: VideoCallIcon, label: 'Interviews', value: dashboardStats.interviews },
          { icon: BarChartIcon, label: 'Profile Strength', value: `${dashboardStats.profileStrength}%` }
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
              <item.icon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
              <Box>
                <Typography variant="h4" component="div">
                  {item.value}
                </Typography>
                <Typography color="text.secondary">
                  {item.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" />
          <Tab label="Applications" />
          <Tab label="Learning" />
          <Tab label="Career Growth" />
          <Tab label="Network" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {/* Overview Tab Content */}
            <Grid item xs={12} md={8}>
              {/* Application Status Timeline */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Applications
                </Typography>
                <Timeline>
                  {applicationTimeline.map((app) => (
                    <TimelineItem key={app.id}>
                      <TimelineDot color={getStatusColor(app.status)} />
                      <TimelineContent>
                        <Typography variant="subtitle1">
                          {app.position} at {app.company}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {app.status} - {app.nextStep}
                        </Typography>
                      </TimelineContent>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Paper>

              {/* Upcoming Interviews */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Upcoming Interviews
                </Typography>
                {interviews.map((interview) => (
                  <Card key={interview.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Typography variant="subtitle1">
                            {interview.position} at {interview.company}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(interview.date).toLocaleString()}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                          {interview.link ? (
                            <Button
                              variant="contained"
                              startIcon={<VideoCallIcon />}
                              href={interview.link}
                              target="_blank"
                            >
                              Join Interview
                            </Button>
                          ) : (
                            <Chip label={interview.status} color="primary" />
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Profile Completion */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Profile Strength
                </Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <CircularProgress
                    variant="determinate"
                    value={dashboardStats.profileStrength}
                    size={80}
                  />
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="caption" component="div" color="text.secondary">
                      {`${Math.round(dashboardStats.profileStrength)}%`}
                    </Typography>
                  </Box>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate('/profile')}
                >
                  Complete Profile
                </Button>
              </Paper>

              {/* Skill Assessments */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Skill Assessments
                </Typography>
                {skillAssessments.map((assessment) => (
                  <Box key={assessment.skill} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{assessment.skill}</Typography>
                      <Typography>{`${assessment.score}%`}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={assessment.score}
                      sx={{ mb: 1 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Top {assessment.percentile}th percentile
                    </Typography>
                  </Box>
                ))}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<AssessmentIcon />}
                >
                  Take New Assessment
                </Button>
              </Paper>

              {/* Learning Progress */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Learning Progress
                </Typography>
                {learningResources.map((resource) => (
                  <Box key={resource.id} sx={{ mb: 2 }}>
                    <Typography variant="subtitle2">{resource.title}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {resource.platform}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={resource.progress}
                        sx={{ flexGrow: 1, mr: 1 }}
                      />
                      <Typography variant="caption">
                        {resource.progress}%
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {/* Applications Tab Content */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Application Status</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Position</TableCell>
                        <TableCell>Company</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Applied Date</TableCell>
                        <TableCell>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {applicationTimeline.map((app) => (
                        <TableRow key={app.id}>
                          <TableCell>{app.position}</TableCell>
                          <TableCell>{app.company}</TableCell>
                          <TableCell>
                            <Chip
                              label={app.status}
                              color={getStatusColor(app.status)}
                            />
                          </TableCell>
                          <TableCell>{app.date}</TableCell>
                          <TableCell>
                            <Button
                              size="small"
                              variant="outlined"
                              onClick={() => navigate(`/applications/${app.id}`)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Application Analytics */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Response Analytics</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={searchAnalytics.applicationResponses}
                        dataKey="count"
                        nameKey="status"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {searchAnalytics.applicationResponses.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getChartColor(index)} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>

            {/* Profile Views */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Profile Views</Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={searchAnalytics.profileViews}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="views" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {/* Learning Tab Content */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Active Courses
                </Typography>
                {learningResources.map((course) => (
                  <Card key={course.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={8}>
                          <Typography variant="subtitle1">
                            {course.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {course.platform}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={course.progress}
                            sx={{ mt: 1 }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                          <Button variant="contained">
                            Continue Learning
                          </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                ))}
              </Paper>

              {/* Certifications */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Certifications
                </Typography>
                {skillAssessments.map((assessment) => (
                  assessment.certificates.map((cert, index) => (
                    <Card key={`${assessment.skill}-${index}`} sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1">
                          {cert}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {assessment.skill}
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Button size="small" variant="outlined">
                            View Certificate
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))
                ))}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Learning Stats */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Learning Progress
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h4">{careerProgress.skillsGained}</Typography>
                    <Typography color="text.secondary">Skills Gained</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4">{careerProgress.certificationsCompleted}</Typography>
                    <Typography color="text.secondary">Certifications</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4">{careerProgress.coursesInProgress}</Typography>
                    <Typography color="text.secondary">Active Courses</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h4">{careerProgress.learningHours}</Typography>
                    <Typography color="text.secondary">Learning Hours</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Recommended Courses */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recommended Courses
                </Typography>
                <List>
                  {["Advanced React Patterns", "System Design", "Cloud Architecture"].map((course, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <SchoolIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={course}
                        secondary="Recommended based on your profile"
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            {/* Career Growth Tab Content */}
            <Grid item xs={12} md={8}>
              {/* Salary Insights */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Salary Insights
                </Typography>
                <Box sx={{ height: 300, mb: 3 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salaryInsights.industryBenchmarks}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="role" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="salary" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
                <Alert severity="info">
                  Your current role's average salary is trending {salaryInsights.currentRole.marketTrend}
                </Alert>
              </Paper>

              {/* Career Path */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Career Path
                </Typography>
                <Box sx={{ position: 'relative' }}>
                  <Timeline>
                    {["Junior Developer", "Mid-level Developer", "Senior Developer", "Lead Developer"].map((role, index) => (
                      <TimelineItem key={index}>
                        <TimelineDot color={index === 2 ? "primary" : "grey"} />
                        <TimelineContent>
                          <Typography variant="subtitle1">{role}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {index === 2 ? "Current Position" : index < 2 ? "Completed" : "Next Step"}
                          </Typography>
                        </TimelineContent>
                      </TimelineItem>
                    ))}
                  </Timeline>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Mentorship */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Mentorship Opportunities
                </Typography>
                {mentorships.map((mentor) => (
                  <Card key={mentor.id} sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">
                        {mentor.mentorName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {mentor.role}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        {mentor.expertise.map((exp, index) => (
                          <Chip
                            key={index}
                            label={exp}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>
                      <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mt: 1 }}
                      >
                        Request Mentorship
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Paper>

              {/* Interview Preparation */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Interview Prep
                </Typography>
                <List>
                  {interviewPrep.recommendedTopics.map((topic, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <BuildIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={topic}
                        secondary="Recommended practice area"
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<VideoCallIcon />}
                  sx={{ mt: 2 }}
                >
                  Schedule Mock Interview
                </Button>
              </Paper>
            </Grid>
          </Grid>
        )}

        {activeTab === 4 && (
          <Grid container spacing={3}>
            {/* Network Tab Content */}
            <Grid item xs={12} md={8}>
              {/* Network Overview */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Your Network
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="h4">{networkStats.connections}</Typography>
                    <Typography color="text.secondary">Connections</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="h4">{networkStats.recentlyViewed}</Typography>
                    <Typography color="text.secondary">Profile Views</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="h4">{networkStats.pendingInvites}</Typography>
                    <Typography color="text.secondary">Pending Invites</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="h4">{networkStats.recommendedConnections}</Typography>
                    <Typography color="text.secondary">Recommended</Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Recent Connections */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Connections
                </Typography>
                <Grid container spacing={2}>
                  {[1, 2, 3, 4].map((connection) => (
                    <Grid item xs={12} sm={6} key={connection}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ mr: 2 }}>JD</Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                John Doe {connection}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Senior Developer at Tech Corp
                              </Typography>
                            </Box>
                          </Box>
                          <Button
                            variant="outlined"
                            fullWidth
                            sx={{ mt: 2 }}
                            startIcon={<MessageIcon />}
                          >
                            Message
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              {/* Industry Insights */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Industry Insights
                </Typography>
                <List>
                  {[
                    { title: 'Tech Salaries Up 15%', source: 'TechNews' },
                    { title: 'Remote Work Trends', source: 'WorkInsights' },
                    { title: 'Most In-Demand Skills', source: 'CareerStats' }
                  ].map((insight, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={insight.title}
                        secondary={`Source: ${insight.source}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>

              {/* Recommended Connections */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recommended Connections
                </Typography>
                <List>
                  {[
                    { name: 'Sarah Chen', role: 'Tech Lead', company: 'Google' },
                    { name: 'Mike Johnson', role: 'Senior Dev', company: 'Meta' },
                    { name: 'Lisa Wong', role: 'CTO', company: 'Startup Inc' }
                  ].map((person, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Avatar>{person.name[0]}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={person.name}
                        secondary={`${person.role} at ${person.company}`}
                      />
                      <Button size="small" variant="outlined">
                        Connect
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>

      {/* Notifications Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem>
          <ListItemIcon>
            <WorkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="New job match"
            secondary="Senior React Developer position"
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <MessageIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="New message"
            secondary="From Tech Corp recruiter"
          />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <CalendarIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Interview reminder"
            secondary="Tomorrow at 2 PM"
          />
        </MenuItem>
      </Menu>
    </Box>
  );
};

// Utility functions
const getStatusColor = (status) => {
  const statusColors = {
    'Pending': 'default',
    'Under Review': 'info',
    'Interview Scheduled': 'primary',
    'Offer': 'success',
    'Rejected': 'error'
  };
  return statusColors[status] || 'default';
};

const getChartColor = (index) => {
  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
  return colors[index % colors.length];
};

// Timeline Components
const Timeline = ({ children }) => (
  <Box sx={{ position: 'relative', paddingLeft: 2 }}>
    {children}
  </Box>
);

const TimelineItem = ({ children }) => (
  <Box sx={{ position: 'relative', mb: 3, pl: 3 }}>
    {children}
  </Box>
);

const TimelineDot = ({ color = 'primary' }) => (
  <Box
    sx={{
      position: 'absolute',
      left: -6,
      width: 12,
      height: 12,
      borderRadius: '50%',
      bgcolor: `${color}.main`,
    }}
  />
);

const TimelineContent = ({ children }) => (
  <Box sx={{ pl: 2 }}>
    {children}
  </Box>
);

export default EnhancedJobSeekerDashboard;