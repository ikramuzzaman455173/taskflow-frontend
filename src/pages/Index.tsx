
import React from 'react';
import { Navigate } from 'react-router-dom';

const Index = () => {
  // This page now just redirects to dashboard, which will handle authentication
  return <Navigate to="/dashboard" replace />;
};

export default Index;
