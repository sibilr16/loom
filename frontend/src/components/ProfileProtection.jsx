import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function ProfileProtection() {
  const user = useSelector((state) => state.auth);

  //   const user = {
  //     isProfileCompleted: true,
  //   };

  console.log(user);
  if (!user?.isProfileCompleted) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProfileProtection;
