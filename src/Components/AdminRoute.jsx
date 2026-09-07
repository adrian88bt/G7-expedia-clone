import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Guards the /admin pages. Signed-out visitors go to the login page; signed-in
// non-admins go home. The is_admin flag lives on the user's db.json profile.
export const AdminRoute = ({ children }) => {
  const isAuth = useSelector((store) => store.LoginReducer.isAuth);
  const activeUser = useSelector((store) => store.LoginReducer.activeUser);

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (!activeUser.is_admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};
