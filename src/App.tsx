
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from "@/components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Root route - redirect to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Login/Register routes - only accessible when not authenticated */}
              <Route 
                path="/login" 
                element={
                  <ProtectedRoute requireAuth={false}>
                    <LoginPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Dashboard routes - only accessible when authenticated */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute requireAuth={true}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
            className="toast-container"
            toastClassName="toast-custom"
          />
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
