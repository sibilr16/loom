import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useGetMeQuery } from "./services/auth";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./features/authSlice";
import { useEffect } from "react";

import AuthModal from "./components/AuthModal";

function Layout() {
  const { data: user } = useGetMeQuery();
  const dispatch = useDispatch();
  const isAuthOpen = useSelector((state) => state.ui.isAuthOpen);
  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    }
  }, [user, dispatch]);

  return (
    <div>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
        {isAuthOpen && <AuthModal />}
      </main>
      <footer></footer>
    </div>
  );
}

export default Layout;
