import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  MdOutlineDashboard,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { LuLogOut, LuUsers } from "react-icons/lu";
import { BsBagDash } from "react-icons/bs";

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true); // desktop sidebar
  const [isMobileOpen, setIsMobileOpen] = useState(false); // mobile drawer

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {/* {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )} */}
      {/* ///////////////////////////////// */}

      {/* Sidebar */}
      <aside
        className={`fixed bg-green-800 z-50 top-0 transition-all duration-700 left-0 h-full text-gray-800 shadow-lg
        
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        
        ${isOpen ? "w-64" : "w-16"}
        
        `}
      >
        <div className="p-4 hidden md:flex font-bold text-lg">Admin</div>
        <nav className="flex flex-col gap-2 p-2">
          <NavLink to="/dashboard">
            <MdOutlineDashboard />
            <span className={`md:${!isOpen ? "hidden" : "flex"}`}>
              Dashboard
            </span>
          </NavLink>
          <NavLink to="/pro">
            <LuUsers />
            <span className={`md:${!isOpen ? "hidden" : "flex"}`}>Users</span>
          </NavLink>
          <NavLink to="/pro">
            <MdOutlineProductionQuantityLimits />
            <span className={`md:${!isOpen ? "hidden" : "flex"}`}>
              Products
            </span>
          </NavLink>
          <NavLink to="/pro">
            <BsBagDash />
            <span className={`md:${!isOpen ? "hidden" : "flex"}`}>Orders</span>
          </NavLink>
          <NavLink to="/pro">
            <LuLogOut />
            <span className={`md:${!isOpen ? "hidden" : "flex"}`}>Logout</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main area */}
      <div
        className={`flex flex-col flex-1 ml:${isOpen ? "64" : "16"} transition-all duration-700`}
        style={{ marginLeft: isOpen ? "16rem" : "4rem" }}
      >
        <header>
          <button
            onClick={() => setIsMobileOpen(true)}
            className="md:hidden px-3 py-1 bg-gray-200 rounded"
          >
            <GiHamburgerMenu />
          </button>
          {/* Desktop Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:block px-3 py-1 bg-gray-200 rounded"
          >
            <FaArrowRightArrowLeft />
          </button>
          <h1 className="font-semibold">Admin panel</h1>
        </header>

        {/* Page Content */}
        <main className="p-4 overflow-y-auto flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
