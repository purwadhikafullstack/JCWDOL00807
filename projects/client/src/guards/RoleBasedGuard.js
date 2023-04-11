import { Navigate, useLocation } from "react-router-dom";

// Guard cek role ketika login

export default function RoleBasedGuard({ accessibleRoles, children }) {
    let currentRole = localStorage.getItem("my_Role");

    if (!accessibleRoles.includes(currentRole)) {
        return <Navigate to={'/404'} />
    }

    return <>{ children }</>;
}