import { Navigate, useLocation } from "react-router-dom";

export default function RoleBasedGuard({ accessibleRoles, children }) {
    let currentRole = localStorage.getItem("my_Role");

    if (!accessibleRoles.includes(currentRole)) {
        return <Navigate to={'/404'} />
    }

    return <>{ children }</>;
}