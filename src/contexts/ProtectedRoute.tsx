// src/components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

type Props = {
  children: ReactNode;
  requireAuth: boolean; // true = only for logged-in; false = only for logged-out
};

export default function ProtectedRoute({ children, requireAuth }: Props) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If you validate session with server on boot, show a loader while loading=true.
  if (loading) return null; // or a spinner

  if (requireAuth) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace state={{ from: location }} />;
    }
    return <>{children}</>;
  } else {
    if (isAuthenticated) {
      return <Navigate to="/dashboard" replace />;
    }
    return <>{children}</>;
  }
}

