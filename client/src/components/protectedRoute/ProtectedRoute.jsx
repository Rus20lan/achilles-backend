import React from 'react';
import { Component } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router';

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.authData.user);
  const token = localStorage.getItem('token'); // ПРОВЕРКА НАЛИЧИЯ ТОКЕНА
  if (!user || !token) {
    return <Navigate to="/auth/login" replace />;
  }

  return React.isValidElement(children) ? children : <Outlet />;
};

export default ProtectedRoute;
