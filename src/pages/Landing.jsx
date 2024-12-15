import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Container, Typography, Button, Grid, Box, TextField, 
  Card, CardContent, Avatar, IconButton, InputAdornment,
  AppBar, Toolbar, useScrollTrigger, Slide, Paper,
  Fab, Divider, Chip, Rating
} from '@mui/material';
import { 
  Work as WorkIcon,
  Search as SearchIcon,
  BusinessCenter as BusinessCenterIcon,
  LocationOn as LocationIcon,
  ArrowUpward as ArrowUpwardIcon,
  Star as StarIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  PhoneIphone as PhoneIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Bookmark as BookmarkIcon,
  Share as ShareIcon,
  Check as CheckIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  AttachMoney as AttachMoneyIcon,
  Group as GroupIcon,
  Timer as TimerIcon,
  CalendarToday as CalendarIcon,
  Verified as VerifiedIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const ScrollToTop = () => {
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Slide in={trigger}>
      <Fab 
        color="primary" 
        size="small" 
        onClick={handleClick}
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <ArrowUpwardIcon />
      </Fab>
    </Slide>
  );
};

const ProtectedLink = ({ children, to, ...props }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      alert('Please login to access this feature');
    }
  };

  return (
    <Link to={to} onClick={handleClick} {...props}>
      {children}
    </Link>
  );
};

