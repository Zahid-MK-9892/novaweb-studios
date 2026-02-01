import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./utils/RequireAuth";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { getToken } from "./utils/auth";
import { Navigate } from "react-router-dom";
import { isAdmin } from "./utils/auth";

const PrivateRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/admin/login" />;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/admin" element={isAdmin() ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        {/* ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
