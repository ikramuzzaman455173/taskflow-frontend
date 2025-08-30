
import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <Card className="w-full max-w-lg border-2 border-border/50 shadow-xl backdrop-blur-sm bg-card/95">
        <CardHeader className="text-center pb-6">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>
          <CardTitle className="text-6xl font-bold text-primary mb-2">404</CardTitle>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-muted-foreground">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Error Details */}
          <div className="p-4 bg-muted/30 rounded-lg border border-border/30">
            <div className="flex items-center gap-2 mb-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Requested URL:</span>
            </div>
            <code className="text-sm text-muted-foreground bg-background px-2 py-1 rounded border">
              {location.pathname}
            </code>
          </div>

          {/* Helpful Suggestions */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">What you can do:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Check if the URL is spelled correctly
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                Go back to the previous page
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {user ? 'Return to your dashboard' : 'Go to the login page'}
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="flex items-center gap-2 border-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={handleGoHome}
                className="flex items-center gap-2 gradient-bg hover:opacity-90"
              >
                <Home className="h-4 w-4" />
                {user ? 'Dashboard' : 'Home'}
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-4 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              If you believe this is an error, please contact support.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
