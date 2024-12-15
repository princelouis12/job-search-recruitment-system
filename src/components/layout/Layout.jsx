import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { styled } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Toolbar,
  Container,
} from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const Layout = () => {
  const [open, setOpen] = useState(true);
  const { user } = useSelector((state) => state.auth);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Header */}
      <Header 
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Sidebar */}
      <Sidebar
        open={open}
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
        user={user}
      />

      {/* Main Content */}
      <Main open={open}>
        <Toolbar /> {/* This adds space below the header */}
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Main>
    </Box>
  );
};

export default Layout;