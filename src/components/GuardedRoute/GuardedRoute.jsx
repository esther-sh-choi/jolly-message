import React from 'react';
import { Navigate } from 'react-router-dom';

const GuardedRoute = ({ auth, children }) => {
  if (auth) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
};

export default GuardedRoute;
