
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { user } = useAuth();
  const location = useLocation();

  // If route requires authentication and user is not logged in
  if (requireAuth && !user) {
    // Redirect to login page with the current location as state
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is for unauthenticated users (login/register) and user is logged in
  if (!requireAuth && user) {
    // Get the intended destination from location state or default to dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    return <Navigate to={from} replace />;
  }

  return <>{children}</>;
}
