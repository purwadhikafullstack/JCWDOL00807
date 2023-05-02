import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Guard cek token

export default function GuestGuard({ children }) {
  // let user = useSelector((state) => state.auth);
  // const my_token = localStorage.getItem("my_Token");
  // const isAutenticated = my_token ? true : false;
  // if (!isAutenticated) {
  //   return <Navigate to={"/login"} />;
  // }

  return <>{children}</>;

  // if (user?.loading === false) {
  //   const my_token = localStorage.getItem("my_Token");
  //   const isAutenticated = my_token ? true : false;

  //   if (isAutenticated && user.user.name) {
  //     return <Navigate to={"/"} />;
  //   }
  //   return <>{children}</>;
  // } else {
  //   return <>{children}</>;
  // }
}
