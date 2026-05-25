import { useGetMeQuery } from "../services/auth.js";
import { Navigate, Outlet } from "react-router-dom";

function AdminProtectedRoute() {
  const { data: user, isLoading } = useGetMeQuery();

  if (isLoading) return null;
  if (!user || user.role !== "admin") return <Navigate to="/admin/login" />;

  return <Outlet />;
}

export default AdminProtectedRoute;
