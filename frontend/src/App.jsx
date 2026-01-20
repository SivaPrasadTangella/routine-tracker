import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { RoutineProvider } from './context/RoutineContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import ImportExport from './components/dashboard/ImportExport';
import RoutinesManager from './components/routines/RoutinesManager';
import Analytics from './components/analytics/Analytics';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Profile from './components/auth/Profile';
import NotFound from './components/layout/NotFound';
import ErrorBoundary from './components/layout/ErrorBoundary';

const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <RoutineProvider>
          <ErrorBoundary>
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="routines" element={<RoutinesManager />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="import" element={<ImportExport />} />
                    <Route path="profile" element={<Profile />} />
                  </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ErrorBoundary>
        </RoutineProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
