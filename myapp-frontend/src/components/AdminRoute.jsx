import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ user, children }) => {
  const token = localStorage.getItem("token");

  if (!token || !user) return <Navigate to="/" replace />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.is_admin) return <Navigate to="/" replace />;
  } catch (err) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;