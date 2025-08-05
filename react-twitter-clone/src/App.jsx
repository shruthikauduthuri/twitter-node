import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import { useAuth } from './context/AuthContext';

// Component to handle auth-based routing
const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-twitter-dark flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={!isAuthenticated ? <LoginForm /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/register" 
        element={!isAuthenticated ? <RegisterForm /> : <Navigate to="/" replace />} 
      />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="explore" element={<div className="p-8 text-center text-twitter-gray">Explore page coming soon...</div>} />
        <Route path="notifications" element={<div className="p-8 text-center text-twitter-gray">Notifications page coming soon...</div>} />
        <Route path="messages" element={<div className="p-8 text-center text-twitter-gray">Messages page coming soon...</div>} />
        <Route path="bookmarks" element={<div className="p-8 text-center text-twitter-gray">Bookmarks page coming soon...</div>} />
        <Route path="settings" element={<div className="p-8 text-center text-twitter-gray">Settings page coming soon...</div>} />
      </Route>
      
      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <AppRoutes />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;