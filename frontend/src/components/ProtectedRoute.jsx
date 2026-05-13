import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../features/authSlice";

function ProtectedRoute() {
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
