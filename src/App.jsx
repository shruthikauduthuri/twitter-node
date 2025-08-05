import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Explore from './pages/Explore';
import Login from './pages/Login';
import Register from './pages/Register';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Component to handle auth-based routing
const AppRoutes = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} 
      />
      <Route 
        path="/register" 
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} 
      />

      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout>
            <Home />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Layout>
            <Profile />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/explore" element={
        <ProtectedRoute>
          <Layout>
            <Explore />
          </Layout>
        </ProtectedRoute>
      } />

      {/* Placeholder routes for sidebar items */}
      <Route path="/notifications" element={
        <ProtectedRoute>
          <Layout>
            <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen p-8 text-center">
              <h1 className="text-2xl font-bold text-twitter-black mb-4">Notifications</h1>
              <p className="text-twitter-darkGray">Coming soon...</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/messages" element={
        <ProtectedRoute>
          <Layout>
            <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen p-8 text-center">
              <h1 className="text-2xl font-bold text-twitter-black mb-4">Messages</h1>
              <p className="text-twitter-darkGray">Coming soon...</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/bookmarks" element={
        <ProtectedRoute>
          <Layout>
            <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen p-8 text-center">
              <h1 className="text-2xl font-bold text-twitter-black mb-4">Bookmarks</h1>
              <p className="text-twitter-darkGray">Coming soon...</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/settings" element={
        <ProtectedRoute>
          <Layout>
            <div className="max-w-2xl mx-auto border-x border-twitter-extraLightGray min-h-screen p-8 text-center">
              <h1 className="text-2xl font-bold text-twitter-black mb-4">Settings</h1>
              <p className="text-twitter-darkGray">Coming soon...</p>
            </div>
          </Layout>
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;