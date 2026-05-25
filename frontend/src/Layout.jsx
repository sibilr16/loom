import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useGetMeQuery } from "./services/auth";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "./features/authSlice";
import { useEffect } from "react";

import AuthModal from "./components/AuthModal";

function Layout() {
  const { data: user } = useGetMeQuery(undefined, {
    // Don't retry on 401
    refetchOnMountOrArgChange: false,
  });

  const dispatch = useDispatch();
  const isAuthOpen = useSelector((state) => state.ui.isAuthOpen);
  useEffect(() => {
    if (user) {
      dispatch(setCredentials(user));
    }
  }, [user, dispatch]);

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <Navbar />
      </header>
      <main className="flex-1">
        <Outlet />
        {isAuthOpen && <AuthModal />}
      </main>
      <footer className="border-t border-gray-100 py-6 mt-10 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Loom. All rights reserved.
      </footer>
    </div>
  );
}

export default Layout;
