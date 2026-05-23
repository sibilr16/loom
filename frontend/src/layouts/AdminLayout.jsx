import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  MdOutlineDashboard,
  MdOutlineProductionQuantityLimits,
} from "react-icons/md";
import { LuLogOut, LuUsers } from "react-icons/lu";
import { BsBagDash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { ChevronsLeft, ChevronsRight, ShoppingBag } from "lucide-react";
import { useLogoutMutation } from "../services/auth";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 ${
    isActive
      ? "bg-gray-100 text-gray-900 font-medium"
      : "text-gray-800 hover:bg-gray-100 hover:text-gray-950"
  }`;

function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [logout] = useLogoutMutation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      navigate("/admin/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed z-50 top-0 left-0 h-full bg-white shadow-sm border-r border-gray-200 transition-all duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${isOpen ? "w-56" : "w-14"}
        `}
      >
        {/* Logo */}
        <div className="h-13 flex items-center px-4 border-b border-gray-100">
          {isOpen && (
            <span className="font-semibold text-sm tracking-widest uppercase text-gray-700">
              Admin
            </span>
          )}
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="md:hidden absolute top-3 right-3 p-1 rounded text-gray-400 hover:text-gray-600"
          aria-label="Close menu"
        >
          <IoClose size={18} />
        </button>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-2 pt-3">
          <NavLink to="/dashboard" className={navLinkClass}>
            <MdOutlineDashboard size={18} className="shrink-0" />
            {isOpen && <span>Dashboard</span>}
          </NavLink>
          <NavLink to="/user-list" className={navLinkClass}>
            <LuUsers size={18} className="shrink-0" />
            {isOpen && <span>Users</span>}
          </NavLink>
          <NavLink to="/product-list" className={navLinkClass}>
            <MdOutlineProductionQuantityLimits size={18} className="shrink-0" />
            {isOpen && <span>Products</span>}
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClass}>
            <ShoppingBag size={18} className="shrink-0" />
            {isOpen && <span>Orders</span>}
          </NavLink>

          <div className="my-1 border-t border-gray-100" />

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors duration-150 text-red-400 hover:bg-red-50 w-full cursor-pointer"
          >
            <LuLogOut size={18} className="shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </nav>
      </aside>

      {/* Main area */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${isOpen ? "md:ml-56" : "md:ml-14"}`}
      >
        {/* Header */}
        <header className="h-13 flex items-center justify-between px-4 bg-white border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
              aria-label="Open menu"
            >
              <GiHamburgerMenu size={16} />
            </button>

            {/* Desktop toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="hidden cursor-pointer md:flex p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200"
              aria-label="Toggle sidebar"
            >
              {isOpen ? (
                <ChevronsLeft size={16} />
              ) : (
                <ChevronsRight size={16} />
              )}
            </button>

            <h1 className="font-semibold text-sm text-gray-700">Admin Panel</h1>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
