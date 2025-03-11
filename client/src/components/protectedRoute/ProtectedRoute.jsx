import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = ({ user, children }) => {
  // const { user } = useSelector((state) => state.authData);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return React.isValidElement(children) ? children : <Outlet />;
};

export default ProtectedRoute;
