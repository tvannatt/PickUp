import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase';

const ProtectedRoute = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  if (error) {
    console.error('Auth error:', error);
    return <div>Auth error</div>;
  }

  return <Outlet />;
};

export default ProtectedRoute;