import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthGate: React.FC = () => {
  const { userInfo } = useAuth();

  if (userInfo) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default AuthGate;
