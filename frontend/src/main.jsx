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
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Profile from "./pages/Profile.jsx";
import ProductTable from "./pages/admin/ProductTable.jsx";
import Checkout from "./pages/Checkout.jsx";
import ProfileProtection from "./components/ProfileProtection.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import UsersList from "./pages/admin/UsersList.jsx";
import OrderList from "./pages/admin/OrderList.jsx";

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
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route
              path="/complete-profile"
              element={<CompleteProfileModal />}
            />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/product-list" element={<ProductTable />} />
            <Route path="/user-list" element={<UsersList />} />
            <Route path="/order-list" element={<OrderList />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
