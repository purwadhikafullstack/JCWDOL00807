import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

// Guard sebelum login

export default function AuthGuard({ children }) {
    const my_token = localStorage.getItem("my_Token");
    const my_role = localStorage.getItem("my_Role");
    const isAutenticated = my_token ? true : false;
    const isAdmin = my_role == "user" ? false : true;

    if (!isAutenticated) {
        return isAdmin ? <Navigate to={"/admin/login"} /> : <Navigate to={"/login"} />;
    }
    
    return <>{ children }</>;
}

