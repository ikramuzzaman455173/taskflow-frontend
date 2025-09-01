import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requireAuth: boolean;
};

const ProtectedRoute = ({ children, requireAuth }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (requireAuth && !user) {
    // Require login → redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && user) {
    // Prevent logged-in users from seeing public routes like /login
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
