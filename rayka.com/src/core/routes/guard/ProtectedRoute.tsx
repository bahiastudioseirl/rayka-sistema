import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isAuthenticated || userRole !== 'administrator') {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};