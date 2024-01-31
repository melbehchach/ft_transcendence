"use client";
import withAuth from "../app/AuthGuard";
import { useAuth } from "../app/context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { state } = useAuth();
  if (state.user) return <>{children}</>;
  return <>loading...</>;
};

export default withAuth(ProtectedRoute);