const Landing = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [jobKeyword, setJobKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [showStats, setShowStats] = useState(false);
  const [currentTestimonialPage, setCurrentTestimonialPage] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const statsSection = document.getElementById('stats-section');
      if (statsSection) {
        const rect = statsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.75) {
          setShowStats(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: SpeedIcon,
      title: 'AI-Powered Job Matching',
      description: 'Our advanced AI algorithms analyze your skills, experience, and preferences to connect you with the most relevant opportunities.',
      stats: ['93% Match Rate', '24h Response Time', '500K+ Matches'],
      benefits: ['Personalized recommendations', 'Skills gap analysis', 'Career path suggestions']
    },
    {
      icon: SecurityIcon,
      title: 'Enterprise Security',
      description: 'Bank-grade encryption and security protocols protect your sensitive information and job search activities.',
      stats: ['256-bit Encryption', 'ISO 27001 Certified', 'GDPR Compliant'],
      benefits: ['Private search mode', 'Data encryption', 'Access controls']
    },
    {
      icon: StarIcon,
      title: 'Smart Application Tracking',
      description: 'Stay organized with our intelligent application tracking system that manages your job search journey.',
      stats: ['1-Click Apply', 'Real-time Status', 'Interview Scheduler'],
      benefits: ['Application analytics', 'Follow-up reminders', 'Interview prep']
    },
    {
      icon: PhoneIcon,
      title: 'Career Growth Tools',
      description: 'Access comprehensive resources and tools designed to accelerate your professional development.',
      stats: ['1000+ Courses', 'Live Mentoring', 'Skill Assessments'],
      benefits: ['Resume builder', 'Salary insights', 'Industry trends']
    }
  ];

  const featuredJobs = [
    {
      title: "Senior Full Stack Developer",
      company: "TechVision Inc.",
      location: "San Francisco, CA",
      salary: "$140k - $180k",
      logo: "/api/placeholder/60/60",
      tags: ["Remote", "Full-time", "Healthcare", "401k"],
      description: "Join our innovative team building next-gen cloud solutions",
      requirements: ["7+ years experience", "React", "Node.js", "AWS"],
      benefits: ["Health Insurance", "401k Match", "Remote Work", "Learning Budget"],
      culture: ["Innovative", "Collaborative", "Work-Life Balance"],
      postedDate: "2 days ago",
      applicants: 45
    },
    {
      title: "Product Design Lead",
      company: "CreativeSpace",
      location: "New York, NY",
      salary: "$120k - $150k",
      logo: "/api/placeholder/60/60",
      tags: ["Hybrid", "Full-time", "Equity", "Unlimited PTO"],
      description: "Shape the future of digital product design",
      requirements: ["5+ years experience", "UI/UX", "Design Systems", "Leadership"],
      benefits: ["Equity", "Unlimited PTO", "Health Insurance", "Home Office Budget"],
      culture: ["Creative", "User-Focused", "Agile Environment"],
      postedDate: "1 day ago",
      applicants: 32
    },
    {
      title: "Data Science Manager",
      company: "DataFlow Analytics",
      location: "Boston, MA",
      salary: "$130k - $170k",
      logo: "/api/placeholder/60/60",
      tags: ["On-site", "Full-time", "Stock Options", "Bonus"],
      description: "Lead our data science initiatives and team",
      requirements: ["ML/AI", "Python", "Team Leadership", "Ph.D. preferred"],
      benefits: ["Stock Options", "Annual Bonus", "Health Insurance", "Gym Membership"],
      culture: ["Data-Driven", "Research-Oriented", "Continuous Learning"],
      postedDate: "3 days ago",
      applicants: 28
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "TechVision Inc.",
      avatar: "/api/placeholder/80/80",
      content: "The AI-powered job matching was incredibly accurate. I found my dream role at a top tech company within weeks of using the platform.",
      metrics: {
        timeToHire: "3 weeks",
        salaryIncrease: "45%",
        interviewsAttended: 4
      },
      journey: {
        before: "Struggling to find roles matching my full stack expertise",
        during: "Received personalized matches and interview prep support",
        after: "Landed a senior position with 45% salary increase"
      },
      rating: 5,
      image: "https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg", // Software engineer working at desk
      skills: ["React", "Node.js", "AWS", "System Design"]
    },
    {
      name: "James Rodriguez",
      role: "Product Manager",
      company: "InnovateCorp",
      avatar: "/api/placeholder/80/80",
      content: "The career growth tools and salary insights helped me negotiate a much better package. The platform's resources were invaluable.",
      metrics: {
        timeToHire: "4 weeks",
        salaryIncrease: "35%",
        interviewsAttended: 5
      },
      journey: {
        before: "Looking to transition from engineering to product",
        during: "Utilized career coaching and PM interview prep",
        after: "Successfully switched careers with higher compensation"
      },
      rating: 5,
      image: "https://images.pexels.com/photos/7163371/pexels-photo-7163371.jpeg", // Product team collaboration
      skills: ["Product Strategy", "Agile", "User Research", "Data Analysis"]
    },
    {
      name: "Lisa Thompson",
      role: "UX Design Director",
      company: "CreativeSpace",
      avatar: "/api/placeholder/80/80",
      content: "The application tracking system streamlined my job search. I could focus on preparing for interviews instead of managing applications.",
      metrics: {
        timeToHire: "2 weeks",
        salaryIncrease: "40%",
        interviewsAttended: 3
      },
      journey: {
        before: "Managing multiple applications across companies",
        during: "Streamlined process with integrated tracking",
        after: "Secured design leadership role at dream company"
      },
      rating: 5,
      image: "https://images.pexels.com/photos/3182833/pexels-photo-3182833.jpeg", // Design team working on UX project
      skills: ["UX Design", "Design Systems", "Team Leadership", "User Research"]
    }
  ];

  return (
    <Box sx={{ bgcolor: 'background.paper', overflow: 'hidden' }}>
      {/* Navigation Bar */}
      <AppBar position="sticky" elevation={0} color="transparent" sx={{ backdropFilter: 'blur(8px)' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            JobConnect
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button 
              color="inherit" 
              component={ProtectedLink} 
              to="/jobs"
            >
              Browse Jobs
            </Button>
            <Button color="inherit" component={Link} to="/employers">For Employers</Button>
            <Button color="inherit" component={Link} to="/resources">Resources</Button>
            {!isAuthenticated ? (
              <>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  component={Link} 
                  to="/login"
                  sx={{ minWidth: 100 }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={Link} 
                  to="/register"
                  sx={{ minWidth: 100 }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button 
                variant="contained" 
                color="primary" 
                component={Link} 
                to="/dashboard"
              >
                Dashboard
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1976d2 0%, #0f4c81 100%)',
          pt: 12,
          pb: 8,
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={7}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Typography
                    component="h1"
                    variant="h2"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      lineHeight: 1.2
                    }}
                  >
                    Elevate Your Career Journey
                  </Typography>
                  <Typography 
                    variant="h5" 
                    paragraph
                    sx={{ 
                      mb: 4,
                      fontSize: { xs: '1.2rem', md: '1.4rem' },
                      lineHeight: 1.6,
                      opacity: 0.9
                    }}
                  >
                    Join over 1 million professionals who've found their dream jobs through our AI-powered platform. Get matched with opportunities that align with your expertise and aspirations.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <VerifiedIcon sx={{ mr: 1 }} />
                      <Typography>
                        95% Success Rate
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <BusinessCenterIcon sx={{ mr: 1 }} />
                      <Typography>
                        100K+ Jobs
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <StarIcon sx={{ mr: 1 }} />
                      <Typography>
                        Top Companies
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>

              <Grid item xs={12} md={5}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Paper 
                    elevation={3}
                    sx={{ 
                      p: 3, 
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)'
                    }}
                  >
                    <Typography variant="h6" color="text.primary" gutterBottom>
                      Find Your Perfect Role
                    </Typography>
                    
                    {/* Advanced Search Form */}
                    <Box component="form" sx={{ '& .MuiTextField-root': { mb: 2 } }}>
                      <TextField
                        fullWidth
                        placeholder="Job title, skills, or keywords"
                        value={jobKeyword}
                        onChange={(e) => setJobKeyword(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                      />
                      
                      <TextField
                        fullWidth
                        placeholder="City, state, or 'Remote'"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon sx={{ color: 'primary.main' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                      />

                      {/* Job Type Filter */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Job Type
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {['Full-time', 'Part-time', 'Contract', 'Remote'].map((type) => (
                            <Chip
                              key={type}
                              label={type}
                              onClick={() => {}}
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: 'primary.light',
                                  color: 'white'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Experience Level */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Experience Level
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {['Entry Level', 'Mid Level', 'Senior', 'Lead'].map((level) => (
                            <Chip
                              key={level}
                              label={level}
                              onClick={() => {}}
                              sx={{ 
                                '&:hover': { 
                                  bgcolor: 'primary.light',
                                  color: 'white'
                                }
                              }}
                            />
                          ))}
                        </Box>
                      </Box>

                      {/* Action Buttons */}
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                          variant="contained"
                          size="large"
                          fullWidth
                          startIcon={<SearchIcon />}
                          sx={{ 
                            py: 1.5,
                            bgcolor: 'primary.main',
                            '&:hover': {
                              bgcolor: 'primary.dark'
                            }
                          }}
                        >
                          Search Jobs
                        </Button>
                        <Button
                          variant="outlined"
                          size="large"
                          fullWidth
                          sx={{ 
                            py: 1.5,
                            color: 'primary.main',
                            borderColor: 'primary.main',
                            '&:hover': {
                              borderColor: 'primary.dark'
                            }
                          }}
                        >
                          Advanced Filters
                        </Button>
                      </Box>
                    </Box>
                  </Paper>

                  {/* Popular Searches */}
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)', mb: 1 }}>
                      Popular Searches
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                      {[
                        'Software Engineer',
                        'Product Manager',
                        'Data Scientist',
                        'UX Designer',
                        'DevOps Engineer'
                      ].map((term) => (
                        <Chip
                          key={term}
                          label={term}
                          size="small"
                          onClick={() => setJobKeyword(term)}
                          sx={{ 
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            '&:hover': { 
                              bgcolor: 'rgba(255, 255, 255, 0.3)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>

            {/* Key Benefits */}
            <Box sx={{ mt: 6 }}>
              <Grid container spacing={4}>
                {[
                  {
                    icon: <StarIcon sx={{ fontSize: 40 }} />,
                    title: "AI-Powered Matching",
                    description: "Smart algorithms find the perfect jobs for your skills"
                  },
                  {
                    icon: <SpeedIcon sx={{ fontSize: 40 }} />,
                    title: "Fast Application",
                    description: "Apply to multiple jobs with just one click"
                  },
                  {
                    icon: <SecurityIcon sx={{ fontSize: 40 }} />,
                    title: "Verified Employers",
                    description: "All companies are thoroughly vetted"
                  }
                ].map((benefit, index) => (
                  <Grid item xs={12} md={4} key={index}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + (index * 0.2) }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          textAlign: 'center',
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          borderRadius: 2
                        }}
                      >
                        {benefit.icon}
                        <Typography variant="h6" sx={{ my: 1 }}>
                          {benefit.title}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                          {benefit.description}
                        </Typography>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Container>
        </motion.div>
      </Box>

      {/* Statistics Section */}
      <Box id="stats-section" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { count: '100,000+', label: 'Active Jobs', icon: WorkIcon },
              { count: '50,000+', label: 'Companies', icon: BusinessCenterIcon },
              { count: '1M+', label: 'Job Seekers', icon: SearchIcon },
              { count: '95%', label: 'Success Rate', icon: StarIcon }
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={showStats ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card sx={{ textAlign: 'center', height: '100%' }}>
                    <CardContent>
                      <stat.icon sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
                      <Typography variant="h4" gutterBottom>
                        {stat.count}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Why Choose Us */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Why Choose Us
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 6 }}>
            We provide the tools and resources you need to succeed in your career journey
          </Typography>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: 'pointer',
                      transform: activeFeature === index ? 'scale(1.02)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: 6
                      }
                    }}
                    onClick={() => setActiveFeature(index)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <feature.icon sx={{ fontSize: 48, color: 'primary.main', mr: 2 }} />
                        <Typography variant="h5" component="h3">
                          {feature.title}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body1" color="text.secondary" paragraph>
                        {feature.description}
                      </Typography>

                      <Grid container spacing={2} sx={{ mb: 3 }}>
                        {feature.stats.map((stat, i) => (
                          <Grid item xs={4} key={i}>
                            <Paper 
                              elevation={0} 
                              sx={{ 
                                p: 1.5, 
                                textAlign: 'center',
                                bgcolor: 'primary.light',
                                color: 'primary.contrastText',
                                borderRadius: 2
                              }}
                            >
                              <Typography variant="body2" fontWeight="medium">
                                {stat}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>

                      <Box>
                        {feature.benefits.map((benefit, i) => (
                          <Box key={i} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CheckIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                            <Typography variant="body2" color="text.secondary">
                              {benefit}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Jobs Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Featured Opportunities
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 6 }}>
            Discover your next career move with top companies
          </Typography>
          
          <Grid container spacing={3}>
            {featuredJobs.map((job, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card sx={{ 
                    height: '100%',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'translateY(-4px)',
                      transition: 'all 0.3s ease'
                    }
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={job.logo} sx={{ width: 56, height: 56, mr: 2 }} />
                        <Box>
                          <Typography variant="h6" gutterBottom>
                            {job.title}
                          </Typography>
                          <Typography variant="subtitle2" color="text.secondary">
                            {job.company}
                          </Typography>
                        </Box>
                        <IconButton sx={{ ml: 'auto' }}>
                          <BookmarkIcon />
                        </IconButton>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {job.tags.map((tag, i) => (
                          <Chip
                            key={i}
                            label={tag}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Typography variant="body2" paragraph>
                        {job.description}
                      </Typography>

                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <LocationIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.location}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AttachMoneyIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.salary}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <GroupIcon sx={{ fontSize: 20, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            {job.applicants} applicants
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle2" gutterBottom color="text.secondary">
                        Requirements
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {job.requirements.map((req, i) => (
                          <Chip
                            key={i}
                            label={req}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                            color="default"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Typography variant="subtitle2" gutterBottom color="text.secondary">
                        Benefits
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        {job.benefits.map((benefit, i) => (
                          <Chip
                            key={i}
                            label={benefit}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                            color="success"
                            variant="outlined"
                          />
                        ))}
                      </Box>

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          Posted {job.postedDate}
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="primary"
                          component={ProtectedLink}
                          to={`/jobs/${job.title.toLowerCase().replace(/ /g, '-')}`}
                        >
                          Apply Now
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Success Stories Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" gutterBottom>
            Success Stories
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 6 }}>
            Real outcomes from professionals like you
          </Typography>

          <Box sx={{ position: 'relative' }}>
            <Box sx={{ overflow: 'hidden' }}>
              <motion.div
                animate={{ x: `-${currentTestimonialPage * 100}%` }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ display: 'flex' }}
              >
                {testimonials.map((testimonial, index) => (
                  <Box
                    key={index}
                    sx={{
                      flexShrink: 0,
                      width: '100%',
                      px: 2
                    }}
                  >
                    <Card sx={{ height: '100%' }}>
                      <Grid container>
                        <Grid item xs={12} md={6}>
                          <CardContent sx={{ height: '100%', position: 'relative', p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Avatar
                                src={testimonial.avatar}
                                sx={{ width: 64, height: 64, mr: 2 }}
                              />
                              <Box>
                                <Typography variant="h6">
                                  {testimonial.name}
                                </Typography>
                                <Typography variant="subtitle2" color="text.secondary">
                                  {testimonial.role} at {testimonial.company}
                                </Typography>
                                <Rating value={testimonial.rating} readOnly size="small" />
                              </Box>
                            </Box>

                            <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                              "{testimonial.content}"
                            </Typography>

                            <Box sx={{ my: 3 }}>
                              <Typography variant="subtitle2" gutterBottom color="primary">
                                My Journey
                              </Typography>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                  <ArrowUpwardIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20, transform: 'rotate(-45deg)' }} />
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      Before
                                    </Typography>
                                    <Typography variant="body2">
                                      {testimonial.journey.before}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                  <ArrowUpwardIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      During
                                    </Typography>
                                    <Typography variant="body2">
                                      {testimonial.journey.during}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                  <VerifiedIcon sx={{ color: 'success.main', mr: 1, fontSize: 20 }} />
                                  <Box>
                                    <Typography variant="subtitle2" color="text.secondary">
                                      After
                                    </Typography>
                                    <Typography variant="body2">
                                      {testimonial.journey.after}
                                    </Typography>
                                  </Box>
                                </Box>
                              </Box>
                            </Box>

                            <Grid container spacing={2}>
                              <Grid item xs={4}>
                                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                                  <Typography variant="h6" color="primary.contrastText">
                                    {testimonial.metrics.timeToHire}
                                  </Typography>
                                  <Typography variant="caption" color="primary.contrastText">
                                    Time to Hire
                                  </Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={4}>
                                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                                  <Typography variant="h6" color="primary.contrastText">
                                    {testimonial.metrics.salaryIncrease}
                                  </Typography>
                                  <Typography variant="caption" color="primary.contrastText">
                                    Salary Increase
                                  </Typography>
                                </Paper>
                              </Grid>
                              <Grid item xs={4}>
                                <Paper elevation={0} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light' }}>
                                  <Typography variant="h6" color="primary.contrastText">
                                    {testimonial.metrics.interviewsAttended}
                                  </Typography>
                                  <Typography variant="caption" color="primary.contrastText">
                                    Interviews
                                  </Typography>
                                </Paper>
                              </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Key Skills
                              </Typography>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {testimonial.skills.map((skill, i) => (
                                  <Chip
                                    key={i}
                                    label={skill}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                ))}
                              </Box>
                            </Box>
                          </CardContent>
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <Box
                            component="img"
                            src={testimonial.image}
                            alt="Success Story"
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Box>
                ))}
              </motion.div>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <IconButton
                onClick={() => setCurrentTestimonialPage(prev => Math.max(0, prev - 1))}
                disabled={currentTestimonialPage === 0}
                sx={{ 
                  mr: 2,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'grey.300' }
                }}
              >
                <NavigateBeforeIcon />
              </IconButton>
              <IconButton
                onClick={() => setCurrentTestimonialPage(prev => 
                  Math.min(testimonials.length - 1, prev + 1)
                )}
                disabled={currentTestimonialPage === testimonials.length - 1}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  '&.Mui-disabled': { bgcolor: 'grey.300' }
                }}
              >
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: 'primary.dark', color: 'white', pt: 6, pb: 3 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                About JobPortal
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                We connect talented professionals with outstanding opportunities.
                Our mission is to make the job search and hiring process seamless and efficient.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    } 
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton 
                  color="inherit"
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    } 
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton 
                  color="inherit"
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    } 
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton 
                  color="inherit"
                  sx={{ 
                    '&:hover': { 
                      bgcolor: 'rgba(255, 255, 255, 0.1)' 
                    } 
                  }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link 
                  component={ProtectedLink} 
                  to="/jobs" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Find Jobs
                </Link>
                <Link 
                  component={Link} 
                  to="/companies" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Browse Companies
                </Link>
                <Link 
                  component={Link} 
                  to="/salary" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Salary Guide
                </Link>
                <Link 
                  component={Link} 
                  to="/resources" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Career Resources
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" gutterBottom>
                For Employers
              </Typography>
              <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Link 
                  component={ProtectedLink} 
                  to="/post-job" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Post a Job
                </Link>
                <Link 
                  component={Link} 
                  to="/pricing" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Pricing
                </Link>
                <Link 
                  component={Link} 
                  to="/resources/employers" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Employer Resources
                </Link>
                <Link 
                  component={Link} 
                  to="/contact" 
                  color="inherit" 
                  sx={{ textDecoration: 'none', '&:hover': { color: 'primary.light' } }}
                >
                  Contact Sales
                </Link>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" gutterBottom>
                Newsletter
              </Typography>
              <Typography variant="body2" paragraph>
                Subscribe to our newsletter for job search tips and career advice
              </Typography>
              <Box component="form" sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  variant="outlined"
                  size="small"
                  placeholder="Enter your email"
                  fullWidth
                  sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    input: { color: 'white' },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    }
                  }}
                />
                <Button 
                  variant="contained" 
                  color="secondary"
                  sx={{ 
                    minWidth: 120,
                    '&:hover': { 
                      bgcolor: 'secondary.dark' 
                    } 
                  }}
                >
                  Subscribe
                </Button>
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="body2">
                © {new Date().getFullYear()} JobPortal. All rights reserved.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                justifyContent: { xs: 'flex-start', md: 'flex-end' } 
              }}>
                <Link 
                  component={Link} 
                  to="/privacy" 
                  color="inherit" 
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.light' }
                  }}
                >
                  Privacy Policy
                </Link>
                <Link 
                  component={Link} 
                  to="/terms" 
                  color="inherit" 
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.light' }
                  }}
                >
                  Terms of Service
                </Link>
                <Link 
                  component={Link} 
                  to="/cookies" 
                  color="inherit" 
                  sx={{ 
                    textDecoration: 'none',
                    '&:hover': { color: 'primary.light' }
                  }}
                >
                  Cookie Policy
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </Box>
  );
};

export default Landing;