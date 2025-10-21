// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ComplaintsPage from './pages/ComplaintsPage';
import ComplaintFormPage from './pages/ComplaintFormPage';
import ComplaintDetailsPage from './pages/ComplaintDetailsPage';
import MeetingsPage from './pages/MeetingsPage';
import MeetingFormPage from './pages/MeetingFormPage';
import MeetingDetailsPage from './pages/MeetingDetailsPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminMeetingsPage from './pages/AdminMeetingsPage';
import AdminUserForm from './pages/AdminUserForm';
import AdminUsersPage from './pages/AdminUsersPage';
import ProfilePage from './pages/ProfilePage';
import StudentPortal from './pages/StudentPortal';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import Layout from './components/Layout';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute requiredRole="student">
                  <Layout>
                    <StudentPortal />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints/new" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintFormPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/complaints/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ComplaintDetailsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meetings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MeetingsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meetings/:id" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MeetingDetailsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/meetings/new" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <MeetingFormPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <ProfilePage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/notifications" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <NotificationsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminDashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminUsersPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/new"
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminUserForm />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={<LoginPage />}
            />
            <Route 
              path="/admin/complaints" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminComplaintsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/reports" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminReportsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/meetings" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <AdminMeetingsPage />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 page */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;