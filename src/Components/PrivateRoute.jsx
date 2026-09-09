import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// Booking needs a signed-in user, because every cart row in db.json is keyed by
// the owner's email. Signed-out visitors get sent to the login page.
export const PrivateRoute = ({ children }) => {
  const isAuth = useSelector((store) => store.LoginReducer.isAuth);

  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};
