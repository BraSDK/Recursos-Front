import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Verificamos si el token existe en el almacenamiento local
  const token = localStorage.getItem('auth_token');

  // Si no hay token, redirigimos al login inmediatamente y evitamos que vuelva atrás con "replace"
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token, dejamos que pase a ver la pantalla que solicitó
  return children;
};

export default ProtectedRoute;