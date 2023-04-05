import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";


export default function AuthGuard({ children }) {
    const my_token = localStorage.getItem("my_Token");
    const isAutenticated = my_token ? true : false
    const { pathname } = useLocation();
    const [requestedLocation, setRequestedLocation] = useState(null);

    // debugger

    if (!isAutenticated) {
        if (pathname !== requestedLocation) {
            setRequestedLocation(pathname)
        }
        return <Navigate to={'/login'} />
    }

    if (requestedLocation && pathname !== requestedLocation) {
        setRequestedLocation(null);
        return <Navigate to={requestedLocation} />;
    }

    return <>{ children }</>;
}