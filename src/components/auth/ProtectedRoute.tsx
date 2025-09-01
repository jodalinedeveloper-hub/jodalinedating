import { useAuth } from "@/contexts/SessionContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { session } = useAuth();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;