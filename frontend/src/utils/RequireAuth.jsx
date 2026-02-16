import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default RequireAuth;
