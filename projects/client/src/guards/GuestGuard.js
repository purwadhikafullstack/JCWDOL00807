import { Navigate } from "react-router-dom";


export default function GuestGuard({ children }) {
    const my_token = localStorage.getItem("my_Token");
    const isAutenticated = my_token ? true : false

    if (isAutenticated) {
        return <Navigate to={'/'} />
    }

    return <>{ children }</>;
}