import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import GenerateRoadmap from './pages/GenerateRoadmap';

// Lazy loading to ensure optimal bundle sizing
const RoadmapDetail = lazy(() => import('./pages/RoadmapDetail'));
const Profile = lazy(() => import('./pages/Profile'));

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="top-center" 
          toastOptions={{
            style: {
              background: '#111118',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)',
            }
          }}
        />
        {/* AnimatePresence for page transition handling */}
        <AnimatePresence mode="wait">
          <Routes>
            {/* Landing page explicitly mounted at / */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute>
                  <GenerateRoadmap />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading Profile...</div>}>
                    <Profile />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/roadmap/:id" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="min-h-screen pt-24 text-center">Loading Roadmap...</div>}>
                    <RoadmapDetail />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AnimatePresence>
      </Router>
    </AuthProvider>
  );
};

export default App;
