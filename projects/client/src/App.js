import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import SidebarAdmin from "./components/SidebarAdmin";

import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { keepLogin } from "./redux/action/user";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(keepLogin());
  }, [dispatch]);

  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/home-admin" element={<SidebarAdmin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/accounts/reset-password" element={<ForgotPassword />} />
        <Route
          path="/accounts/reset-password/:token"
          element={<ResetPassword />}
        />
      </Routes>
    </div>
  );
}

export default App;
