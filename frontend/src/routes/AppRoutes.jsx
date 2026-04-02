import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import NotFound from "../pages/notfound/NotFound";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import CheckEmail from "../pages/auth/CheckEmail";
import Landing from "../pages/landing/Landing";
import Inventory from "../pages/inventory/Inventory";
import AddItem from "../pages/additem/AddItem";
import ScanExpiry from "../pages/scanexpiry/ScanExpiry";
import Analytics from "../pages/analytics/Analytics";
import Notifications from "../pages/notifications/Notifications";
// import Settings from "../pages/settings/Settings";
import Profile from "../pages/profile/Profile";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      
      {/* <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Register />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /> </ProtectedRoute>} />
      <Route path="/inventory" element={<Inventory />} />
      <Route path="/add-item" element={<AddItem />} />
      <Route path="/scan-expiry" element={<ScanExpiry />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/profile" element={<Profile />} />

      <Route path="*" element={<NotFound />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/" element={<Landing />} /> */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/check-email" element={<CheckEmail />} />
      <Route path="/" element={<Landing />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      {/* 🔒 Protected Routes Group */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/add-item" element={<AddItem />} />
        <Route path="/scan-expiry" element={<ScanExpiry />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
