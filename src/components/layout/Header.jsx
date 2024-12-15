import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { styled, alpha } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Badge,
  Button,
  Tooltip,
  Divider,
  ListItemIcon,
  useTheme,
  InputBase,
  Chip,
  Stack,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Help as HelpIcon,
  BusinessCenter as BusinessIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../features/auth/authSlice';

// Styled Components
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => !['open', 'drawerwidth'].includes(prop),
})(({ theme, open, drawerwidth }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin', 'background-color'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundImage: `linear-gradient(to right, ${alpha(theme.palette.primary.main, 0.95)}, ${alpha(theme.palette.primary.dark, 0.95)})`,
  backdropFilter: 'blur(8px)',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  ...(open && {
    marginLeft: drawerwidth,
    width: `calc(100% - ${drawerwidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius * 3,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: theme.transitions.create('background-color'),
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '40ch',
    },
  },
}));

const IconButtonAnimated = styled(IconButton)(({ theme }) => ({
  position: 'relative',
  transition: theme.transitions.create(['transform', 'background-color'], {
    duration: theme.transitions.duration.shorter,
  }),
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: alpha(theme.palette.common.white, 0.15),
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Header = ({ open, drawerWidth, handleDrawerToggle, toggleTheme, isDarkMode }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [messagesAnchor, setMessagesAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock notifications and messages (replace with real data)
  const notifications = [
    { id: 1, title: 'New job match!', message: 'A new job matches your profile' },
    { id: 2, title: 'Application update', message: 'Your application was viewed' },
  ];

  const messages = [
    { id: 1, from: 'HR Manager', message: 'Interview scheduled' },
    { id: 2, from: 'System', message: 'Welcome to JobConnect!' },
  ];

  const handleProfileMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsMenu = (event) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMessagesMenu = (event) => {
    setMessagesAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
    setMessagesAnchor(null);
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <StyledAppBar position="fixed" open={open} drawerwidth={drawerWidth}>
      <Toolbar>
        <IconButtonAnimated
          color="inherit"
          aria-label="toggle drawer"
          onClick={handleDrawerToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButtonAnimated>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <BusinessIcon sx={{ fontSize: 32, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={motion.div}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ 
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.common.white}, ${alpha(theme.palette.common.white, 0.8)})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            JobConnect
          </Typography>
        </Box>

        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search jobs, companies, or users…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
          />
        </Search>

        <Box sx={{ flexGrow: 1 }} />

        {user && (
          <Stack direction="row" spacing={1} alignItems="center">
            {/* Quick Actions */}
            <Chip
              icon={<DashboardIcon />}
              label="Dashboard"
              clickable
              onClick={() => navigate('/dashboard')}
              sx={{
                bgcolor: alpha(theme.palette.common.white, 0.15),
                color: 'white',
                '&:hover': {
                  bgcolor: alpha(theme.palette.common.white, 0.25),
                },
              }}
            />

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButtonAnimated color="inherit" onClick={handleNotificationsMenu}>
                <StyledBadge badgeContent={notifications.length} color="error">
                  <NotificationsIcon />
                </StyledBadge>
              </IconButtonAnimated>
            </Tooltip>

            {/* Messages */}
            <Tooltip title="Messages">
              <IconButtonAnimated color="inherit" onClick={handleMessagesMenu}>
                <StyledBadge badgeContent={messages.length} color="error">
                  <MailIcon />
                </StyledBadge>
              </IconButtonAnimated>
            </Tooltip>

            {/* Theme Toggle */}
            <Tooltip title={isDarkMode ? 'Light Mode' : 'Dark Mode'}>
              <IconButtonAnimated onClick={toggleTheme} color="inherit">
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButtonAnimated>
            </Tooltip>

            {/* Profile Menu */}
            <Tooltip title="Account settings">
              <IconButtonAnimated
                onClick={handleProfileMenu}
                sx={{
                  p: 0,
                  border: `2px solid ${alpha(theme.palette.common.white, 0.3)}`,
                  '&:hover': {
                    border: `2px solid ${theme.palette.common.white}`,
                  },
                }}
              >
                <Avatar
                  alt={user.name}
                  src={user.avatarUrl}
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.dark,
                  }}
                >
                  {user.name.charAt(0)}
                </Avatar>
              </IconButtonAnimated>
            </Tooltip>
          </Stack>
        )}

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle1" noWrap>
              {user?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <ListItemIcon>
              <PersonIcon fontSize="small" />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem onClick={() => navigate('/settings')}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            Settings
          </MenuItem>
          <MenuItem onClick={() => navigate('/help')}>
            <ListItemIcon>
              <HelpIcon fontSize="small" />
            </ListItemIcon>
            Help Center
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationsAnchor}
          open={Boolean(notificationsAnchor)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              maxHeight: 300,
              width: 360,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
          </Box>
          <Divider />
          {notifications.map((notification) => (
            <MenuItem key={notification.id} onClick={handleClose}>
              <Box sx={{ py: 1 }}>
                <Typography variant="subtitle2">{notification.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {notification.message}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>

        {/* Messages Menu */}
        <Menu
          anchorEl={messagesAnchor}
          open={Boolean(messagesAnchor)}
          onClose={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              maxHeight: 300,
              width: 360,
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Messages
            </Typography>
          </Box>
          <Divider />
          {messages.map((message) => (
            <MenuItem key={message.id} onClick={handleClose}>
              <Box sx={{ py: 1 }}>
                <Typography variant="subtitle2">{message.from}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {message.message}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default Header;