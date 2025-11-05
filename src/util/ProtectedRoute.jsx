import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, isDoctor } from "./jwtdecoder";

const ProtectedRoute = ({ children, requireDoctor = false }) => {
  const isAuth = isAuthenticated();
  const isDoctorUser = isDoctor();

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requireDoctor && !isDoctorUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
