import React from 'react';
import { Navigate } from 'react-router-dom';
import { checkAdminSession } from '../utils/session';

/**
 * Route protection wrapper component.
 * Redirects to homepage if the admin session is absent or expired.
 */
const ProtectedRoute = ({ children }) => {
  const isAuthorized = checkAdminSession();

  if (!isAuthorized) {
    console.warn('[Security] Unauthorized route access attempt redirected to homepage.');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
