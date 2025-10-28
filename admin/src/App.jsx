import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import AdminLayout from './components/AdminLayout';
import Dashboard from './components/Dashboard';
import Analytics from './components/Analytics';
import UserManagement from './components/UserManagement';
import TicketManagement from './components/TicketManagement';
import TicketDetails from './components/TicketDetails';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user } = useAuth();
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Analytics />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <AdminRoute>
                <AdminLayout>
                  <UserManagement />
                </AdminLayout>
              </AdminRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <AdminLayout>
                  <TicketManagement />
                </AdminLayout>
              </ProtectedRoute>
            } />
            <Route path="/ticket/:id" element={
              <ProtectedRoute>
                <AdminLayout>
                  <TicketDetails />
                </AdminLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;