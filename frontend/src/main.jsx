import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { store } from "./store.js";
import CompleteProfileModal from "./pages/CompleteProfileModal.jsx";
import OtpModal from "./components/OtpModal.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AuthModal from "./components/AuthModal.jsx";
import Layout from "./Layout.jsx";
import Profile from "./pages/Profile.jsx";
import ProductTable from "./pages/admin/ProductTable.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import UserTable from "./pages/admin/UserTable.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderTable from "./pages/admin/OrderTable.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/AdminProtectedRoute.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" reverseOrder={false} />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<Layout />}>
            <Route index path="/" element={<Products />} />
            <Route path="/product/:category/:id" element={<ProductDetails />} />
            <Route
              path="/complete-profile"
              element={<CompleteProfileModal />}
            />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<MyOrders />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          <Route element={<AdminProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/products" element={<ProductTable />} />
              <Route path="/admin/users" element={<UserTable />} />
              <Route path="/admin/orders" element={<OrderTable />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
