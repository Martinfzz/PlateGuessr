import React from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  const { user } = useAuthContext();

  return user ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
