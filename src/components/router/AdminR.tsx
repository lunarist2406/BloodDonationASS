import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/User/useAuth";

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, hasRole } = useAuth();
  if (!isAuthenticated()) return <Navigate to="/" />;
  if (!hasRole("ADMIN")) return <Navigate to="/unauthorized" />;
  return <>{children}</>;
};
