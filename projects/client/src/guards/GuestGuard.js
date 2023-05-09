import { Navigate } from "react-router-dom";
// import { useSelector } from "react-redux";

// Guard cek token

export default function GuestGuard({ children }) {
  const my_token = localStorage.getItem("my_Token");
  const isAutenticated = my_token ? true : false;

  // if (!isAutenticated) {
  //   return isAdmin ? (
  //     <Navigate to={"/admin/login"} />
  //   ) : (
  //     <Navigate to={"/login"} />
  //   );
  // }

  if (isAutenticated) {
    return <Navigate to={"/"} />;
  }
  return <>{children}</>;
}
