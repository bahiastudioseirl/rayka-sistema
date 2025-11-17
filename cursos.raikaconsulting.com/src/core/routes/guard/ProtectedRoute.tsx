import { Navigate } from 'react-router-dom';
import { type ReactNode } from 'react';
import { AuthStore } from '../../components/auth/services/AuthStore';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const isAuthenticated = AuthStore.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Si se requiere un rol específico, validarlo
  if (requiredRole) {
    const userRole = AuthStore.getUserRole();
    if (userRole !== requiredRole) {
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};