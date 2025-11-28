import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const user = jwtDecode(token);
  if (adminOnly && user.role !== "admin") return <Navigate to="/dashboard" />;

  return children;
};

export default ProtectedRoute;
