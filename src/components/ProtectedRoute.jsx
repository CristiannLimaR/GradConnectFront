import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../shared/stores/authStore';
import AccessDenied from './AccessDenied';

const ProtectedRoute = ({ children, allowedRoles = [], showAccessDenied = false }) => {
  const { isAuthenticated, getUser } = useAuthStore();
  const user = getUser();

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no hay roles especificados, permitir acceso
  if (allowedRoles.length === 0) {
    return children;
  }

  // Verificar si el usuario tiene uno de los roles permitidos
  const hasPermission = allowedRoles.includes(user?.role);

  if (!hasPermission) {
    // Si showAccessDenied es true, mostrar la página de acceso denegado
    if (showAccessDenied) {
      return (
        <AccessDenied 
          requiredRole={allowedRoles[0]} 
          currentRole={user?.role}
        />
      );
    }
    
    // Redirigir según el rol del usuario
    switch (user?.role) {
      case 'CANDIDATE':
        return <Navigate to="/user-profile" replace />;
      case 'RECRUITER':
        return <Navigate to="/empresa-dashboard" replace />;
      case 'GRADCONNECT':
        return <Navigate to="/admin" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute; 