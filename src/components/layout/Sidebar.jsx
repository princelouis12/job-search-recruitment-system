import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
  Typography,
  Avatar,
  Button,
  Collapse,
  Badge,
  IconButton,
  ListItemButton,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  BusinessCenterOutlined as BusinessCenterIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  AssignmentInd as ApplicationsIcon,
  Search as SearchIcon,
  Bookmark as BookmarkIcon,
  School as SchoolIcon,
  Chat as ChatIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  KeyboardArrowUp as ArrowUpIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

const EnhancedSidebar = ({ open, drawerWidth, user, handleDrawerToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({
    jobs: true,
    learning: false,
    career: false,
  });

  // Menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        text: 'Dashboard',
        icon: <DashboardIcon />,
        path: '/dashboard',
      },
      {
        text: 'Profile',
        icon: <PersonIcon />,
        path: '/profile',
      },
    ];

    const jobSeekerItems = [
      {
        section: 'Job Search',
        expandable: true,
        key: 'jobs',
        items: [
          {
            text: 'Find Jobs',
            icon: <SearchIcon />,
            path: '/jobs/search',
          },
          {
            text: 'Saved Jobs',
            icon: <BookmarkIcon />,
            path: '/saved-jobs',
          },
          
          {
            text: 'Applications',
            icon: <ApplicationsIcon />,
            path: '/my-applications',
          },
        ],
      },
      {
        section: 'Learning',
        expandable: true,
        key: 'learning',
        items: [
          {
            text: 'Courses',
            icon: <SchoolIcon />,
            path: '/courses',
          },
          {
            text: 'Certifications',
            icon: <BusinessCenterIcon />,
            path: '/certifications',
          },
        ],
      },
    ];

    const employerItems = [
      {
        text: 'Manage Jobs',
        icon: <WorkIcon />,
        path: '/jobs/manage',
      },
      {
        text: 'Applications',
        icon: <ApplicationsIcon />,
        path: '/jobs',
      },
      {
        text: 'Company Profile',
        icon: <BusinessIcon />,
        path: '/company-profile',
      },
    ];

    const adminItems = [
      {
        text: 'Users',
        icon: <PeopleIcon />,
        path: '/users',
      },
      {
        text: 'Companies',
        icon: <BusinessIcon />,
        path: '/companies',
      },
      {
        text: 'Reports',
        icon: <BarChartIcon />,
        path: '/reports',
      },
    ];

    switch (user?.role?.toLowerCase()) {
      case 'jobseeker':
        return [...commonItems, ...jobSeekerItems];
      case 'employer':
        return [...commonItems, ...employerItems];
      case 'admin':
        return [...commonItems, ...adminItems];
      default:
        return commonItems;
    }
  };

  const bottomMenuItems = [
    {
      text: 'Messages',
      icon: <ChatIcon />,
      path: '/messages',
    },
    {
      text: 'Settings',
      icon: <SettingsIcon />,
      path: '/settings',
    },
    {
      text: 'Help & Support',
      icon: <HelpIcon />,
      path: '/help',
    },
  ];

  const handleSectionExpand = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderMenuItems = (items, isSubItem = false) => {
    return items.map((item) => {
      if (item.section) {
        return (
          <Box key={item.section}>
            <ListItemButton
              onClick={() => handleSectionExpand(item.key)}
              sx={{ pl: isSubItem ? 4 : 2 }}
            >
              <ListItemText
                primary={item.section}
                primaryTypographyProps={{
                  variant: 'subtitle2',
                  color: 'text.secondary',
                }}
              />
              {expandedSections[item.key] ? <ArrowUpIcon /> : <ArrowDownIcon />}
            </ListItemButton>
            <Collapse in={expandedSections[item.key]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderMenuItems(item.items, true)}
              </List>
            </Collapse>
          </Box>
        );
      }

      return (
        <ListItem
          button
          key={item.text}
          onClick={() => navigate(item.path)}
          selected={location.pathname === item.path}
          sx={{
            pl: isSubItem ? 4 : 2,
            py: 1,
            '&.Mui-selected': {
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark',
              },
              '& .MuiListItemIcon-root': {
                color: 'inherit',
              },
            },
            borderRadius: isSubItem ? '0 20px 20px 0' : 'none',
            mx: isSubItem ? 1 : 0,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 40,
              color: location.pathname === item.path ? 'inherit' : 'text.secondary',
            }}
          >
            {item.icon}
          </ListItemIcon>
          <ListItemText
            primary={item.text}
            primaryTypographyProps={{
              variant: isSubItem ? 'body2' : 'body1',
              fontWeight: location.pathname === item.path ? 600 : 400,
            }}
          />
        </ListItem>
      );
    });
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: 'background.paper',
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
          boxShadow: '0 0 20px rgba(0,0,0,0.05)',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        {/* User Profile Section */}
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Avatar
            src={user?.avatarUrl}
            sx={{
              width: 64,
              height: 64,
              mx: 'auto',
              mb: 1,
              bgcolor: 'primary.main',
            }}
          >
            {user?.name?.charAt(0)}
          </Avatar>
          <Typography variant="subtitle1" fontWeight="medium">
            {user?.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {user?.role}
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate('/profile')}
            startIcon={<PersonIcon />}
          >
            View Profile
          </Button>
        </Box>
        <Divider sx={{ my: 1 }} />

        {/* Menu Items */}
        <List sx={{ px: 1 }}>
          {renderMenuItems(getMenuItems())}
        </List>

        {/* Bottom Menu */}
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ my: 1 }} />
          <List sx={{ px: 1 }}>
            {renderMenuItems(bottomMenuItems)}
          </List>
        </Box>
      </Box>
    </Drawer>
  );
};

export default EnhancedSidebar;