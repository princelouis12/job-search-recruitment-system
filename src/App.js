import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import JobManagement from './components/jobs/JobManagement';
import EmployerJobs from './pages/employer/EmployerJobs';
import JobSearch from './components/search/JobSearch';
import EmployerApplications from './pages/employer/EmployerApplications';
import ApplicationDetailPage from './pages/applications/ApplicationDetailPage';
import EnhancedDashboard from './pages/jobseeker/EnhancedDashboard';
import SavedJobs from './pages/jobseeker/SavedJobs';
import MyApplications from './pages/jobseeker/MyApplications';
// Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';

// Role-based dashboard component
const RoleBasedDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  
  switch (user?.role?.toLowerCase()) {
    case 'jobseeker':
      return <EnhancedDashboard />;
    case 'employer':
      return <Dashboard />;  // Your existing employer dashboard
    case 'admin':
      return <Dashboard />;  // Your existing admin dashboard
    default:
      return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Role-based dashboard routing */}
            <Route path="/dashboard" element={<RoleBasedDashboard />} />
            
            {/* Job Seeker specific routes */}
            <Route path="/jobs/search" element={<JobSearch />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/my-applications" element={<MyApplications />} />
            
            {/* Employer specific routes */}
            <Route path="/jobs/manage" element={<JobManagement />} />
            <Route path="/employer/jobs" element={<EmployerJobs />} />
            <Route path="/employer/applications" element={<EmployerApplications />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            
            {/* Common routes */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;