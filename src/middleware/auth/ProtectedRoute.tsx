import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/User/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, hasRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated()) {
    // Chuyển hướng đến trang đăng nhập nếu chưa xác thực
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Chuyển hướng về trang chủ nếu không có vai trò yêu cầu
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
