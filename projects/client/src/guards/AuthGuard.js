import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Guard sebelum login

export default function AuthGuard({ children }) {
  const my_token = localStorage.getItem("my_Token");
  const my_Role = localStorage.getItem("my_Role");
  const isAutenticated = my_token ? true : false;

  if (!isAutenticated) {
    return <Navigate to={"/login"} />;
  }

  return <>{children}</>;
}
